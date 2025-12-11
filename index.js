/**
 * QUEEN-JUSMY-MINI PRO — Full Bot (index.js)
 * Features:
 *  - Multi-session (session folders under ./sessions/<id>/)
 *  - Always-online toggle
 *  - Anti-delete toggle
 *  - Anti-view-once toggle
 *  - Status auto-like toggle (one like per status per session + rate limit)
 *  - Connect announcement to a configured channel with image + buttons
 *  - Button reply handler (Ping, Owner)
 *  - Commands: .menu .always on/off .antidelete on/off .antiviewonce on/off .autolike on/off .statuslog .session hi
 *
 * Usage:
 *  - Put desired session IDs in SESSIONS array (or leave empty => "QUEEN-JUSMY-MINI" default)
 *  - Run: npm install && node index.js
 *
 * IMPORTANT: Use responsibly. Auto-like / auto actions should not be used to spam or boost metrics abusively.
 */

import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import P from "pino";
import fs from "fs-extra";
import path from "path";

// ====== CONFIG ======
const SESSIONS = [
  // Put your session IDs here as strings. If empty, "QUEEN-JUSMY-MINI" will be used.
  "QJUSMY=P4hgxa4J#BADUDZMWGpW9R8_-w480eUvfbMt8rnfduf45D6uLQE4"
];

const BOT_NAME = "< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ɪɴɪ 🧚‍♀️";
const OWNER_NAME = "Mr Sandesh Bhashana";
const OWNER_NUMBER = "94741259325"; // add + country code
const CHANNEL_JID = "20363402220977044@newsletter"; // announcement target
const BOT_IMAGE = "https://files.catbox.moe/xu4725.jpg";

// Auto-like policy (safe defaults)
const AUTO_LIKE_RATE_LIMIT_MS = 5 * 1000; // min ms between auto-likes per session (adjust carefully)
const MAX_LIKES_PER_MINUTE = 30; // extra safety

// ===== helpers =====
function sessionDir(id) {
  return path.join(process.cwd(), "sessions", id);
}
async function loadSessionSettings(id) {
  const dir = sessionDir(id);
  await fs.ensureDir(dir);
  const file = path.join(dir, "settings.json");
  if (!(await fs.pathExists(file))) {
    const defaultSettings = {
      alwaysOnline: false,
      antiDelete: true,
      antiViewOnce: true,
      autoLike: true,
      likedStatus: [], // ids liked already
      lastAutoLikeAt: 0,
      likesThisWindow: 0,
      windowStart: Date.now()
    };
    await fs.writeJson(file, defaultSettings, { spaces: 2 });
    return defaultSettings;
  } else {
    return fs.readJson(file);
  }
}
async function saveSessionSettings(id, settings) {
  const file = path.join(sessionDir(id), "settings.json");
  await fs.writeJson(file, settings, { spaces: 2 });
}

