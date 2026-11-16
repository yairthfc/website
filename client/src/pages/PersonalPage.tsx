import { useEffect, useRef, useState, type ReactNode } from "react";
import PadelBackground from "../components/PadelBackground";

type Media = {
  type: "image" | "video";
  src: string;
  caption: string;
  /** width / height */
  ratio: number;
  wide?: boolean;
};

const TILTS = [-2.5, 2, -1.5, 3, -3, 1.5];

/** A video that plays muted while on screen. Tap to toggle sound. */
function AutoVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const v = ref.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
        if (v.paused) v.play().catch(() => {});
      }}
      className="relative block h-full w-full"
      aria-label={`${label}. ${muted ? "Turn sound on" : "Mute"}`}
    >
      <video ref={ref} src={`${src}#t=0.1`} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
      <span className="absolute bottom-2 right-2 rounded-full bg-ink/75 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur">
        {muted ? "tap for sound" : "sound on"}
      </span>
    </button>
  );
}

function Polaroid({ m, i }: { m: Media; i: number }) {
  const tilt = TILTS[i % TILTS.length];
  return (
    <figure
      style={{ transform: `rotate(${tilt}deg)` }}
      className="group relative rounded-md bg-white p-2 pb-9 shadow-photo ring-1 ring-line transition duration-300 ease-out hover:z-10 hover:!rotate-0 hover:scale-[1.04]"
    >
      <div className="overflow-hidden rounded-sm bg-line" style={{ aspectRatio: String(m.ratio) }}>
        {m.type === "image" ? (
          <img
            src={m.src}
            alt={m.caption}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AutoVideo src={m.src} label={m.caption} />
        )}
      </div>
      <figcaption className="absolute inset-x-2 bottom-2.5 truncate text-center font-mono text-xs text-muted">
        {m.caption}
      </figcaption>
    </figure>
  );
}

