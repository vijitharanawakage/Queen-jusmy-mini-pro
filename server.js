const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { startAllSessions } = require("./botManager");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const SESSIONS_DIR = path.join(process.cwd(), "sessions");
fs.ensureDirSync(SESSIONS_DIR);

// serve frontend
app.use(express.static(path.join(process.cwd(), "public")));

// saveSession endpoint
app.post("/saveSession", async (req, res) => {
    try {
        const { sessionId, creds } = req.body;
        if (!sessionId) return res.status(400).json({ ok: false, error: "sessionId required" });

        const dir = path.join(SESSIONS_DIR, sessionId);
        await fs.ensureDir(dir);

        if (creds) await fs.writeJson(path.join(dir, "creds.json"), creds, { spaces: 2 });

        const defaultSettings = {
            alwaysOnline: false,
            antiDelete: true,
            antiViewOnce: true,
            autoLike: false,
            likedStatus: [],
            lastAutoLikeAt: 0,
            likesThisWindow: 0,
            windowStart: 0
        };
        const settingsPath = path.join(dir, "settings.json");
        if (!(await fs.pathExists(settingsPath))) await fs.writeJson(settingsPath, defaultSettings, { spaces: 2 });

        startAllSessions(); // immediately start session

        return res.json({ ok: true, sessionDir: dir });
    } catch (e) {
        console.error("saveSession error:", e);
        return res.status(500).json({ ok: false, error: e.message });
    }
});

// optional pairProxy endpoint
app.get("/pairProxy", async (req, res) => {
    const num = req.query.number;
    if (!num) return res.status(400).json({ ok: false, error: "number required" });
    try {
        const PAIR_API = process.env.PAIR_API_URL || "https://queen-jusmy-pair.onrender.com/pair?number=";
        const r = await axios.get(`${PAIR_API}${encodeURIComponent(num)}`, { timeout: 15000 });
        return res.json(r.data);
    } catch (e) {
        console.error("pairProxy error", e.message || e);
        return res.status(502).json({ ok: false, error: "pair API error", detail: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    startAllSessions();
});
