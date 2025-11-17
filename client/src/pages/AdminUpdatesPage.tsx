import { useState } from "react";
import { API_BASE_URL } from "../config";

const projectOptions = [
  { id: "internsheep", label: "InternSheep / JobScanner" },
  { id: "uthreads", label: "User-Level Thread Management Library" },
  { id: "vm-manager", label: "Hierarchical Virtual Memory Manager" },
  { id: "iml-hackathon", label: "IML Hackathon – Match & Importance" },
  { id: "nanobody-structure-nn", label: "Nanobody 3D Structure Prediction" },
];

function AdminUpdatesPage() {
  const [projectId, setProjectId] = useState<string>("internsheep");
  const [subject, setSubject] = useState<string>(
    "Update from Yair's portfolio"
  );
  const [message, setMessage] = useState<string>(
    "Hey! Here's a new update for this project.\n\n– Yair"
  );
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(
    null
  );
  const [isSending, setIsSending] = useState(false);

  // admin key you type manually (must match ADMIN_KEY in server/.env)
  const [adminKey, setAdminKey] = useState<string>("");

  const handleSend = async () => {
    if (!adminKey.trim()) {
      setStatus({
        ok: false,
        msg: "Admin key is required.",
      });
      return;
    }

    if (!projectId || !subject.trim() || !message.trim()) {
      setStatus({
        ok: false,
        msg: "Please fill project, subject, and message.",
      });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/notify-project-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey, // 🔒 send admin key in header
        },
        body: JSON.stringify({
          projectId,
          subject,
          message,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          ok: false,
          msg:
            data?.message ||
            "Something went wrong sending the update. Check the server logs.",
        });
        return;
      }

      setStatus({
        ok: true,
        msg:
          data?.message ||
          `Update sent successfully for project "${projectId}".`,
      });
    } catch (err) {
      console.error(err);
      setStatus({
        ok: false,
        msg: "Network error. Is the backend running on port 5000?",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 text-slate-900">
      <h1 className="mb-2 text-3xl font-semibold">Project Updates Admin</h1>
      <p className="mb-6 text-sm text-slate-600">
        Private page for sending email updates to subscribers of a specific
        project. Protected by an admin key and calls the{" "}
        <code>/api/notify-project-update</code> endpoint on your backend.
      </p>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Admin key */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin key
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter your admin key"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Must match the <code>ADMIN_KEY</code> configured on the server.
          </p>
        </div>

        {/* Project selector */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Project
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {projectOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            New lines will be preserved in the email body.
          </p>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              status.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Sends an email via your Node backend to all subscribers of the
            selected project.
          </p>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className={`rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm ${
              isSending
                ? "cursor-not-allowed bg-slate-400"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {isSending ? "Sending..." : "Send update"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminUpdatesPage;
