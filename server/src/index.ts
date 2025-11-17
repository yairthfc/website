import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

// ---------- types & helpers for subscribers storage ----------

type Subscriber = {
  email: string;
  projectId: string;
  createdAt: string;
};

const DATA_FILE = path.join(__dirname, "subscribers.json");

function readSubscribers(): Subscriber[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw) as Subscriber[];
  } catch (_err) {
    // file missing or invalid -> start with empty list
    return [];
  }
}

function saveSubscribers(list: Subscriber[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

// ---------- email (nodemailer) setup ----------

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === "true"; // usually false for 587
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL || smtpUser;

// admin key for protecting update endpoint
const adminKey = process.env.ADMIN_KEY;

if (!smtpHost || !smtpUser || !smtpPass) {
  console.warn(
    "[WARN] SMTP not fully configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable email sending."
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// optional self-test (won't crash if it fails)
transporter.verify((err, success) => {
  if (err) {
    console.warn("[WARN] SMTP verify failed:", err.message);
  } else {
    console.log("[INFO] SMTP server is ready to send messages.");
  }
});

// ---------- routes ----------

// simple health check
app.get("/api/hello", (_req, res) => {
  res.json({ ok: true, message: "Hello from Node API 👋" });
});

// subscribe endpoint used by the Projects page
app.post("/api/subscribe", (req, res) => {
  const { email, projectId } = req.body || {};

  if (!email || !projectId) {
    return res
      .status(400)
      .json({ message: "email and projectId are required" });
  }

  const subscribers = readSubscribers();

  const already = subscribers.find(
    (s) => s.email === email && s.projectId === projectId
  );
  if (already) {
    return res
      .status(200)
      .json({ message: "Already subscribed for this project" });
  }

  const entry: Subscriber = {
    email,
    projectId,
    createdAt: new Date().toISOString(),
  };

  subscribers.push(entry);
  saveSubscribers(subscribers);

  console.log("New subscription:", entry);
  res.status(201).json({ message: "Subscribed successfully" });
});

// ---------- protected: notify subscribers about a project update ----------

app.post("/api/notify-project-update", async (req, res) => {
  // 🔒 admin key check
  const headerKey = (req.headers["x-admin-key"] as string | undefined) ?? "";

  if (!adminKey) {
    console.warn(
      "[WARN] ADMIN_KEY not set in .env; refusing to send updates for safety."
    );
    return res.status(500).json({
      message: "ADMIN_KEY not configured on server.",
    });
  }

  if (headerKey !== adminKey) {
    return res.status(401).json({ message: "Unauthorized: invalid admin key" });
  }

  const { projectId, subject, message } = req.body || {};

  if (!projectId || !subject || !message) {
    return res
      .status(400)
      .json({ message: "projectId, subject and message are required" });
  }

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(500).json({
      message:
        "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.",
    });
  }

  const all = readSubscribers();
  const recipients = all.filter((s) => s.projectId === projectId);

  if (recipients.length === 0) {
    return res.status(404).json({
      message: `No subscribers found for projectId="${projectId}".`,
    });
  }

  const emails = recipients.map((s) => s.email);
  console.log(
    `[INFO] Sending project update for "${projectId}" to ${emails.length} subscribers.`
  );

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: fromEmail, // you as the main recipient
      bcc: emails, // subscribers as BCC
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return res.json({
      ok: true,
      sentTo: emails.length,
      message: "Update email sent to subscribers.",
    });
  } catch (err: any) {
    console.error("[ERROR] Failed to send update email:", err);
    return res.status(500).json({
      message: "Failed to send update email.",
      error: err?.message ?? "unknown error",
    });
  }
});

// ---------- start server ----------

app.listen(PORT, () => {
  console.log("API listening on http://localhost:" + PORT);
});
