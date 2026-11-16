import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { featured, otherWork } from "../data/projects";
import { education, experience, site, skills } from "../data/site";

function SectionHeader({ id, n, title, aside }: { id: string; n: string; title: string; aside?: string }) {
  return (
    <div id={id} className="mb-10 flex items-baseline justify-between border-b border-line pb-4">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        <span className="mr-3 font-mono text-base font-normal text-accent">{n}</span>
        {title}
      </h2>
      {aside && <span className="font-mono text-xs text-faint">{aside}</span>}
    </div>
  );
}

function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Open to backend roles
    </span>
  );
}

const facts = [
  { k: "Now", v: "DevOps @ Check Point" },
  { k: "Degree", v: "B.Sc. CS, Hebrew U" },
  { k: "Honors", v: "Dean's List 2024/25" },
  { k: "Work rights", v: "Israel & UK" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_20%_30%,black,transparent)]"
      />
      <div className="container-page relative grid gap-14 pb-16 pt-14 md:grid-cols-[1fr_auto] md:items-center md:pb-20 md:pt-24">
        <div className="max-w-2xl">
          <StatusPill />
          <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight md:text-[3.5rem]">
            I build backend systems{" "}
            <span className="text-faint">and keep them running in production.</span>
          </h1>
          <p className="mt-7 max-w-prose text-lg leading-relaxed text-muted">
            I&apos;m Yair. I work as a DevOps engineer at{" "}
            <span className="font-medium text-ink">Check Point</span>, on the team that runs its
            cloud security services on Kubernetes and AWS. Before that, and alongside it, I studied
            Computer Science at the Hebrew University of Jerusalem and built systems software for fun.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/#work" className="btn-primary">
              See my work <span aria-hidden>↓</span>
            </Link>
            <a href={site.resume} target="_blank" rel="noreferrer" className="btn-ghost bg-white">
              Résumé
            </a>
            <div className="ml-1 flex gap-5 text-sm">
              <a className="link" href={site.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="link" href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <figure className="group relative w-52 justify-self-start md:w-64 md:justify-self-end">
          <div className="rotate-[-4deg] rounded-md bg-white p-2.5 pb-6 shadow-photo ring-1 ring-line transition-transform duration-500 ease-out group-hover:rotate-0">
            <img
              src="/profile.jpeg"
              alt="Yair Mahfud"
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
          </div>
          <span className="absolute -right-3 -top-3 rotate-[8deg] rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-md transition-transform duration-500 group-hover:rotate-0">
            hi, that&apos;s me
          </span>
        </figure>
      </div>

      <div className="container-page relative pb-14">
        <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-white md:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.k}
              className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                i >= 2 ? "border-t border-line md:border-t-0" : ""
              } ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="eyebrow">{f.k}</dt>
              <dd className="mt-1 text-sm font-medium md:text-[15px]">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const tickerItems = [
  "AWS",
  "Kubernetes",
  "Docker",
  "Python",
  "C++",
  "C",
  "Java",
  "SQL",
  "Linux",
  "GCP",
  "Azure",
  "Jenkins",
  "TCP/UDP",
  "x64 assembly",
  "TensorFlow",
  "React",
];

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-ink bg-ink py-3 text-paper" aria-hidden>
      <div className="flex w-max animate-marquee font-mono text-sm motion-reduce:animate-none">
        {[...tickerItems, ...tickerItems].map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6">{t}</span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Experience() {
  return (
    <section className="container-page pt-20 md:pt-28">
      <SectionHeader id="experience" n="01" title="Experience" />
      <ol className="relative space-y-12 border-l border-line pl-8 md:ml-[11rem]">
        {experience.map((j) => (
          <Reveal key={j.org}>
            <li className="relative">
              <span
                className={`absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-paper ${
                  j.current ? "bg-accent" : "bg-line"
                }`}
              />
              <p className="font-mono text-xs text-faint md:absolute md:-left-[13rem] md:top-1 md:w-40 md:text-right">
                {j.period}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight md:mt-0">
                {j.org}
                {j.current && (
                  <span className="ml-3 rounded bg-accent-soft px-1.5 py-0.5 align-middle font-mono text-xs font-normal text-[#B5410A]">
                    current
                  </span>
                )}
              </h3>
              <p className="mt-0.5 text-muted">{j.role}</p>
              <ul className="mt-4 max-w-prose space-y-2 text-[15px] leading-relaxed">
                {j.points.map((p) => (
                  <li key={p} className="relative pl-5">
                    <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              {j.tags && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {j.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          </Reveal>
        ))}
        <Reveal>
          <li className="relative">
            <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-line ring-4 ring-paper" />
            <p className="font-mono text-xs text-faint md:absolute md:-left-[13rem] md:top-1 md:w-40 md:text-right">
              {education.period}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight md:mt-0">{education.school}</h3>
            <p className="mt-0.5 text-muted">
              {education.degree} · {education.highlights.join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {education.grades.map((g) => (
                <span key={g.course} className="rounded-md border border-line bg-white px-2.5 py-1.5 text-sm">
                  {g.course} <span className="ml-1 font-mono font-medium text-accent">{g.grade}</span>
                </span>
              ))}
            </div>
          </li>
        </Reveal>
      </ol>
    </section>
  );
}

function ProjectCard({ p, i }: { p: (typeof featured)[number]; i: number }) {
  return (
    <Link
      to={`/projects/${p.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-ink hover:shadow-hard"
    >
      <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-2.5 transition-colors group-hover:border-ink">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line transition-colors group-hover:bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-line transition-colors group-hover:bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-line transition-colors group-hover:bg-[#28C840]" />
        </span>
        <span className="ml-2 truncate font-mono text-xs text-faint">~/{p.id}</span>
        <span className="ml-auto font-mono text-xs text-faint group-hover:text-accent">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="eyebrow">
          {p.area}
          {p.status && <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-[#B5410A]">{p.status}</span>}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{p.summary}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        <span className="mt-auto pt-6 text-sm font-medium">
          Read more{" "}
          <span className="inline-block text-accent transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

function Work() {
  return (
    <section className="container-page pb-24 pt-20 md:pt-28">
      <SectionHeader id="work" n="02" title="Projects" aside={`${featured.length} featured`} />
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 100}>
            <ProjectCard p={p} i={i} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="mb-2 mt-20 text-lg font-semibold tracking-tight">Also on my GitHub</h3>
        <p className="mb-6 text-sm text-muted">Machine learning work: a deep learning model, algorithms written from scratch, and a hackathon.</p>
        <ul className="divide-y divide-line border-y border-line">
          {otherWork.map((w) => (
            <li key={w.title}>
              <a
                href={w.github}
                target="_blank"
                rel="noreferrer"
                className="group -mx-3 grid gap-1 rounded-md px-3 py-4 transition-colors hover:bg-white sm:grid-cols-[16rem_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <span className="font-medium transition-colors group-hover:text-accent">{w.title}</span>
                <span className="text-sm text-muted">{w.description}</span>
                <span className="font-mono text-xs text-faint">
                  {w.stack}{" "}
                  <span className="ml-2 inline-block text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section className="container-page pb-24">
      <SectionHeader id="about" n="03" title="About me" />
      <Reveal className="grid gap-12 md:grid-cols-[1fr_20rem]">
        <div className="max-w-prose space-y-5 text-[17px] leading-relaxed text-muted">
          <p>
            I like knowing how things actually work. How an OS hands out memory, how it switches
            between threads, how a DNS resolver can be fooled into trusting a fake answer. Most of my
            side projects start with a question like that and end with code that runs.
          </p>
          <p>
            At Check Point I get the other half: real production systems, real incidents, and the
            automation that keeps them quiet. That&apos;s pushed me toward backend work, where I want
            to build the services myself and not only run them.
          </p>
          <p>
            I speak Hebrew and English natively and can work in both Israel and the UK. When
            I&apos;m not working I&apos;m probably on a padel court or watching Tottenham and
            regretting it.{" "}
            <Link className="link text-ink" to="/personal">
              More about me →
            </Link>
          </p>
        </div>
        <dl className="space-y-5 rounded-xl border border-line bg-white p-6">
          {skills.map((s) => (
            <div key={s.label}>
              <dt className="eyebrow">{s.label}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="bg-dots-dark pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-24 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-3xl"
      />
      <div className="container-page relative py-24 md:py-32">
        <p className="font-mono text-sm text-accent">04 · contact</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Hiring for backend? Let&apos;s talk.
        </h2>
        <a
          href={`mailto:${site.email}`}
          className="group mt-10 inline-flex items-center gap-3 break-all text-xl text-white md:text-3xl"
        >
          <span className="underline decoration-white/30 underline-offset-8 transition-colors group-hover:decoration-accent">
            {site.email}
          </span>
          <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
        </a>
        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="btn bg-accent text-white hover:bg-white hover:text-ink"
          >
            Download résumé
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn border border-white/20 hover:border-white"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="btn border border-white/20 hover:border-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Experience />
      <Work />
      <About />
      <Contact />
    </>
  );
}