// ===== start per-session bot =====
async function startSessionBot(sessionId) {
  try {
    const dir = sessionDir(sessionId);
    await fs.ensureDir(dir);
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
      logger: P({ level: "silent" }),
      printQRInTerminal: true,
      auth: state,
      version,
      browser: [QUEEN-JUSMY, "Chrome", "1.0"]
    });

    conn.ev.on("creds.update", saveCreds);

    // load session settings
    let settings = await loadSessionSettings(sessionId);

    // utility to update settings & persist
    async function updateSetting(key, value) {
      settings[key] = value;
      await saveSessionSettings(sessionId, settings);
    }

    // ensure likedStatus exists
    settings.likedStatus = settings.likedStatus || [];

    // connection updates
    conn.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "open") {
        console.log(`🟢 [${sessionId}] Connected`);
        // send connect announcement to channel (safe: send message; joining channel requires invites)
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
            `✨ Bot is now Online! (Session: ${sessionId})`,
          footer: "QUEEN-JUSMY-MINI",
          buttons,
          headerType: 4
        };
        try {
          await conn.sendMessage(CHANNEL_JID, msg);
        } catch (e) {
          console.log(`[${sessionId}] Warning: couldn't send connect message to channel: ${e?.message || e}`);
        }
      }
      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        console.log(`[${sessionId}] connection closed:`, reason || lastDisconnect?.error?.message || lastDisconnect);
        if (reason !== DisconnectReason.loggedOut) {
          console.log(`[${sessionId}] Reconnecting...`);
          // restart this session after short delay
          setTimeout(() => startSessionBot(sessionId), 2000);
        } else {
          console.log(`[${sessionId}] Session logged out - delete session folder to re-scan.`);
        }
      }
    });

    // keep presence if alwaysOnline
    setInterval(async () => {
      try {
        if (settings.alwaysOnline) await conn.sendPresenceUpdate("available");
      } catch {}
    }, 20_000);

    // Anti-delete: listen for updates
    conn.ev.on("messages.update", async (updates) => {
      if (!settings.antiDelete) return;
      for (const upd of updates) {
        try {
          // If a message was deleted, WhatsApp often supplies update with message == null
          if (!upd.update || upd.update.message == null) {
            const key = upd.key;
            const sender = key.participant || key.remoteJid;
            const toJid = key.remoteJid;
            // Notify in same chat (safe)
            await conn.sendMessage(toJid, {
              text: `♻️ *Deleted Message Detected*\nFrom: @${(sender || '').split?.("@")?.[0] || sender}`,
              mentions: sender ? [sender] : []
            });
          }
        } catch (e) {
          // ignore errors
        }
      }
    });

    // messages handler
    conn.ev.on("messages.upsert", async ({ messages, type }) => {
      const m = messages[0];
      if (!m) return;
      if (!m.message) return;
      if (m.key && m.key.fromMe) return;

      const jid = m.key.remoteJid;
      const text =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        (m.message.imageMessage && m.message.imageMessage.caption) ||
        "";

      // handle button replies (buttonsResponseMessage)
      if (m.message.buttonsResponseMessage) {
        const btnId = m.message.buttonsResponseMessage.selectedButtonId;
        if (btnId === "ping") {
          await conn.sendMessage(jid, { text: "🏓 PONG! QUEEN-JUSMY-MINI here." });
        } else if (btnId === "owner") {
          await conn.sendMessage(jid, { text: `👤 Owner: ${OWNER_NAME}\n📞 ${OWNER_NUMBER}` });
        }
        return;
      }

      // anti-view-once: try to catch view-once messages (structure may vary)
      if (settings.antiViewOnce) {
        // viewOnceMessageV2 or viewOnceMessage
        const v1 = m.message.viewOnceMessage?.message;
        const v2 = m.message.viewOnceMessageV2?.message;
        const media = v2 || v1;
        if (media) {
          try {
            // forward the media back to chat (quoted)
            await conn.sendMessage(jid, { text: "👁 View-once prevented — saving content..." });
            await conn.sendMessage(jid, media, { quoted: m });
          } catch (e) {
            // ignore
          }
        }
      }

      // Commands
      if (text) {
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
        if (low === "hi") {
          await conn.sendMessage(jid, { text: `Hey 👋 I'm ${BOT_NAME}` });
          return;
        }
        if (low === ".always on") {
          await updateSetting("alwaysOnline", true);
          settings.alwaysOnline = true;
          await conn.sendMessage(jid, { text: "✅ Always Online: ON" });
          return;
        }
        if (low === ".always off") {
          await updateSetting("alwaysOnline", false);
          settings.alwaysOnline = false;
          await conn.sendMessage(jid, { text: "✅ Always Online: OFF" });
          return;
        }
        if (low === ".antidelete on") {
          await updateSetting("antiDelete", true);
          settings.antiDelete = true;
          await conn.sendMessage(jid, { text: "✅ Anti-Delete: ON" });
          return;
        }
        if (low === ".antidelete off") {
          await updateSetting("antiDelete", false);
          settings.antiDelete = false;
          await conn.sendMessage(jid, { text: "✅ Anti-Delete: OFF" });
          return;
        }
        if (low === ".antiviewonce on") {
          await updateSetting("antiViewOnce", true);
          settings.antiViewOnce = true;
          await conn.sendMessage(jid, { text: "✅ Anti-View-Once: ON" });
          return;
        }
        if (low === ".antiviewonce off") {
          await updateSetting("antiViewOnce", false);
          settings.antiViewOnce = false;
          await conn.sendMessage(jid, { text: "✅ Anti-View-Once: OFF" });
          return;
        }
        if (low === ".autolike on") {
          await updateSetting("autoLike", true);
          settings.autoLike = true;
          await conn.sendMessage(jid, { text: "✅ Status Auto-Like: ON" });
          return;
        }
        if (low === ".autolike off") {
          await updateSetting("autoLike", false);
          settings.autoLike = false;
          await conn.sendMessage(jid, { text: "✅ Status Auto-Like: OFF" });
          return;
        }
        if (low.startsWith(".session")) {
          await conn.sendMessage(jid, { text: `Current Session: ${sessionId}` });
          return;
        }
        if (low.startsWith(".statuslog")) {
          const log = (settings.likedStatus && settings.likedStatus.length) ? settings.likedStatus.join("\n") : "No statuses liked yet.";
          await conn.sendMessage(jid, { text: `📝 Liked Status Log:\n${log}` });
          return;
        }
      }
    });

    // statuses update handler (auto-like)
    conn.ev.on("statuses.update", async (updates) => {
      try {
        if (!settings.autoLike) return;

        // rate window reset
        const now = Date.now();
        if (!settings.windowStart || now - settings.windowStart > 60_000) {
          settings.windowStart = now;
          settings.likesThisWindow = 0;
        }

        for (const st of updates) {
          // st.id often like "<user>_<timestamp>"
          const statusId = st.id;
          const owner = statusId?.split?.("_")?.[0];
          if (!statusId || !owner) continue;

          // already liked?
          settings.likedStatus = settings.likedStatus || [];
          if (settings.likedStatus.includes(statusId)) continue;

          // safety checks: rate limits
          const lastAt = settings.lastAutoLikeAt || 0;
          const sinceLast = now - lastAt;
          if (sinceLast < AUTO_LIKE_RATE_LIMIT_MS) continue;
          if ((settings.likesThisWindow || 0) >= MAX_LIKES_PER_MINUTE) continue;

          // perform react to status (send react to owner's status JID)
          const statusJid = `${owner}@s.whatsapp.net`;
          try {
            await conn.sendMessage(statusJid, {
              react: { text: "❤️", key: { id: statusId, remoteJid: statusJid } }
            });
            // mark liked
            settings.likedStatus.push(statusId);
            settings.lastAutoLikeAt = Date.now();
            settings.likesThisWindow = (settings.likesThisWindow || 0) + 1;
            await saveSessionSettings(sessionId, settings);
            console.log(`[${sessionId}] Auto-liked status ${statusId} from ${statusJid}`);
          } catch (e) {
            console.log(`[${sessionId}] Auto-like error:`, e?.message || e);
          }
        }
      } catch (e) {
        // ignore
      }
    });

    // persist settings periodically (in case updated in memory)
    setInterval(() => saveSessionSettings(sessionId, settings), 15_000);

    // done
    console.log(`[${sessionId}] Bot initialized (settings loaded).`);
  } catch (err) {
    console.error(`Failed to start session ${sessionId}:`, err);
  }
}

// start all sessions
(async () => {
  if (!SESSIONS || SESSIONS.length === 0) {
    await startSessionBot("QUEEN-JUSMY-MINI");
  } else {
    for (const s of SESSIONS) {
      startSessionBot(s);
      // small stagger to avoid race
      await new Promise(r => setTimeout(r, 1000));
    }
  }
})();
