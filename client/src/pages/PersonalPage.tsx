import Reveal from "../components/Reveal";

type Media = { type: "image" | "video"; src: string; alt: string };

type Chapter = {
  id: string;
  label: string;
  title: string;
  body: string[];
  quote?: string;
  media: Media[];
};

const chapters: Chapter[] = [
  {
    id: "padel",
    label: "Padel",
    title: "Where I get competitive",
    body: [
      "I play padel a lot, currently at a 3.5 level. I'm always working on something: positioning, shot choice, staying calm when the score is tight.",
      "After a bad point I replay it in my head and try to figure out what went wrong. Honestly, it's not that different from debugging.",
      "I'd love to build something for padel one day. Better tools for clubs, smarter booking, anything that makes regular players feel a bit more pro.",
    ],
    media: [
      { type: "image", src: "/padel-1.jpeg", alt: "Playing a padel match" },
      { type: "video", src: "/padel-1.mp4", alt: "Padel rally" },
      { type: "image", src: "/padel-2.jpeg", alt: "On the padel court" },
      { type: "image", src: "/padel-3.jpeg", alt: "After a match" },
    ],
  },
  {
    id: "tottenham",
    label: "Football",
    title: "Tottenham Hotspur",
    body: [
      "I got Tottenham from my late grandfather, Abraham Levy. He followed the club for more than 60 years and passed it straight on to me.",
      "He grew up on Jimmy Greaves and Glenn Hoddle. I grew up on Harry Kane and Dele Alli. Different players, same club, and we watched a lot of it together.",
      "Every match still reminds me of him. Supporting Spurs is rarely easy, but it keeps a bit of him with me every week, so I'm not going anywhere.",
    ],
    quote: "Audere est Facere. To dare is to do.",
    media: [
      { type: "image", src: "/spurs-1.jpg", alt: "At the Tottenham Hotspur Stadium" },
      { type: "image", src: "/spurs-2.jpg", alt: "Wearing the Tottenham shirt" },
      { type: "video", src: "/spurs-1.mp4", alt: "Matchday atmosphere" },
    ],
  },
  {
    id: "ideas",
    label: "Travel & ideas",
    title: "Collecting ideas",
    body: [
      "I have a habit of noticing when something is annoying and wondering if it could be an app. It happens at work, at the club, and especially when I travel.",
      "Being somewhere new shows you how other people do everyday things, and that's where most of my ideas come from.",
      "One day I want to build a company around the stuff I care about: software, sport, and people.",
    ],
    media: [
      { type: "image", src: "/travel-1.jpeg", alt: "Travelling" },
      { type: "image", src: "/travel-2.jpeg", alt: "Landscape from a trip" },
      { type: "video", src: "/travel-1.MP4", alt: "Moment from a trip" },
      { type: "image", src: "/travel-3.jpg", alt: "Another trip" },
    ],
  },
];

function MediaTile({ m, className = "" }: { m: Media; className?: string }) {
  const base = `h-full w-full bg-line object-cover transition-transform duration-500 group-hover:scale-[1.04] ${className}`;
  return m.type === "image" ? (
    <img src={m.src} alt={m.alt} loading="lazy" className={base} />
  ) : (
    <video src={`${m.src}#t=0.1`} aria-label={m.alt} controls playsInline preload="metadata" className={base} />
  );
}

export default function PersonalPage() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[28rem] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="container-page relative pb-24 pt-16 md:pt-24">
      <header className="max-w-2xl">
        <p className="font-mono text-sm text-accent">~/personal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
          When I&apos;m not coding
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Padel, Tottenham, and a notes app full of startup ideas.
        </p>
        <nav className="mt-8 flex flex-wrap gap-2">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="chip transition-colors hover:border-ink hover:text-ink">
              {c.label}
            </a>
          ))}
        </nav>
      </header>

      {chapters.map((c, i) => (
        <Reveal key={c.id}>
        <section
          id={c.id}
          className="mt-20 grid gap-10 border-t border-line pt-12 md:mt-28 md:grid-cols-2 md:gap-14"
        >
          <div className={i % 2 === 1 ? "md:order-2" : ""}>
            <p className="eyebrow">
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> · {c.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{c.title}</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-muted">
              {c.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {c.quote && (
              <p className="mt-6 border-l-2 border-accent pl-4 font-medium italic text-ink">{c.quote}</p>
            )}
          </div>
          <div className="grid auto-rows-[10rem] grid-cols-2 gap-2 sm:auto-rows-[13rem]">
            {c.media.map((m, j) => (
              <div
                key={m.src}
                className={"group overflow-hidden rounded-md " + (
                  j === 0
                    ? "col-span-2 row-span-2"
                    : c.media.length % 2 === 0 && j === c.media.length - 1
                      ? "col-span-2"
                      : "")
                }
              >
                <MediaTile m={m} />
              </div>
            ))}
          </div>
        </section>
        </Reveal>
      ))}
      </div>
    </div>
  );
}
