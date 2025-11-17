import { useState } from "react";
import { motion } from "framer-motion";

type MediaItem = {
  type: "image" | "video";
  src: string;
  alt: string;
};

type MediaCarouselProps = {
  items: MediaItem[];
};

// Reusable media slider (images + videos) – BIGGER & LIGHT THEME
function MediaCarousel({ items }: MediaCarouselProps) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative h-[26rem] w-full overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 md:h-[30rem]">
      <motion.div
        key={index}
        className="h-full w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {current.type === "image" ? (
          <img
            src={current.src}
            alt={current.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={current.src}
            className="h-full w-full object-cover"
            controls
          />
        )}
      </motion.div>

      {/* Soft top fade just for elegance */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

      {/* arrows + dots */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[20px] text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
        >
          ‹
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === index ? "bg-sky-500" : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[20px] text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}
// ---------- MEDIA ARRAYS (update file names to your own) ----------

const padelMedia: MediaItem[] = [
  { type: "image", src: "/padel-1.jpeg", alt: "Padel match" },
  { type: "image", src: "/padel-2.jpeg", alt: "Padel court" },
  { type: "video", src: "/padel-1.mp4", alt: "Padel rally" },
  { type: "image", src: "/padel-3.jpeg", alt: "Post-match moment" },
];

const spursMedia: MediaItem[] = [
  { type: "image", src: "/spurs-1.jpg", alt: "At the stadium" },
  { type: "image", src: "/spurs-2.jpg", alt: "Tottenham shirt" },
  { type: "video", src: "/spurs-1.mp4", alt: "Matchday atmosphere" },
];

const travelMedia: MediaItem[] = [
  { type: "image", src: "/travel-1.jpeg", alt: "City / travel" },
  { type: "image", src: "/travel-2.jpeg", alt: "Landscape" },
  { type: "video", src: "/travel-1.MP4", alt: "Trip moment" },
  { type: "image", src: "/travel-3.jpg", alt: "Another trip" },
];

// Small section label component
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600">
    {children}
  </p>
);

function PersonalPage() {
  return (
    <div className="h-[calc(100vh-80px)] snap-y snap-mandatory overflow-y-auto bg-slate-50 text-slate-900">
      {/* SLIDE 1 – PADEL */}
      <section
        id="padel"
        className="relative snap-start bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 min-h-[calc(100vh-80px)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
          {/* text */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionLabel>Padel</SectionLabel>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Padel – my competitive side.
            </h1>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              Current level:{" "}
              <span className="text-sm font-semibold">3.5</span>
            </p>

            <p className="mt-4 text-sm text-slate-700 md:text-base">
              Padel is where my{" "}
              <span className="font-semibold">competitive mindset</span> really
              shows. I play regularly at a 3.5 level, constantly trying to
              improve my positioning, shot selection, and decision-making under
              pressure.
            </p>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              I like treating matches almost like debugging – understanding what
              went wrong in a point, finding patterns, and adjusting strategy.
              It&apos;s a mix of physical intensity and mental focus that feels
              very close to how I approach engineering problems.
            </p>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Long-term, I&apos;m interested in ideas that connect{" "}
              <span className="font-semibold">
                sports, data, and products
              </span>
              : better tools for clubs, smarter booking and pricing, or ways to
              make everyday players feel a bit more &quot;pro&quot;.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-emerald-800">
              <span className="rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200">
                Positioning & shot selection
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200">
                Match mentality
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200">
                Training & consistency
              </span>
            </div>
          </motion.div>

          {/* media slider */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <MediaCarousel items={padelMedia} />
            <p className="mt-2 text-xs text-slate-500">
              Photos & clips from training sessions, matches, and moments on
              court.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SLIDE 2 – TOTTENHAM */}
      <section
        id="tottenham"
        className="relative snap-start bg-gradient-to-br from-sky-50 via-slate-50 to-slate-100 min-h-[calc(100vh-80px)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-slate-300/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 max-w-3xl">
            <SectionLabel>Football</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Tottenham Hotspur
            </h2>
            <p className="mt-4 text-sm text-slate-700 md:text-base">
              Supporting Tottenham Hotspur is not just supporting a club — it’s living a lifestyle built on loyalty, heartbreak, pride, and unbelievable moments.
Spurs teach you to stand by something with your whole heart, even when it’s difficult. That’s what Audere est Facere means to me — to dare to believe even when it hurts.
            </p>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              I’ve screamed at the TV, I’ve jumped off the couch, I’ve suffered, and I’ve celebrated like crazy — and every time, I come back wanting more.
Tottenham isn’t easy… but it’s family. It’s emotion. It’s identity.

I’ll always back the badge, the players, the club — through the highs and the absolute lows.
COYS, always.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
            {/* media left on this one */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MediaCarousel items={spursMedia} />
            </motion.div>

            {/* cards right */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Why it matters to me
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Tottenham is more than football for me — it’s a connection to my late grandfather, Abraham Levy, who followed this club for more than 60 years and passed that passion directly to me.

Through him, I inherited not just a team to support, but a tradition. From Glenn Hoddle to Dele Alli, from Jimmy Greaves to Harry Kane, different generations, different eras — but always one club, one identity, one heart.

Every match reminds me of him. The joy, the frustration, the hope — all the emotions we lived together. Supporting Spurs keeps a part of him with me, every single week.

That’s why Tottenham matters to me. It’s not just football.
It’s legacy. It’s memory. It’s family.

Audere est Facere — To Dare Is To Do.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SLIDE 3 – ENTREPRENEURSHIP & TRAVEL */}
      <section
        id="entrepreneurship"
        className="relative snap-start bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 min-h-[calc(100vh-80px)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 max-w-3xl">
            <SectionLabel>Entrepreneurship & travel</SectionLabel>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Ideas, places, and building things that matter.
            </h2>
            <p className="mt-4 text-sm text-slate-700 md:text-base">
              I&apos;m naturally drawn to{" "}
              <span className="font-semibold">entrepreneurship</span> – not just
              as a buzzword, but as a way of thinking. Whenever I travel, play
              sports, or work with people, I tend to notice friction, patterns,
              and opportunities for products.
            </p>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Travel for me is not only about seeing new places, but about
              understanding how people live, what they care about, and how
              systems around them are built. A lot of my ideas for future
              projects come from those moments outside the usual routine.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] md:items-start">
            {/* travel / entrepreneurship media */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MediaCarousel items={travelMedia} />
              <p className="mt-2 text-xs text-slate-500">
                Trips, moments, and places that shaped how I think about people
                and products.
              </p>
            </motion.div>

            {/* stacked cards about ideas */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.07 }}
            >
              <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Product thinking
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  I like taking a small frustration and exploring if it can
                  become a solution for more people – from tools for students
                  and juniors, to sports club management, to future
                  tech-driven experiences.
                </p>
              </div>

              <div className="rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Connecting worlds
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  For me, the most interesting ideas sit between{" "}
                  <span className="font-semibold">
                    engineering, people, and real life
                  </span>
                  : sports, travel, work, and community. I&apos;m always
                  thinking about how to bridge those worlds through tech.
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  What&apos;s next?
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  More projects, more experiments, and at some point – building
                  something bigger that combines everything I care about:
                  engineering, padel, football, and people.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PersonalPage;
