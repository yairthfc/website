import { useEffect, useRef } from "react";

/**
 * Background for the personal page: one padel racket rallying a ball against
 * the left and right edges of the screen (the "walls").
 *
 * Racket drawn to real proportions (local units = mm): 455 long, 260 wide,
 * 38 deep, 13 mm holes, open "heart" at the throat. Face centre is (0, 0),
 * the wrist pivot is at (0, 250).
 */

const LEN = 456; // -150 .. 306

// Outer frame: round head flowing into two arms that meet the grip.
const HEAD =
  "M 0 -150 C 78 -150 130 -104 130 -30 C 130 32 104 84 62 118 C 48 130 38 140 34 152 L 22 196 L -22 196 L -34 152 C -38 140 -48 130 -62 118 C -104 84 -130 32 -130 -30 C -130 -104 -78 -150 0 -150 Z";
// Hitting surface, inset from the frame.
const FACE =
  "M 0 -137 C 70 -137 117 -95 117 -30 C 117 26 95 72 56 104 C 40 117 20 124 0 124 C -20 124 -40 117 -56 104 C -95 72 -117 26 -117 -30 C -117 -95 -70 -137 0 -137 Z";
// Open "heart" between the two arms.
const HEART = "M 0 140 C 12 140 16 143 14 150 L 5 182 C 3 187 -3 187 -5 182 L -14 150 C -16 143 -12 140 0 140 Z";
const GRIP = { x: -19, y: 192, w: 38, h: 102 };

const HOLES: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const dx = 24;
  const dy = 21;
  for (let row = -6; row <= 6; row++) {
    const y = -10 + row * dy;
    const off = row % 2 ? dx / 2 : 0;
    for (let x = -96 + off; x <= 96; x += dx) {
      const nx = x / 94;
      const ny = (y + 10) / 108;
      if (nx * nx + ny * ny < 1 && y < 92) out.push({ x, y });
    }
  }
  return out;
})();

const DEPTH = 7; // layers used to fake the 38 mm frame thickness

