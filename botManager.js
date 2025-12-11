const fs = require("fs-extra");
const path = require("path");
const P = require("pino");
const { 
    default: makeWASocket, 
    fetchLatestBaileysVersion, 
    useMultiFileAuthState, 
    DisconnectReason 
} = require("@whiskeysockets/baileys");

const SESSIONS_DIR = path.join(process.cwd(), "sessions");
const running = new Map();

// bot defaults
const BOT_NAME = "< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ɪɴɪ 🧚‍♀️";
const OWNER_NAME = "Mr Sandesh Bhashana";
const OWNER_NUMBER = "+94741259325";
const CHANNEL_JID = "20363402220977044@newsletter";
const BOT_IMAGE = "https://files.catbox.moe/xu4725.jpg";

const AUTO_LIKE_RATE_LIMIT_MS = 5 * 1000;
const MAX_LIKES_PER_MINUTE = 30;

async function startAllSessions() {
    await fs.ensureDir(SESSIONS_DIR);
    const folders = await fs.readdir(SESSIONS_DIR);
    for (const f of folders) {
        if (!running.has(f)) {
            startSessionBot(f).catch(err => console.error(`startSessionBot(${f}) failed:`, err));
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

    // connection updates
    conn.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") console.log(`[${sessionId}] connected`);
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(`[${sessionId}] connection closed:`, reason || lastDisconnect?.error?.message || lastDisconnect);
            if (reason !== DisconnectReason.loggedOut) setTimeout(() => startSessionBot(sessionId).catch(console.error), 2000);
        }
    });

    running.set(sessionId, { conn, settings });
    console.log(`[${sessionId}] initialized`);
}

module.exports = { startAllSessions, startSessionBot };
