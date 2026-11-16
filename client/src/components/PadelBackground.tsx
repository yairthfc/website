import { useEffect, useRef } from "react";

/**
 * Full-screen background: two padel rackets in the page margins rallying a ball.
 * Fixed behind the content, no pointer events. Pure SVG + requestAnimationFrame.
 */

// Hex grid of drilled holes inside the face (local racket coordinates).
const HOLES: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const step = 13;
  for (let row = 0; row < 12; row++) {
    const y = -128 + row * step * 0.87;
    const offset = row % 2 ? step / 2 : 0;
    for (let x = -60 + offset; x <= 60; x += step) {
      // keep holes inside an ellipse a bit smaller than the face
      const nx = x / 50;
      const ny = (y + 72) / 62;
      if (nx * nx + ny * ny < 1) out.push({ x, y });
    }
  }
  return out;
})();

// Teardrop head outline, centred around y = -72.
const HEAD =
  "M 0 -150 C 66 -150 76 -96 70 -60 C 64 -24 40 2 18 16 L -18 16 C -40 2 -64 -24 -70 -60 C -76 -96 -66 -150 0 -150 Z";

function Racket({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-frame`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3a3a44" />
          <stop offset="0.5" stopColor="#16161A" />
          <stop offset="1" stopColor="#2a2a31" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#2b2b33" />
          <stop offset="1" stopColor="#141418" />
        </linearGradient>
        <pattern id={`${id}-carbon`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="transparent" />
          <rect width="3" height="3" fill="#ffffff" opacity="0.035" />
          <rect x="3" y="3" width="3" height="3" fill="#ffffff" opacity="0.035" />
        </pattern>
        <linearGradient id={`${id}-shine`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-holes`}>
          <path d={HEAD} fill="white" />
          {/* throat opening */}
          <path d="M -7 26 L 0 44 L 7 26 Z" fill="black" />
          {HOLES.map((h, i) => (
            <circle key={i} cx={h.x} cy={h.y} r="3.3" fill="black" />
          ))}
        </mask>
        <clipPath id={`${id}-faceclip`}>
          <path d={HEAD} transform="translate(0 -72) scale(0.9) translate(0 72)" />
        </clipPath>
      </defs>

      {/* strap */}
      <path
        d="M -6 150 C -30 175 -20 205 0 205 C 20 205 30 175 6 150"
        fill="none"
        stroke="#16161A"
        strokeWidth="3"
        opacity="0.7"
      />

      {/* handle + grip wrap */}
      <rect x="-10" y="56" width="20" height="92" rx="5" fill="#16161A" />
      {Array.from({ length: 11 }).map((_, i) => (
        <path key={i} d={`M -10 ${62 + i * 8} L 10 ${56 + i * 8}`} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
      ))}
      <rect x="-12" y="144" width="24" height="10" rx="4" fill="#E8590C" />

      {/* heart / throat */}
      <path d="M -22 10 C -18 30 -12 48 -10 60 L 10 60 C 12 48 18 30 22 10 Z" fill={`url(#${id}-frame)`} />

      {/* head: frame + face, holes cut with a mask so the page shows through */}
      <g mask={`url(#${id}-holes)`}>
        <path d={HEAD} fill={`url(#${id}-frame)`} />
        <g clipPath={`url(#${id}-faceclip)`}>
          <rect x="-80" y="-160" width="160" height="190" fill={`url(#${id}-face)`} />
          <rect x="-80" y="-160" width="160" height="190" fill={`url(#${id}-carbon)`} />
          {/* graphics */}
          <path d="M -80 -10 C -30 -40 10 -110 80 -130 L 80 -100 C 20 -86 -20 -20 -80 14 Z" fill="#E8590C" opacity="0.9" />
          <path d="M -80 18 C -26 -10 20 -70 80 -84 L 80 -74 C 24 -58 -20 0 -80 28 Z" fill="#D7F034" opacity="0.85" />
          <rect x="-80" y="-160" width="160" height="190" fill={`url(#${id}-shine)`} />
        </g>
      </g>

      {/* edge protector highlight on the top of the frame */}
      <path
        d="M -52 -132 C -30 -150 30 -150 52 -132"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function Ball() {
  return (
    <g>
      <defs>
        <radialGradient id="ball-shade" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#F2FF7A" />
          <stop offset="0.6" stopColor="#D7F034" />
          <stop offset="1" stopColor="#9DB61E" />
        </radialGradient>
      </defs>
      <circle r="11" fill="url(#ball-shade)" />
      <g className="ball-spin">
        <path d="M -10 -4 C -4 2 4 2 10 -4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M -10 5 C -4 -1 4 -1 10 5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      </g>
    </g>
  );
}

const TRAIL = 7;

export default function PadelBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let scale = 1;
    let lx = 0;
    let rx = 0;

    const layout = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      scale = Math.max(0.55, Math.min(1, H / 950));
      const container = Math.min(W, 1088);
      const margin = (W - container) / 2;
      // centre rackets in the side margins when there is room, otherwise hug the edges
      lx = Math.max(55 * scale, margin / 2);
      rx = W - lx;
    };
    layout();
    window.addEventListener("resize", layout);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Racket state
    const L = { y: H * 0.4, target: H * 0.4, swing: 0 };
    const R = { y: H * 0.6, target: H * 0.6, swing: 0 };
    const faceOffset = () => 72 * scale; // head centre sits above the grip origin

    const place = (el: SVGGElement | null, x: number, y: number, side: 1 | -1, swing: number) => {
      // side 1 = left racket (leans right), -1 = right racket (mirrored)
      const angle = side * (18 - swing);
      el?.setAttribute(
        "transform",
        `translate(${x} ${y + faceOffset()}) rotate(${angle}) scale(${side * scale} ${scale})`,
      );
    };

    const randY = () => H * (0.22 + Math.random() * 0.5);

    // Rally state: ball flies from one racket face to the other.
    let from: { x: number; y: number } = { x: lx + 40 * scale, y: L.y };
    let to: { x: number; y: number } = { x: rx - 40 * scale, y: randY() };
    let dir: 1 | -1 = 1; // 1 = left -> right
    let start = performance.now();
    let dur = 1700;
    let arc = 140;
    R.target = to.y;
    const trail: { x: number; y: number }[] = [];

    const newShot = (now: number) => {
      dir = (dir * -1) as 1 | -1;
      from = to;
      const ny = randY();
      // dir is the new direction: 1 means the ball now travels to the right racket
      to = dir === 1 ? { x: rx - 40 * scale, y: ny } : { x: lx + 40 * scale, y: ny };
      start = now;
      dur = 1500 + Math.random() * 500;
      arc = 90 + Math.random() * 140;
      (dir === 1 ? R : L).target = ny;
    };

    if (reduced) {
      place(leftRef.current, lx, L.y, 1, 0);
      place(rightRef.current, rx, R.y, -1, 0);
      ballRef.current?.setAttribute("transform", `translate(${W / 2} ${H * 0.35})`);
      return () => window.removeEventListener("resize", layout);
    }

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let t = (now - start) / dur;
      if (t >= 1) {
        newShot(now);
        t = 0;
      }
      // ease-in-out horizontally a touch, so the ball "leaves" the racket quickly
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t - 4 * arc * t * (1 - t);

      // receiving racket glides to meet the ball; the hitter drifts back to centre-ish
      L.y += (L.target - L.y) * 0.04;
      R.y += (R.target - R.y) * 0.04;

      // swing: a quick pulse around the moment of contact
      const msToContact = (1 - t) * dur;
      const msSinceHit = t * dur;
      const pulse = (ms: number) => Math.exp(-((ms / 140) ** 2));
      const receiving = dir === 1 ? R : L;
      const hitter = dir === 1 ? L : R;
      receiving.swing = -22 * pulse(msToContact - 60); // wind-up just before contact
      hitter.swing = 40 * pulse(msSinceHit - 40); // follow-through right after

      place(leftRef.current, lx, L.y, 1, L.swing);
      place(rightRef.current, rx, R.y, -1, R.swing);
      ballRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);

      trail.unshift({ x, y });
      if (trail.length > TRAIL) trail.pop();
      trail.forEach((p, i) => {
        const c = trailRefs.current[i];
        if (!c) return;
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.setAttribute("r", String(10 * scale * (1 - i / TRAIL)));
        c.setAttribute("opacity", String(0.18 * (1 - i / TRAIL)));
      });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <svg ref={svgRef} className="h-full w-full" preserveAspectRatio="none">
        <g className="opacity-20 xl:opacity-100">
          <g ref={leftRef}>
            <Racket id="rl" />
          </g>
          <g ref={rightRef}>
            <Racket id="rr" />
          </g>
        </g>
        <g className="opacity-40 xl:opacity-90">
          {Array.from({ length: TRAIL }).map((_, i) => (
            <circle
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
              r="0"
              fill="#D7F034"
            />
          ))}
          <g ref={ballRef}>
            <Ball />
          </g>
        </g>
      </svg>
    </div>
  );
}