function Racket() {
  return (
    <g>
      <defs>
        <mask id="pr-holes" maskUnits="userSpaceOnUse" x="-200" y="-220" width="400" height="640">
          <rect x="-200" y="-220" width="400" height="640" fill="white" />
          <path d={HEART} fill="black" />
          {HOLES.map((h, i) => (
            <circle key={i} cx={h.x} cy={h.y} r="6.5" fill="black" />
          ))}
        </mask>
        <clipPath id="pr-face">
          <path d={FACE} />
        </clipPath>
        <clipPath id="pr-head">
          <path d={HEAD} />
        </clipPath>
        <linearGradient id="pr-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#45454F" />
          <stop offset="0.45" stopColor="#1B1B21" />
          <stop offset="1" stopColor="#0E0E12" />
        </linearGradient>
        <linearGradient id="pr-faceg" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#2E2E36" />
          <stop offset="1" stopColor="#121216" />
        </linearGradient>
        <pattern id="pr-carbon" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill="#fff" opacity="0.045" />
          <rect x="4" y="4" width="4" height="4" fill="#fff" opacity="0.045" />
        </pattern>
        <linearGradient id="pr-gloss" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pr-grip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0E0E12" />
          <stop offset="0.45" stopColor="#3A3A44" />
          <stop offset="1" stopColor="#0E0E12" />
        </linearGradient>
        <filter id="pr-shadow" x="-40%" y="-30%" width="180%" height="160%">
          <feDropShadow dx="16" dy="24" stdDeviation="14" floodColor="#16161A" floodOpacity="0.28" />
        </filter>
      </defs>

      <g filter="url(#pr-shadow)">
        {/* frame depth: stacked offset silhouettes, holes cut through every layer */}
        {Array.from({ length: DEPTH }).map((_, k) => {
          const i = DEPTH - k;
          const shade = 10 + Math.round((k / DEPTH) * 14);
          return (
            <g key={i} transform={`translate(${i * 1.6} ${i * 1.1})`}>
              <path d={HEAD} fill={`rgb(${shade},${shade},${shade + 3})`} mask="url(#pr-holes)" />
              <rect {...{ x: GRIP.x, y: GRIP.y, width: GRIP.w, height: GRIP.h }} rx="9" fill="#0B0B0E" />
            </g>
          );
        })}

        {/* strap */}
        <path
          d="M -9 306 C -34 334 -24 372 0 375 C 24 372 34 334 9 306"
          fill="none"
          stroke="#2A2A31"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* grip with overgrip wrap */}
        <rect x={GRIP.x} y={GRIP.y} width={GRIP.w} height={GRIP.h} rx="9" fill="url(#pr-grip)" />
        <g clipPath="url(#pr-gripclip)">
          {Array.from({ length: 13 }).map((_, i) => (
            <path
              key={i}
              d={`M ${GRIP.x} ${GRIP.y + 6 + i * 8} L ${GRIP.x + GRIP.w} ${GRIP.y - 6 + i * 8}`}
              stroke="#000"
              strokeOpacity="0.45"
              strokeWidth="1.6"
            />
          ))}
        </g>
        <rect x="-21" y="188" width="42" height="9" rx="3" fill="#E8590C" />
        <rect x="-24" y="292" width="48" height="15" rx="6" fill="#16161A" />
        <rect x="-24" y="292" width="48" height="4" rx="2" fill="#E8590C" />

        {/* front of the head */}
        <g mask="url(#pr-holes)">
          <path d={HEAD} fill="url(#pr-frame)" />
          <g clipPath="url(#pr-face)">
            <rect x="-140" y="-160" width="280" height="300" fill="url(#pr-faceg)" />
            <rect x="-140" y="-160" width="280" height="300" fill="url(#pr-carbon)" />
            {/* graphics */}
            <path d="M -140 70 C -60 40 30 -40 140 -70 L 140 -40 C 40 -12 -50 62 -140 96 Z" fill="#E8590C" opacity="0.92" />
            <path d="M -140 104 C -50 72 40 -2 140 -26 L 140 -16 C 44 8 -46 82 -140 114 Z" fill="#D7F034" opacity="0.9" />
          </g>
          {/* inner frame edge + accent line */}
          <path d={FACE} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="3" />
          <path d={FACE} fill="none" stroke="#E8590C" strokeOpacity="0.8" strokeWidth="1.2" transform="translate(0 -1)" />
          {/* gloss */}
          <g clipPath="url(#pr-head)">
            <rect x="-140" y="-160" width="280" height="360" fill="url(#pr-gloss)" />
          </g>
        </g>

        {/* rubber bumper on the top of the frame */}
        <path
          d="M -86 -128 C -50 -152 50 -152 86 -128"
          fill="none"
          stroke="#2B2B33"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M -80 -131 C -46 -151 46 -151 80 -131"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Ball() {
  return (
    <g>
      <defs>
        <radialGradient id="pb-felt" cx="0.34" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#F4FF8A" />
          <stop offset="0.55" stopColor="#D7F034" />
          <stop offset="1" stopColor="#8FA81A" />
        </radialGradient>
        <radialGradient id="pb-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#16161A" stopOpacity="0.3" />
          <stop offset="1" stopColor="#16161A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="9" cy="16" rx="13" ry="9" fill="url(#pb-shadow)" />
      <circle r="10" fill="url(#pb-felt)" />
      <g data-seam>
        <path d="M -9.5 -3.5 C -4 2.5 4 2.5 9.5 -3.5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M -9.5 4 C -4 -2 4 -2 9.5 4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
      </g>
    </g>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function PadelBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const racketRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const flashL = useRef<SVGRectElement>(null);
  const flashR = useRef<SVGRectElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let W = 0;
    let H = 0;
    let s = 1; // px per mm
    let ballR = 10;

    const layout = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      s = Math.min(320, Math.max(180, H * 0.32)) / LEN;
      ballR = 33 * s; // 6.6 cm ball
    };
    layout();
    window.addEventListener("resize", layout);

    const SWEET = -25; // sweet spot, slightly above face centre
    const racketAt = (x: number, y: number, angle: number, turn: number) =>
      racketRef.current?.setAttribute(
        "transform",
        `translate(${x} ${y}) scale(${s}) rotate(${angle} 0 250) scale(${turn} 1)`,
      );
    const ballAt = (x: number, y: number, sx: number, spin: number) => {
      ballRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${(ballR / 10) * sx} ${ballR / 10})`);
      ballRef.current?.querySelector("[data-seam]")?.setAttribute("transform", `rotate(${spin})`);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      racketAt(W * 0.5, H * 0.62, -8, 0.95);
      ballAt(W * 0.5 - 120 * s, H * 0.62 + SWEET * s - 40, 1, 0);
      return () => window.removeEventListener("resize", layout);
    }

    // ---- rally state ----
    let dir = -1; // direction of the shot just played: -1 to the left wall, 1 to the right
    let C = { x: W * 0.5, y: H * 0.6 + SWEET * s }; // contact point (ball) of the last hit
    let Wp = { x: 0, y: 0 }; // wall point
    let Q = { x: 0, y: 0 }; // next contact point
    let tHit = 0;
    let tWall = 0;
    let tNext = 0;
    let arc1 = 0;
    let arc2 = 0;
    let flashSide: -1 | 1 = -1;

    const plan = (now: number) => {
      const speed = Math.max(380, W * 0.5); // px / s, a soft hit
      Wp = { x: dir < 0 ? ballR : W - ballR, y: H * rand(0.22, 0.5) };
      Q = { x: W * rand(0.36, 0.64), y: H * rand(0.52, 0.68) + SWEET * s };
      tHit = now;
      tWall = now + (Math.abs(Wp.x - C.x) / speed) * 1000;
      tNext = tWall + (Math.abs(Q.x - Wp.x) / speed) * 1000;
      arc1 = rand(50, 120);
      arc2 = rand(30, 90);
      flashSide = dir as -1 | 1;
    };
    plan(performance.now());

    const swingAngle = (now: number, tc: number, d: number) => {
      // d: direction of the hit at tc. Backswing tilts the head away from the target,
      // then the racket swings through contact into a follow-through.
      const B = -d * 32;
      const F = d * 26;
      const dt = now - tc;
      if (dt < -750) return 0;
      if (dt < -220) return B * ease(clamp01((dt + 750) / 530));
      if (dt < 160) return B + (F - B) * ease(clamp01((dt + 220) / 380));
      if (dt < 900) return F * (1 - ease(clamp01((dt - 160) / 740)));
      return 0;
    };

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      if (now >= tNext) {
        C = Q;
        dir = -dir as -1 | 1;
        plan(now);
      }

      // ---- ball ----
      let bx: number, by: number;
      if (now < tWall) {
        const t = (now - tHit) / (tWall - tHit);
        bx = C.x + (Wp.x - C.x) * t;
        by = C.y + (Wp.y - C.y) * t - 4 * arc1 * t * (1 - t);
      } else {
        const t = (now - tWall) / (tNext - tWall);
        bx = Wp.x + (Q.x - Wp.x) * t;
        by = Wp.y + (Q.y - Wp.y) * t - 4 * arc2 * t * (1 - t);
      }
      const wallDt = Math.abs(now - tWall);
      const squash = wallDt < 90 ? 1 - 0.22 * (1 - wallDt / 90) : 1;
      ballAt(bx, by, squash, now * 0.45 * dir);

      // wall glow
      const glow = now >= tWall ? Math.max(0, 1 - (now - tWall) / 450) : 0;
      (flashSide < 0 ? flashL : flashR).current?.setAttribute("opacity", String(glow * 0.9));
      (flashSide < 0 ? flashR : flashL).current?.setAttribute("opacity", "0");
      const fy = Wp.y - 90;
      flashL.current?.setAttribute("y", String(fy));
      flashR.current?.setAttribute("y", String(fy));

      // ---- racket ----
      // glide from the last contact to the next one, arriving a beat early
      const moveT = ease(clamp01((now - tHit - 200) / Math.max(300, tNext - tHit - 450)));
      const rx = C.x + (Q.x - C.x) * moveT;
      const ry = C.y + (Q.y - C.y) * moveT - SWEET * s + Math.sin(now / 520) * 3;
      // the next hit goes back the other way
      const angle = swingAngle(now, tNext, -dir) + swingAngle(now, tHit, dir);
      const turn = 1 - 0.22 * Math.min(1, Math.abs(angle) / 32); // wrist rotation foreshortens the face
      racketAt(rx, ry, angle, turn);
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
        <defs>
          <linearGradient id="wall-glow-l" x1="0" x2="1">
            <stop offset="0" stopColor="#D7F034" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D7F034" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wall-glow-r" x1="1" x2="0">
            <stop offset="0" stopColor="#D7F034" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D7F034" stopOpacity="0" />
          </linearGradient>
          <clipPath id="pr-gripclip">
            <rect x={GRIP.x} y={GRIP.y} width={GRIP.w} height={GRIP.h} rx="9" />
          </clipPath>
        </defs>
        <rect ref={flashL} x="0" y="0" width="14" height="180" fill="url(#wall-glow-l)" opacity="0" />
        <rect ref={flashR} x="100%" y="0" width="14" height="180" fill="url(#wall-glow-r)" opacity="0" transform="translate(-14 0)" />
        <g className="opacity-30 lg:opacity-40">
          <g ref={racketRef}>
            <Racket />
          </g>
        </g>
        <g className="opacity-60 lg:opacity-80">
          <g ref={ballRef}>
            <Ball />
          </g>
        </g>
      </svg>
    </div>
  );
}
