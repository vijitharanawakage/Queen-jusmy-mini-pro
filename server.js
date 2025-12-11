// server.js
import express from "express";
import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import axios from "axios";
import { startAllSessions } from "./botManager.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const SESSIONS_DIR = path.join(process.cwd(), "sessions");
await fs.ensureDir(SESSIONS_DIR);

// serve frontend static (index.html below)
app.use(express.static(path.join(process.cwd(), "public")));

// Endpoint called by frontend after pair API returns sessionId (and optionally creds)
// body: { sessionId: "STRING", creds?: { ... } }
app.post("/saveSession", async (req, res) => {
  try {
    const { sessionId, creds } = req.body;
    if (!sessionId) return res.status(400).json({ ok: false, error: "sessionId required" });

    const dir = path.join(SESSIONS_DIR, sessionId);
    await fs.ensureDir(dir);

    // If remote pair API also provides full creds (optional), save them as 'creds.json'
    if (creds) {
      await fs.writeJson(path.join(dir, "creds.json"), creds, { spaces: 2 });
    }

    // Ensure settings.json exists (botManager will also create default but create now for clarity)
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
    if (!(await fs.pathExists(settingsPath))) {
      await fs.writeJson(settingsPath, defaultSettings, { spaces: 2 });
    }

    // ask botManager to (re)start session immediately
    // startAllSessions will detect new folder
    startAllSessions();

    return res.json({ ok: true, sessionDir: dir });
  } catch (e) {
    console.error("saveSession error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Optional helper: call pair API for a number and return result (proxy)
app.get("/pairProxy", async (req, res) => {
  const num = req.query.number;
  if (!num) return res.status(400).json({ ok: false, error: "number required" });
  try {
    // use the pair API URL provided by you
    const PAIR_API = process.env.PAIR_API_URL || "https://queen-jusmy-pair.onrender.com/pair?number=";
    const url = `${PAIR_API}${encodeURIComponent(num)}`;
    const r = await axios.get(url, { timeout: 15000 });
    return res.json(r.data);
  } catch (e) {
    console.error("pairProxy error", e.message || e);
    return res.status(502).json({ ok: false, error: "pair API error", detail: e.message });
  }
});

app.get("/sessions", async (req, res) => {
  const folders = await fs.readdir(SESSIONS_DIR);
  return res.json({ ok: true, sessions: folders });
});

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  // start bot manager on server boot
  startAllSessions();
});
