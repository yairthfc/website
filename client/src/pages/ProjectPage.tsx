import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { featured } from "../data/projects";
import { site } from "../data/site";
import NotFoundPage from "./NotFoundPage";

export default function ProjectPage() {
  const { id } = useParams();
  const index = featured.findIndex((p) => p.id === id);
  const project = featured[index];

  useEffect(() => {
    document.title = project ? `${project.title} · ${site.name}` : `${site.name} · ${site.role}`;
    return () => {
      document.title = `${site.name} · ${site.role}`;
    };
  }, [project]);

  if (!project) return <NotFoundPage />;
  const next = featured[(index + 1) % featured.length];

  return (
    <article className="relative">
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[30rem] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl"
      />
      <div className="container-page relative pb-24 pt-12 md:pt-16">
      <Link to="/#work" className="text-sm text-muted transition-colors hover:text-ink">
        ← All work
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="font-mono text-sm text-accent">
          ~/{project.id}
        </p>
        <p className="eyebrow mt-6">
          {String(index + 1).padStart(2, "0")} · {project.area}
          {project.status && <span className="text-[#B5410A]"> · {project.status}</span>}
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{project.summary}</p>
      </header>

      <div className="mt-10 flex flex-col gap-6 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        <a href={project.github} target="_blank" rel="noreferrer" className="btn-primary shrink-0 self-start">
          Source on GitHub ↗
        </a>
      </div>

      <div className="mt-14 grid gap-14 md:grid-cols-[12rem_1fr]">
        <h2 className="eyebrow md:pt-1">Overview</h2>
        <div className="max-w-prose space-y-4 text-[17px] leading-relaxed">
          {project.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className="eyebrow md:pt-1">How it works</h2>
        <ol className="max-w-prose space-y-5">
          {project.approach.map((a, i) => (
            <li key={a} className="grid grid-cols-[2rem_1fr] text-[17px] leading-relaxed">
              <span className="pt-1 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{a}</span>
            </li>
          ))}
        </ol>

        {project.outcome && (
          <>
            <h2 className="eyebrow md:pt-1">Result</h2>
            <p className="max-w-prose rounded-r-lg border-l-4 border-accent bg-accent-soft/60 px-5 py-4 text-[17px] font-medium leading-relaxed">
              {project.outcome}
            </p>
          </>
        )}
      </div>

      <Link
        to={`/projects/${next.id}`}
        className="group mt-24 flex items-end justify-between gap-6 border-t border-line pt-8"
      >
        <div>
          <p className="eyebrow">Next project</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent">
            {next.title}
          </p>
        </div>
        <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
      </Link>
      </div>
    </article>
  );
}