/** Two staggered columns of polaroids; wide items span both. */
function Scrapbook({ items }: { items: Media[] }) {
  return (
    <div className="grid grid-cols-2 items-start gap-x-4 gap-y-6 px-2 sm:gap-x-6 sm:gap-y-8">
      {items.map((m, i) => (
        <div key={m.src} className={`${m.wide ? "col-span-2" : ""} ${!m.wide && i % 2 === 1 ? "sm:mt-10" : ""}`}>
          <Polaroid m={m} i={i} />
        </div>
      ))}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setN(to), 0);
      return () => window.clearTimeout(t);
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const shots = ["Bandeja", "Víbora", "Por tres", "Chiquita", "Globo", "Remate", "Bajada", "Contrapared", "Smash", "Volea"];

function ShotTicker() {
  return (
    <div className="overflow-hidden border-y border-ink bg-ink py-3 text-paper" aria-hidden>
      <div className="flex w-max animate-marquee font-mono text-sm motion-reduce:animate-none">
        {[...shots, ...shots].map((s, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6">{s}</span>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D7F034]" />
          </span>
        ))}
      </div>
    </div>
  );
}

function ChapterText({ n, label, title, children }: { n: string; label: string; title: string; children: ReactNode }) {
  return (
    <div className="md:sticky md:top-24">
      <p className="eyebrow">
        <span className="text-accent">{n}</span> · {label}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}

const padel: Media[] = [
  { type: "video", src: "/padel-1.mp4", caption: "a rally", ratio: 16 / 9, wide: true },
  { type: "image", src: "/padel-1.jpeg", caption: "mid-point", ratio: 2 / 3 },
  { type: "image", src: "/padel-2.jpeg", caption: "ready position", ratio: 2 / 3 },
  { type: "image", src: "/padel-3.jpeg", caption: "me vs. a very big ball", ratio: 3 / 4 },
];

const spurs: Media[] = [
  { type: "image", src: "/spurs-1.jpg", caption: "pitch-side", ratio: 3 / 4 },
  { type: "video", src: "/spurs-1.mp4", caption: "matchday", ratio: 9 / 16 },
  { type: "image", src: "/spurs-2.jpg", caption: "in the shirt, obviously", ratio: 1 },
];

const travel: Media[] = [
  { type: "image", src: "/travel-1.jpeg", caption: "out on the water", ratio: 3 / 4 },
  { type: "video", src: "/travel-1.MP4", caption: "somewhere new", ratio: 9 / 16 },
  { type: "image", src: "/travel-2.jpeg", caption: "long dinners", ratio: 3 / 4 },
  { type: "image", src: "/travel-3.jpg", caption: "up a mountain", ratio: 3 / 4 },
];

export default function PersonalPage() {
  return (
    <div className="relative">
      <PadelBackground />
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[34rem] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      {/* intro + live court */}
      <section className="container-page relative pb-14 pt-14 md:pt-20">
        <p className="font-mono text-sm text-accent">~/personal</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          When I&apos;m not coding, <span className="text-faint">I&apos;m probably here.</span>
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
          Padel, Tottenham, and a notes app full of startup ideas.
        </p>
        <nav className="mt-8 flex flex-wrap gap-2">
          {[
            ["#padel", "Padel"],
            ["#tottenham", "Tottenham"],
            ["#ideas", "Travel & ideas"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="chip transition-colors hover:border-ink hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <ShotTicker />

      {/* padel */}
      <section id="padel" className="container-page grid gap-12 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
        <ChapterText n="01" label="Padel" title="Where I get competitive">
          <p>
            I play padel a lot, currently at a <span className="font-medium text-ink">3.5 level</span>. I&apos;m always
            working on something: positioning, shot choice, staying calm when the score is tight.
          </p>
          <p>
            After a bad point I replay it in my head and try to figure out what went wrong. Honestly, it&apos;s not that
            different from debugging.
          </p>
          <p>
            I&apos;d love to build something for padel one day. Better tools for clubs, smarter booking, anything that
            makes regular players feel a bit more pro.
          </p>
          <div className="!mt-8 inline-flex items-center gap-4 rounded-xl border border-line bg-white px-5 py-4">
            <span className="relative inline-block h-10 w-10 animate-bounce rounded-full bg-[#D7F034] ring-1 ring-[#9DB61E] motion-reduce:animate-none">
              <span className="absolute inset-x-1 top-[18px] h-0.5 rounded bg-white" />
            </span>
            <span>
              <span className="block font-mono text-xs uppercase tracking-wider text-faint">current level</span>
              <span className="text-2xl font-semibold text-ink">3.5</span>
            </span>
          </div>
        </ChapterText>
        <Scrapbook items={padel} />
      </section>

      {/* tottenham */}
      <section id="tottenham" className="border-y border-line bg-white/70 backdrop-blur-sm">
        <div className="container-page grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
          <div className="md:order-2">
            <ChapterText n="02" label="Football" title="Tottenham Hotspur">
              <p>
                I got Tottenham from my late grandfather, Abraham Levy. He followed the club for more than 60 years and
                passed it straight on to me.
              </p>
              <p>
                He grew up on Jimmy Greaves and Glenn Hoddle. I grew up on Harry Kane and Dele Alli. Different players,
                same club, and we watched a lot of it together.
              </p>
              <p>
                Every match still reminds me of him. Supporting Spurs is rarely easy, but it keeps a bit of him with me
                every week, so I&apos;m not going anywhere.
              </p>
              <div className="!mt-8 flex items-end gap-4">
                <span className="text-6xl font-semibold tracking-tight text-[#132257] md:text-7xl">
                  <CountUp to={60} suffix="+" />
                </span>
                <span className="pb-2 text-sm leading-snug text-muted">
                  years of Spurs in the family,
                  <br />
                  from him to me
                </span>
              </div>
              <p className="!mt-6 border-l-2 border-[#132257] pl-4 font-medium italic text-ink">
                Audere est Facere. To dare is to do.
              </p>
            </ChapterText>
          </div>
          <Scrapbook items={spurs} />
        </div>
      </section>

      {/* travel & ideas */}
      <section id="ideas" className="container-page grid gap-12 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
        <ChapterText n="03" label="Travel & ideas" title="Collecting ideas">
          <p>
            I have a habit of noticing when something is annoying and wondering if it could be an app. It happens at
            work, at the club, and especially when I travel.
          </p>
          <p>
            Being somewhere new shows you how other people do everyday things, and that&apos;s where most of my ideas come
            from.
          </p>
          <p>One day I want to build a company around the stuff I care about: software, sport, and people.</p>
        </ChapterText>
        <Scrapbook items={travel} />
      </section>
    </div>
  );
}
