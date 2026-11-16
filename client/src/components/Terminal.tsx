import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { featured } from "../data/projects";
import { education, experience, site, skills } from "../data/site";

type Line = { kind: "in" | "out" | "err" | "accent"; text: ReactNode };

const PROMPT = "yair@mahfud:~$";

const LOGO = String.raw`   __   __  __  __
   \ \ / / |  \/  |
    \ V /  | |\/| |
     | |   | |  | |
     |_|   |_|  |_|`;

const COMMANDS: Record<string, string> = {
  help: "show this list",
  whoami: "who is this guy",
  ls: "list what's here",
  "cat <file>": "print a file (about.txt, skills.txt, experience.txt)",
  "open <project>": "open a project page (Tab completes)",
  resume: "open my résumé",
  contact: "how to reach me",
  neofetch: "system info",
  clear: "clear the screen",
  exit: "close the terminal",
};

const projectIds = featured.map((p) => p.id);
const completions = [
  ...Object.keys(COMMANDS).map((c) => c.split(" ")[0]),
  "github",
  "linkedin",
  "cat about.txt",
  "cat skills.txt",
  "cat experience.txt",
  ...projectIds.map((id) => `open ${id}`),
];

const welcome: Line[] = [
  { kind: "accent", text: "Welcome. You found the terminal." },
  { kind: "out", text: "Type 'help' to see what I can do. Esc to close." },
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(welcome);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Open with ` (or ~) when not typing somewhere else. Also listen for the footer button.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if ((e.key === "`" || e.key === "~") && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = useCallback(
    (raw: string): Line[] => {
      const cmd = raw.trim();
      const [name, ...args] = cmd.split(/\s+/);
      const arg = args.join(" ");
      const out = (text: ReactNode): Line => ({ kind: "out", text });
      const err = (text: ReactNode): Line => ({ kind: "err", text });

      switch (name) {
        case "":
          return [];
        case "help":
          return Object.entries(COMMANDS).map(([c, d]) =>
            out(
              <>
                <span className="inline-block w-36 text-accent">{c}</span>
                <span className="text-white/60">{d}</span>
              </>,
            ),
          );
        case "whoami":
          return [
            out(`${site.name}. ${site.role}.`),
            out(`Currently: ${experience[0].role} @ ${experience[0].org}.`),
            out("Open to backend roles."),
          ];
        case "ls":
          if (arg === "projects" || arg === "projects/") return projectIds.map((id) => out(`${id}/`));
          return [
            out(
              <span className="flex flex-wrap gap-x-6">
                <span className="text-accent">projects/</span>
                <span>about.txt</span>
                <span>skills.txt</span>
                <span>experience.txt</span>
                <span>resume.pdf</span>
              </span>,
            ),
          ];
        case "cat": {
          const file = arg.replace(/^\.\//, "");
          if (file === "about.txt")
            return [
              out("I like knowing how things actually work: memory, threads, networks."),
              out("By day I keep cloud security services running at Check Point."),
              out("I want to build backend services, not only run them."),
            ];
          if (file === "skills.txt")
            return skills.map((s) => out(<><span className="text-accent">{s.label}:</span> {s.items.join(", ")}</>));
          if (file === "experience.txt")
            return [
              ...experience.map((j) => out(<>{j.period.padEnd(18)} <span className="text-accent">{j.org}</span>, {j.role}</>)),
              out(<>{education.period.padEnd(18)} <span className="text-accent">{education.school}</span>, {education.degree}</>),
            ];
          if (file === "resume.pdf") return [err("cat: resume.pdf: binary file. Try 'resume'.")];
          if (!file) return [err("cat: missing file name")];
          return [err(`cat: ${file}: No such file or directory`)];
        }
        case "cd":
        case "open": {
          const id = arg.replace(/^projects\//, "").replace(/\/$/, "");
          if (!id || id === "~" || id === "home") {
            navigate("/");
            setOpen(false);
            return [];
          }
          if (id === "personal") {
            navigate("/personal");
            setOpen(false);
            return [];
          }
          if (projectIds.includes(id)) {
            navigate(`/projects/${id}`);
            setOpen(false);
            return [out(`opening ${id}...`)];
          }
          return [err(`${name}: ${arg}: No such project. Try 'ls projects'.`)];
        }
        case "resume":
          window.open(site.resume, "_blank", "noopener");
          return [out("Opening resume.pdf in a new tab...")];
        case "github":
          window.open(site.github, "_blank", "noopener");
          return [out("Opening GitHub...")];
        case "linkedin":
          window.open(site.linkedin, "_blank", "noopener");
          return [out("Opening LinkedIn...")];
        case "contact":
        case "email":
          return [
            out(<>email    <a className="text-accent underline" href={`mailto:${site.email}`}>{site.email}</a></>),
            out(<>linkedin <a className="text-accent underline" href={site.linkedin} target="_blank" rel="noreferrer">{site.linkedin.replace("https://www.", "")}</a></>),
            out(<>github   <a className="text-accent underline" href={site.github} target="_blank" rel="noreferrer">{site.github.replace("https://", "")}</a></>),
          ];
        case "neofetch":
          return [
            out(
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <pre className="text-accent">{LOGO}</pre>
                <div className="leading-6">
                  <div><span className="text-accent">yair</span>@<span className="text-accent">mahfud</span></div>
                  <div className="text-white/40">-----------</div>
                  <div><span className="text-accent">Role</span>: {site.role}</div>
                  <div><span className="text-accent">Employer</span>: {experience[0].org}</div>
                  <div><span className="text-accent">Degree</span>: {education.degree}, HUJI</div>
                  <div><span className="text-accent">Stack</span>: AWS, Kubernetes, C++, Python</div>
                  <div><span className="text-accent">Uptime</span>: since 2022 (CS), 2026 (prod)</div>
                  <div><span className="text-accent">Club</span>: Tottenham Hotspur</div>
                </div>
              </div>,
            ),
          ];
        case "sudo":
          return [err("yair is not in the sudoers file. This incident will be reported.")];
        case "rm":
          return arg.includes("-rf")
            ? [err("Permission denied. I keep production running, remember?")]
            : [err("rm: nice try")];
        case "coys":
          return [{ kind: "accent", text: "Come On You Spurs! Audere est Facere." }];
        case "padel":
          return [out("Level 3.5. Challenge accepted.")];
        case "date":
          return [out(new Date().toString())];
        case "pwd":
          return [out("/home/yair")];
        case "echo":
          return [out(arg)];
        case "history":
          return history.map((h, i) => out(`${String(i + 1).padStart(4)}  ${h}`));
        case "clear":
          setLines([]);
          return [];
        case "exit":
          setOpen(false);
          return [];
        default:
          return [err(`command not found: ${name}. Try 'help'.`)];
      }
    },
    [history, navigate],
  );

  const submit = () => {
    const cmd = input;
    const result = run(cmd);
    if (cmd.trim() !== "clear") {
      setLines((l) => [...l, { kind: "in", text: cmd }, ...result]);
    }
    if (cmd.trim()) setHistory((h) => [...h, cmd.trim()]);
    setHistIdx(-1);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const i = histIdx + 1;
      if (i >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = completions.filter((c) => c.startsWith(input) && c !== input);
      if (matches.length === 1) setInput(matches[0] + (matches[0].includes(" ") ? "" : " "));
      else if (matches.length > 1) {
        // complete the shared prefix, and show the options
        let prefix = matches[0];
        for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
        if (prefix.length > input.length) setInput(prefix);
        else setLines((l) => [...l, { kind: "in", text: input }, { kind: "out", text: matches.join("   ") }]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="flex h-[min(32rem,80vh)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121216] font-mono text-[13px] text-white/90 shadow-2xl sm:text-sm"
        onMouseDown={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
          <button
            type="button"
            aria-label="Close terminal"
            onClick={() => setOpen(false)}
            className="h-3 w-3 rounded-full bg-[#FF5F57] hover:brightness-110"
          />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs text-white/40">yair@mahfud: ~</span>
        </div>
        <div ref={bodyRef} className="flex-1 space-y-1 overflow-y-auto p-4 leading-relaxed">
          {lines.map((l, i) =>
            l.kind === "in" ? (
              <div key={i}>
                <span className="text-emerald-400">{PROMPT}</span> {l.text}
              </div>
            ) : (
              <div
                key={i}
                className={`whitespace-pre-wrap ${
                  l.kind === "err" ? "text-red-400" : l.kind === "accent" ? "text-accent" : ""
                }`}
              >
                {l.text}
              </div>
            ),
          )}
          <div className="flex items-center">
            <span className="shrink-0 text-emerald-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="ml-2 min-w-0 flex-1 bg-transparent caret-accent outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
