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

// bot defaults
const BOT_NAME = "< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ɪɴɪ 🧚‍♀️";
const OWNER_NAME = "Mr Sandesh Bhashana";
const OWNER_NUMBER = "+94741259325";
const CHANNEL_JID = "20363402220977044@newsletter";
const BOT_IMAGE = "https://files.catbox.moe/xu4725.jpg";

const AUTO_LIKE_RATE_LIMIT_MS = 5 * 1000;
const MAX_LIKES_PER_MINUTE = 30;

// keep map of running sessions
const running = new Map();

export async function startAllSessions() {
  await fs.ensureDir(SESSIONS_DIR);
  const folders = await fs.readdir(SESSIONS_DIR);
  for (const f of folders) {
    const folderPath = path.join(SESSIONS_DIR, f);
    const stat = await fs.stat(folderPath);
    if (!stat.isDirectory()) continue; // skip files
    if (!running.has(f)) {
      startSessionBot(f).catch(err => console.error(`startSessionBot(${f}) failed:`, err));
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

export async function startSessionBot(sessionId) {
  const dir = path.join(SESSIONS_DIR, sessionId);
  const stat = await fs.stat(dir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.warn(`Session folder missing or invalid: ${dir}`);
    return;
  }

  if (running.has(sessionId)) {
    console.log(`[${sessionId}] already running`);
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

  // load settings
  const settingsPath = path.join(dir, "settings.json");
  let settings = {};
  if (!(await fs.pathExists(settingsPath))) {
    settings = {
      alwaysOnline: false,
      antiDelete: true,
      antiViewOnce: true,
      autoLike: false,
      likedStatus: [],
      lastAutoLikeAt: 0,
      likesThisWindow: 0,
      windowStart: 0
    };
    await fs.writeJson(settingsPath, settings, { spaces: 2 });
  } else {
    settings = await fs.readJson(settingsPath);
  }

  running.set(sessionId, { conn, settings });

  // connection updates
  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") console.log(`[${sessionId}] connected`);
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log(`[${sessionId}] connection closed:`, reason || lastDisconnect?.error?.message || lastDisconnect);
      if (reason !== DisconnectReason.loggedOut) {
        setTimeout(() => startSessionBot(sessionId).catch(console.error), 2000);
      } else {
        console.log(`[${sessionId}] logged out. Remove session folder to re-scan.`);
      }
    }
  });

  // presence keep-alive
  setInterval(async () => {
    if (settings.alwaysOnline) await conn.sendPresenceUpdate("available").catch(()=>{});
  }, 20_000);

  // persist settings every 15s
  setInterval(async () => {
    await fs.writeJson(settingsPath, settings, { spaces: 2 }).catch(()=>{});
  }, 15_000);

  console.log(`[${sessionId}] initialized`);
}
