// botManager.js
import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs-extra";
import path from "path";

const SESSIONS_DIR = path.join(process.cwd(), "sessions");

// bot defaults you asked
const BOT_NAME = "< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ɪɴɪ 🧚‍♀️";
const OWNER_NAME = "Mr Sandesh Bhashana";
const OWNER_NUMBER = "+94741259325";
const CHANNEL_JID = "20363402220977044@newsletter";
const BOT_IMAGE = "https://files.catbox.moe/xu4725.jpg";

const AUTO_LIKE_RATE_LIMIT_MS = 5 * 1000;
const MAX_LIKES_PER_MINUTE = 30;

// Keep a map of running sessions to avoid duplicates
const running = new Map();

export async function startAllSessions() {
  await fs.ensureDir(SESSIONS_DIR);
  const folders = await fs.readdir(SESSIONS_DIR);
  for (const f of folders) {
    if (!running.has(f)) {
      startSessionBot(f).catch(err => console.error(`startSessionBot(${f}) failed:`, err));
      // small delay to avoid race
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

async function loadSettings(sessionId) {
  const sfile = path.join(SESSIONS_DIR, sessionId, "settings.json");
  if (!(await fs.pathExists(sfile))) {
    const defaultSettings = {
      alwaysOnline: false,
      antiDelete: true,
      antiViewOnce: true,
      autoLike: false,
      likedStatus: [],
      lastAutoLikeAt: 0,
      likesThisWindow: 0,
      windowStart: Date.now()
    };
    await fs.writeJson(sfile, defaultSettings, { spaces: 2 });
    return defaultSettings;
  }
  return fs.readJson(sfile);
}
async function saveSettings(sessionId, settings) {
  const sfile = path.join(SESSIONS_DIR, sessionId, "settings.json");
  await fs.writeJson(sfile, settings, { spaces: 2 });
}

async function startSessionBot(sessionId) {
  const dir = path.join(SESSIONS_DIR, sessionId);
  if (!(await fs.pathExists(dir))) {
    console.warn("session dir missing:", dir);
    return;
  }
  running.set(sessionId, { status: "starting" });

  const { state, saveCreds } = await useMultiFileAuthState(dir);
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    version,
    browser: [BOT_NAME, "Chrome", "1.0"]
  });

  conn.ev.on("creds.update", saveCreds);

  let settings = await loadSettings(sessionId);
  settings.likedStatus = settings.likedStatus || [];

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log(`[${sessionId}] connected`);
      // send connect announcement to configured channel (best-effort)
      const buttons = [
        { buttonId: "ping", buttonText: { displayText: "Ping Bot" }, type: 1 },
        { buttonId: "owner", buttonText: { displayText: "Owner Info" }, type: 1 }
      ];
      const msg = {
        image: { url: BOT_IMAGE },
        caption:
          `👑 ${BOT_NAME}\n\n` +
          `🧾 Owner: ${OWNER_NAME}\n` +
          `📞 ${OWNER_NUMBER}\n\n` +
          `✨ Bot is now Online! (session: ${sessionId})`,
        footer: "QUEEN-JUSMY-MINI",
        buttons,
        headerType: 4
      };
      try {
        await conn.sendMessage(CHANNEL_JID, msg);
      } catch (e) {
        console.log(`[${sessionId}] warn: cannot send connect message to channel: ${e?.message || e}`);
      }
    }
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log(`[${sessionId}] connection closed:`, reason || lastDisconnect?.error?.message || lastDisconnect);
      if (reason !== DisconnectReason.loggedOut) {
        // restart after delay
        setTimeout(() => startSessionBot(sessionId).catch(console.error), 2000);
      } else {
        console.log(`[${sessionId}] logged out. Remove session folder to re-scan.`);
      }
    }
  });

  // presence keep-alive when alwaysOnline true
  setInterval(async () => {
    try {
      if (settings.alwaysOnline) await conn.sendPresenceUpdate("available");
    } catch {}
  }, 20_000);

  // anti-delete handler
  conn.ev.on("messages.update", async (updates) => {
    if (!settings.antiDelete) return;
    for (const upd of updates) {
      try {
        if (!upd.update || upd.update.message == null) {
          const key = upd.key;
          const sender = key.participant || key.remoteJid;
          const toJid = key.remoteJid;
          await conn.sendMessage(toJid, {
            text: `♻️ *Deleted Message Detected*\nFrom: @${(sender || "").split?.("@")?.[0] || sender}`,
            mentions: sender ? [sender] : []
          });
        }
      } catch {}
    }
  });

  // messages handler + button replies + view-once rescue + commands
  conn.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const m = messages[0];
      if (!m) return;
      if (!m.message) return;
      if (m.key && m.key.fromMe) return;

      const jid = m.key.remoteJid;
      // button response
      if (m.message.buttonsResponseMessage) {
        const bid = m.message.buttonsResponseMessage.selectedButtonId;
        if (bid === "ping") await conn.sendMessage(jid, { text: "🏓 PONG! QUEEN-JUSMY-MINI here." });
        if (bid === "owner") await conn.sendMessage(jid, { text: `👤 Owner: ${OWNER_NAME}\n📞 ${OWNER_NUMBER}` });
        return;
      }

      // anti-view-once
      const v1 = m.message.viewOnceMessage?.message;
      const v2 = m.message.viewOnceMessageV2?.message;
      const media = v2 || v1;
      if (settings.antiViewOnce && media) {
        try {
          await conn.sendMessage(jid, { text: "👁 View-once prevented — saving content..." });
          await conn.sendMessage(jid, media, { quoted: m });
        } catch {}
      }

      // text commands
      const text =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        (m.message.imageMessage && m.message.imageMessage.caption) ||
        "";
      if (!text) return;
      const low = text.trim().toLowerCase();

      if (low === ".menu") {
        const menu = `👑 QUEEN-JUSMY-MINI MENU

⚙ Settings:
• .always on / off
• .antidelete on / off
• .antiviewonce on / off
• .autolike on / off

📦 Session:
• .session (show current session)
• .statuslog (show liked statuses)

Type "hi" to test.`;
        await conn.sendMessage(jid, { text: menu });
        return;
      }

      if (low === "hi") { await conn.sendMessage(jid, { text: `Hey 👋 I'm ${BOT_NAME}` }); return; }
      if (low === ".always on") { settings.alwaysOnline = true; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Always Online: ON" }); return; }
      if (low === ".always off") { settings.alwaysOnline = false; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Always Online: OFF" }); return; }

      if (low === ".antidelete on") { settings.antiDelete = true; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Anti-Delete: ON" }); return; }
      if (low === ".antidelete off") { settings.antiDelete = false; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Anti-Delete: OFF" }); return; }

      if (low === ".antiviewonce on") { settings.antiViewOnce = true; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Anti-View-Once: ON" }); return; }
      if (low === ".antiviewonce off") { settings.antiViewOnce = false; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Anti-View-Once: OFF" }); return; }

      if (low === ".autolike on") { settings.autoLike = true; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Status Auto-Like: ON" }); return; }
      if (low === ".autolike off") { settings.autoLike = false; await saveSettings(sessionId, settings); await conn.sendMessage(jid, { text: "✅ Status Auto-Like: OFF" }); return; }

      if (low.startsWith(".session")) { await conn.sendMessage(jid, { text: `Current Session: ${sessionId}` }); return; }
      if (low.startsWith(".statuslog")) { const log = (settings.likedStatus && settings.likedStatus.length) ? settings.likedStatus.join("\n") : "No statuses liked yet."; await conn.sendMessage(jid, { text: `📝 Liked Status Log:\n${log}` }); return; }

    } catch (e) {
      // ignore handler errors to keep bot alive
    }
  });

  // statuses update handler (auto-like)
  conn.ev.on("statuses.update", async (updates) => {
    try {
      if (!settings.autoLike) return;

      const now = Date.now();
      if (!settings.windowStart || now - settings.windowStart > 60_000) {
        settings.windowStart = now;
        settings.likesThisWindow = 0;
      }

      for (const st of updates) {
        const statusId = st.id;
        const owner = statusId?.split?.("_")?.[0];
        if (!statusId || !owner) continue;
        settings.likedStatus = settings.likedStatus || [];
        if (settings.likedStatus.includes(statusId)) continue;

        // safety checks
        const lastAt = settings.lastAutoLikeAt || 0;
        const sinceLast = now - lastAt;
        if (sinceLast < AUTO_LIKE_RATE_LIMIT_MS) continue;
        if ((settings.likesThisWindow || 0) >= MAX_LIKES_PER_MINUTE) continue;

        const statusJid = `${owner}@s.whatsapp.net`;
        try {
          await conn.sendMessage(statusJid, {
            react: { text: "❤️", key: { id: statusId, remoteJid: statusJid } }
          });
          settings.likedStatus.push(statusId);
          settings.lastAutoLikeAt = Date.now();
          settings.likesThisWindow = (settings.likesThisWindow || 0) + 1;
          await saveSettings(sessionId, settings);
          console.log(`[${sessionId}] Auto-liked status ${statusId} from ${statusJid}`);
        } catch (e) {
          console.log(`[${sessionId}] Auto-like error:`, e?.message || e);
        }
      }
    } catch (e) { }
  });

  // persist settings every 15s
  setInterval(() => saveSettings(sessionId, settings), 15_000);

  running.set(sessionId, { conn, settings });
  console.log(`[${sessionId}] initialized`);
}

export { startAllSessions };
