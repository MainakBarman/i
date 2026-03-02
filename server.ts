import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize Uploads Directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL, -- 'travel' or 'journal'
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATETIME NOT NULL,
    location TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    date DATE DEFAULT (DATE('now'))
  );

  -- Seed Data
  INSERT INTO posts (title, content, type, image_url) 
  SELECT 'Exploring the Hidden Temples of Kyoto', 'Kyoto is a city that breathes history. From the golden pavilion of Kinkaku-ji to the thousands of vermilion torii gates at Fushimi Inari-taisha, every corner tells a story...', 'travel', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070'
  WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Exploring the Hidden Temples of Kyoto');

  INSERT INTO posts (title, content, type, image_url) 
  SELECT 'The Digital Nomad Guide to Lisbon', 'Lisbon has become a mecca for remote workers. With its affordable cost of living, vibrant cafe culture, and reliable internet, it is the perfect base for any nomad...', 'travel', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=2070'
  WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = 'The Digital Nomad Guide to Lisbon');

  INSERT INTO posts (title, content, type, image_url) 
  SELECT 'Day 42: Finding Stillness in the Chaos', 'Today was one of those days where everything felt overwhelming. The noise of the city, the constant movement... but then I found a small park near the river...', 'journal', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2070'
  WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Day 42: Finding Stillness in the Chaos');

  INSERT INTO events (title, description, date, location)
  SELECT 'Nomad Meetup: Lisbon', 'Join us for a casual evening of networking and drinks at the LX Factory.', '2026-04-15 18:00:00', 'Lisbon, Portugal'
  WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Nomad Meetup: Lisbon');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadDir));

  // API Routes
  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.get("/api/posts", (req, res) => {
    const type = req.query.type;
    const posts = type 
      ? db.prepare("SELECT * FROM posts WHERE type = ? ORDER BY created_at DESC").all(type)
      : db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  app.post("/api/posts", (req, res) => {
    const { title, content, type, image_url } = req.body;
    const result = db.prepare("INSERT INTO posts (title, content, type, image_url) VALUES (?, ?, ?, ?)").run(title, content, type, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/posts/:id", (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/events/:id", (req, res) => {
    db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/subscribers/:id", (req, res) => {
    db.prepare("DELETE FROM subscribers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY date ASC").all();
    res.json(events);
  });

  app.post("/api/events", (req, res) => {
    const { title, description, date, location } = req.body;
    const result = db.prepare("INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)").run(title, description, date, location);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    try {
      db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(email);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.get("/api/subscribers", (req, res) => {
    const subs = db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC").all();
    res.json(subs);
  });

  app.get("/api/analytics", (req, res) => {
    const stats = db.prepare("SELECT date, SUM(views) as views FROM analytics GROUP BY date ORDER BY date DESC LIMIT 7").all();
    res.json(stats);
  });

  app.post("/api/analytics/track", (req, res) => {
    const { page } = req.body;
    db.prepare(`
      INSERT INTO analytics (page, views) VALUES (?, 1)
      ON CONFLICT(id) DO UPDATE SET views = views + 1
    `).run(page);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
