import { useEffect, useRef, useState } from "react";

/**
 * Side view of a padel court with a looping rally: the ball goes over the net,
 * bounces, comes off the back glass and gets returned. Pure SVG + rAF.
 */

type Pt = { x: number; y: number };
type Seg = { from: Pt; to: Pt; arc: number; ms: number; event: "hitL" | "hitR" | "bounce" | "glassR" | "glassL" };

const FLOOR = 262;
const L_HIT = { x: 150, y: 172 };
const R_HIT = { x: 850, y: 172 };

const SEGMENTS: Seg[] = [
  { from: L_HIT, to: { x: 720, y: 254 }, arc: 125, ms: 950, event: "hitL" },
  { from: { x: 720, y: 254 }, to: { x: 952, y: 150 }, arc: 50, ms: 480, event: "bounce" },
  { from: { x: 952, y: 150 }, to: R_HIT, arc: 18, ms: 380, event: "glassR" },
  { from: R_HIT, to: { x: 280, y: 254 }, arc: 125, ms: 950, event: "hitR" },
  { from: { x: 280, y: 254 }, to: { x: 48, y: 150 }, arc: 50, ms: 480, event: "bounce" },
  { from: { x: 48, y: 150 }, to: L_HIT, arc: 18, ms: 380, event: "glassL" },
];

function pointAt(s: Seg, t: number): Pt {
  return {
    x: s.from.x + (s.to.x - s.from.x) * t,
    y: s.from.y + (s.to.y - s.from.y) * t - 4 * s.arc * t * (1 - t),
  };
}

function Racket({ flip, swingKey }: { flip?: boolean; swingKey: number }) {
  return (
    <g transform={flip ? "scale(-1,1)" : undefined}>
      <g key={swingKey} className="racket-swing">
        <rect x="-4" y="14" width="8" height="34" rx="3" fill="#16161A" />
        <ellipse cx="0" cy="-6" rx="19" ry="23" fill="#16161A" />
        <ellipse cx="0" cy="-6" rx="15" ry="19" fill="#E8590C" />
        {[-10, 0, 10].map((x) =>
          [-16, -6, 4].map((y) => <circle key={`${x}${y}`} cx={x * 0.8} cy={y} r="1.8" fill="#16161A" opacity="0.5" />),
        )}
      </g>
    </g>
  );
}

export default function PadelRally() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const [rally, setRally] = useState(1);
  const [swingL, setSwingL] = useState(0);
  const [swingR, setSwingR] = useState(0);
  const [flash, setFlash] = useState<{ side: "L" | "R"; n: number } | null>(null);
  const [impact, setImpact] = useState<{ x: number; n: number } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = (p: Pt) => {
      ballRef.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      const h = Math.max(0, FLOOR - p.y);
      const k = Math.max(0.35, 1 - h / 220);
      shadowRef.current?.setAttribute("cx", String(p.x));
      shadowRef.current?.setAttribute("rx", String(11 * k));
      shadowRef.current?.setAttribute("opacity", String(0.25 * k));
    };
    if (reduced) {
      place(pointAt(SEGMENTS[0], 0.55));
      return;
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (wrapRef.current) io.observe(wrapRef.current);

    let seg = 0;
    let segStart = performance.now();
    let raf = 0;
    let n = 0;

    const fire = (s: Seg) => {
      n++;
      if (s.event === "hitL") {
        setSwingL(n);
        setRally((r) => r + 1);
      } else if (s.event === "hitR") {
        setSwingR(n);
        setRally((r) => r + 1);
      } else if (s.event === "bounce") setImpact({ x: s.from.x, n });
      else setFlash({ side: s.event === "glassR" ? "R" : "L", n });
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        segStart = now; // freeze while off screen
        return;
      }
      let s = SEGMENTS[seg];
      let t = (now - segStart) / s.ms;
      if (t >= 1) {
        seg = (seg + 1) % SEGMENTS.length;
        segStart = now;
        s = SEGMENTS[seg];
        t = 0;
        fire(s);
      }
      place(pointAt(s, t));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
      <div className="flex items-center gap-2 rounded-full bg-ink px-3 py-1 font-mono text-xs text-paper">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        live from the court
      </div>
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-xs uppercase tracking-wider text-faint">rally</span>
        <span key={rally} className="inline-block text-xl font-medium tabular-nums text-ink animate-[pop_0.3s_ease-out]">
          {String(rally).padStart(2, "0")}
        </span>
      </div>
      </div>

      <svg viewBox="0 30 1000 260" className="block w-full" role="img" aria-label="Animated padel rally">
        {/* sky-ish backdrop + fence */}
        <defs>
          <linearGradient id="court" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2F6FB0" />
            <stop offset="1" stopColor="#1F4F86" />
          </linearGradient>
          <pattern id="mesh" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 12 L12 0 M-3 3 L3 -3 M9 15 L15 9" stroke="#C9C6BE" strokeWidth="1" />
          </pattern>
        </defs>

        {/* fences above the glass */}
        <rect x="30" y="40" width="22" height="70" fill="url(#mesh)" />
        <rect x="948" y="40" width="22" height="70" fill="url(#mesh)" />
        {/* back glass walls */}
        <rect
          x="30"
          y="110"
          width="22"
          height="152"
          rx="2"
          fill="#BFE3F2"
          opacity={flash?.side === "L" ? 0.95 : 0.45}
          className="transition-opacity duration-300"
          key={`gl${flash?.side === "L" ? flash.n : 0}`}
        />
        <rect
          x="948"
          y="110"
          width="22"
          height="152"
          rx="2"
          fill="#BFE3F2"
          opacity={flash?.side === "R" ? 0.95 : 0.45}
          className="transition-opacity duration-300"
          key={`gr${flash?.side === "R" ? flash.n : 0}`}
        />
        {/* court surface */}
        <rect x="30" y="262" width="940" height="16" fill="url(#court)" />
        <rect x="30" y="278" width="940" height="4" fill="#16161A" opacity="0.15" />
        {/* service lines */}
        <rect x="235" y="262" width="3" height="16" fill="#fff" opacity="0.8" />
        <rect x="762" y="262" width="3" height="16" fill="#fff" opacity="0.8" />
        {/* net */}
        <rect x="497" y="214" width="6" height="48" fill="#16161A" />
        <rect x="490" y="214" width="20" height="5" rx="2" fill="#16161A" />
        <rect x="499" y="219" width="2" height="43" fill="url(#mesh)" />

        {/* bounce impact */}
        {impact && (
          <ellipse key={impact.n} cx={impact.x} cy={FLOOR} rx="6" ry="2" fill="none" stroke="#16161A" className="impact" />
        )}

        {/* rackets */}
        <g transform={`translate(${L_HIT.x - 22} ${L_HIT.y + 4}) rotate(-25)`}>
          <Racket swingKey={swingL} />
        </g>
        <g transform={`translate(${R_HIT.x + 22} ${R_HIT.y + 4}) rotate(25)`}>
          <Racket flip swingKey={swingR} />
        </g>

        {/* ball + shadow */}
        <ellipse ref={shadowRef} cx="150" cy={FLOOR + 1} rx="10" ry="2.5" fill="#16161A" opacity="0.2" />
        <g ref={ballRef} transform={`translate(${L_HIT.x} ${L_HIT.y})`}>
          <g className="ball-spin">
            <circle r="9" fill="#D7F034" stroke="#9DB61E" strokeWidth="1" />
            <path d="M -8 -3 Q 0 3 8 -3" fill="none" stroke="#fff" strokeWidth="1.6" />
            <path d="M -8 4 Q 0 -2 8 4" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
