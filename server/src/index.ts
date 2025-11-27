// server/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

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

// ---------- Resend setup (instead of SMTP/nodemailer) ----------

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL; // must be a verified sender in Resend
const adminKey = process.env.ADMIN_KEY;   // protects the /api/notify-project-update endpoint
console.log("[CONFIG] Using FROM_EMAIL:", fromEmail);


if (!resendApiKey) {
  console.warn(
    "[WARN] RESEND_API_KEY not set. /api/notify-project-update will not be able to send emails."
  );
}

if (!fromEmail) {
  console.warn(
    "[WARN] FROM_EMAIL not set. Please configure a verified sender address for Resend."
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
      "[WARN] ADMIN_KEY not set in env; refusing to send updates for safety."
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

  if (!resend || !fromEmail) {
    return res.status(500).json({
      message:
        "Email sending is not configured. Make sure RESEND_API_KEY and FROM_EMAIL are set.",
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
    const { data, error } = await resend.emails.send({
      from: fromEmail!,
      to: fromEmail!, // you as visible recipient
      bcc: emails,    // subscribers in BCC
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    if (error) {
      console.error("[ERROR] Resend returned an error:", error);
      return res.status(500).json({
        message: "Failed to send update email.",
        error,
      });
    }

    console.log("[INFO] Resend response:", data);

    return res.json({
      ok: true,
      sentTo: emails.length,
      message: "Update email sent to subscribers.",
    });
  } catch (err: any) {
    console.error("[ERROR] Exception while sending via Resend:", err);
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
