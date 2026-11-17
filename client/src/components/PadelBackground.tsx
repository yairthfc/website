import { useEffect, useRef } from "react";

/**
 * Background for the personal page: a padel racket rallying a ball against the
 * left and right edges of the screen. It hits right with the front face and
 * left with the back face, turning around its long axis between shots.
 *
 * Local units = mm. Real proportions: 455 long, 260 wide, 38 deep, 13 mm holes.
 * Face centre is (0, 0), wrist pivot is (0, 250).
 */

const LEN = 456;
const DEPTH_MM = 38;
const LAYERS = 9;

// Slightly diamond-shaped head (widest high up) flowing into two arms.
const HEAD =
  "M 0 -150 C 86 -150 132 -112 132 -58 C 132 2 100 66 60 114 C 48 128 38 140 34 152 L 22 196 L -22 196 L -34 152 C -38 140 -48 128 -60 114 C -100 66 -132 2 -132 -58 C -132 -112 -86 -150 0 -150 Z";
const FACE =
  "M 0 -137 C 77 -137 119 -104 119 -58 C 119 -4 92 54 56 98 C 40 116 20 124 0 124 C -20 124 -40 116 -56 98 C -92 54 -119 -4 -119 -58 C -119 -104 -77 -137 0 -137 Z";
const HEART = "M 0 140 C 12 140 16 143 14 150 L 5 182 C 3 187 -3 187 -5 182 L -14 150 C -16 143 -12 140 0 140 Z";
const GRIP = { x: -19, y: 192, w: 38, h: 102 };

const HOLES: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const dx = 23;
  const dy = 20;
  for (let row = -6; row <= 6; row++) {
    const y = -36 + row * dy;
    const off = row % 2 ? dx / 2 : 0;
    for (let x = -100 + off; x <= 100; x += dx) {
      const nx = x / 98;
      const ny = (y + 36) / 104;
      // leave the top centre clear for the logo
      const logo = Math.abs(x) < 34 && y < -78;
      if (nx * nx + ny * ny < 1 && y < 84 && !logo) out.push({ x, y });
    }
  }
  return out;
})();

/** YM signature, same strokes as the site logo (36-unit box, centred). */
function Signature({ size, color }: { size: number; color: string }) {
  const k = size / 36;
  return (
    <g transform={`scale(${k}) translate(-18 -18)`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="16" strokeWidth="1.8" />
      <path d="M 8 8 L 14 18 L 14 26" strokeWidth="2.4" />
      <path d="M 19 26 L 19 12 L 23 20 L 27 12 L 27 26" strokeWidth="2.4" />
    </g>
  );
}

/** One face of the racket. `variant` changes the colourway. */
function FaceArt({ variant }: { variant: "front" | "back" }) {
  const main = variant === "front" ? "#E8590C" : "#D7F034";
  const second = variant === "front" ? "#D7F034" : "#E8590C";
  return (
    <g mask="url(#pr-holes)">
      {/* frame */}
      <path d={HEAD} fill="url(#pr-frame)" />
      <g clipPath="url(#pr-face)">
        <rect x="-140" y="-160" width="280" height="300" fill="url(#pr-faceg)" />
        <rect x="-140" y="-160" width="280" height="300" fill="url(#pr-carbon)" />
        {/* angular panels, sharp like a pro racket */}
        <polygon points="-140,-160 -40,-160 -140,-20" fill={main} />
        <polygon points="-140,-160 -52,-160 -140,-36" fill="#000" opacity="0.25" />
        <polygon points="140,40 140,140 40,140" fill={main} />
        {/* chevron */}
        <polygon points="-130,-6 0,96 130,-6 130,24 0,126 -130,24" fill={second} />
        <polygon points="-130,-30 0,72 130,-30 130,-24 0,78 -130,-24" fill="#fff" opacity="0.85" />
        <polygon points="-130,34 0,136 130,34 130,38 0,140 -130,38" fill="#fff" opacity="0.6" />
      </g>
      {/* signature logo where a brand mark would sit */}
      <g transform="translate(0 -104)">
        <Signature size={52} color="#fff" />
      </g>
      {/* inner frame edge + accent */}
      <path d={FACE} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="3" />
      <path d={FACE} fill="none" stroke={main} strokeWidth="1.4" transform="translate(0 -1)" />
      {/* wordmark on the bridge */}
      <text
        x="0"
        y="135"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="9.5"
        letterSpacing="1.5"
        fill="#fff"
      >
        MAHFUD
      </text>
      {/* rubber bumper */}
      <path d="M -88 -128 C -52 -153 52 -153 88 -128" fill="none" stroke="#2B2B33" strokeWidth="7" strokeLinecap="round" />
      {/* moving gloss */}
      <g clipPath="url(#pr-head)">
        <rect data-gloss x="-140" y="-160" width="280" height="360" fill="url(#pr-gloss)" />
      </g>
    </g>
  );
}

function Ball() {
  return (
    <g>
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

// side colours of the frame, front to back: carbon with a coloured stripe in the middle
const LAYER_FILL = Array.from({ length: LAYERS }, (_, k) =>
  k === 4 ? "#E8590C" : k === 3 || k === 5 ? "#26262D" : "#141418",
);

export default function PadelBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const racketRef = useRef<SVGGElement>(null);
  const layerRefs = useRef<(SVGUseElement | null)[]>([]);
  const frontRef = useRef<SVGGElement>(null);
  const backRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const flashL = useRef<SVGRectElement>(null);
  const flashR = useRef<SVGRectElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let W = 0;
    let H = 0;
    let s = 1;
    let ballR = 10;

    const layout = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      s = Math.min(330, Math.max(180, H * 0.33)) / LEN;
      ballR = 33 * s;
    };
    layout();
    window.addEventListener("resize", layout);

    const SWEET = -30;

    /** theta: rotation around the racket's long axis, in degrees. 0 = front face to us. */
    const drawRacket = (x: number, y: number, tilt: number, theta: number) => {
      const r = (theta * Math.PI) / 180;
      const c = Math.cos(r);
      const sn = Math.sin(r);
      racketRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${s}) rotate(${tilt} 0 250)`);
      // frame thickness: silhouettes spread along x as the racket turns
      const cx = Math.abs(c) < 0.02 ? 0.02 * Math.sign(c || 1) : c;
      layerRefs.current.forEach((el, k) => {
        const off = ((k + 1) / LAYERS) * DEPTH_MM * sn;
        el?.setAttribute("transform", `translate(${off} 0) scale(${cx} 1)`);
      });
      const showFront = c >= 0;
      frontRef.current?.setAttribute("display", showFront ? "inline" : "none");
      backRef.current?.setAttribute("display", showFront ? "none" : "inline");
      const face = showFront ? frontRef.current : backRef.current;
      face?.setAttribute("transform", `scale(${cx} 1)`);
      // gloss slides across the face as it turns
      face?.querySelector("[data-gloss]")?.setAttribute("transform", `translate(${sn * 160 * (showFront ? 1 : -1)} 0)`);
    };
    const ballAt = (x: number, y: number, sx: number, spin: number) => {
      ballRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${(ballR / 10) * sx} ${ballR / 10})`);
      ballRef.current?.querySelector("[data-seam]")?.setAttribute("transform", `rotate(${spin})`);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawRacket(W * 0.5, H * 0.6, -6, 28);
      ballAt(W * 0.5 + 140 * s, H * 0.6 + SWEET * s - 30, 1, 0);
      return () => window.removeEventListener("resize", layout);
    }

    // ---- rally state ----
    // dir: direction of the shot just played. Right (1) = front face, left (-1) = back face.
    let dir: -1 | 1 = 1;
    let theta = 0; // accumulates, always turning the same way
    let thetaFrom = 0;
    let C = { x: W * 0.5, y: H * 0.6 + SWEET * s };
    let Wp = { x: 0, y: 0 };
    let Q = { x: 0, y: 0 };
    let tHit = 0;
    let tWall = 0;
    let tNext = 0;
    let arc1 = 0;
    let arc2 = 0;

    const plan = (now: number) => {
      const speed = Math.max(380, W * 0.48);
      Wp = { x: dir < 0 ? ballR : W - ballR, y: H * rand(0.22, 0.5) };
      Q = { x: W * rand(0.38, 0.62), y: H * rand(0.52, 0.66) + SWEET * s };
      tHit = now;
      tWall = now + (Math.abs(Wp.x - C.x) / speed) * 1000;
      tNext = tWall + (Math.abs(Q.x - Wp.x) / speed) * 1000;
      arc1 = rand(50, 120);
      arc2 = rand(30, 90);
      thetaFrom = theta;
    };
    plan(performance.now());

    const swing = (now: number, tc: number, d: number) => {
      // tilt in the screen plane: backswing away from the target, then through contact
      const B = -d * 26;
      const F = d * 22;
      const dt = now - tc;
      if (dt < -700) return 0;
      if (dt < -200) return B * ease(clamp01((dt + 700) / 500));
      if (dt < 160) return B + (F - B) * ease(clamp01((dt + 200) / 360));
      if (dt < 850) return F * (1 - ease(clamp01((dt - 160) / 690)));
      return 0;
    };
    const twist = (now: number, tc: number, d: number) => {
      // small extra wrist turn around the long axis: opens before contact, closes after
      const dt = now - tc;
      return d * 22 * Math.exp(-(((dt + 120) / 260) ** 2)) * Math.tanh(-(dt + 40) / 120);
    };

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      if (now >= tNext) {
        C = Q;
        dir = -dir as -1 | 1;
        theta = thetaFrom + 180;
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

      const glow = now >= tWall ? Math.max(0, 1 - (now - tWall) / 450) : 0;
      (dir < 0 ? flashL : flashR).current?.setAttribute("opacity", String(glow * 0.9));
      (dir < 0 ? flashR : flashL).current?.setAttribute("opacity", "0");
      flashL.current?.setAttribute("y", String(Wp.y - 90));
      flashR.current?.setAttribute("y", String(Wp.y - 90));

      // ---- racket ----
      const moveT = ease(clamp01((now - tHit - 200) / Math.max(300, tNext - tHit - 450)));
      const rx = C.x + (Q.x - C.x) * moveT;
      const ry = C.y + (Q.y - C.y) * moveT - SWEET * s + Math.sin(now / 520) * 3;
      const tilt = swing(now, tNext, -dir) + swing(now, tHit, dir);
      // turn to the other face after the follow-through, finished well before the next backswing
      const turnStart = tHit + 380;
      const turnEnd = Math.max(turnStart + 500, Math.min(tNext - 750, turnStart + 1000));
      const th = thetaFrom + 180 * ease(clamp01((now - turnStart) / (turnEnd - turnStart)));
      const wrist = twist(now, tNext, -dir) + twist(now, tHit, dir);
      drawRacket(rx, ry, tilt, th + wrist);
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
          <mask id="pr-holes" maskUnits="userSpaceOnUse" x="-200" y="-220" width="400" height="640">
            <rect x="-200" y="-220" width="400" height="640" fill="white" />
            <path d={HEART} fill="black" />
            {HOLES.map((h, i) => (
              <circle key={i} cx={h.x} cy={h.y} r="6.5" fill="black" />
            ))}
          </mask>
          <path id="pr-body" d={HEAD} mask="url(#pr-holes)" />
          <clipPath id="pr-face">
            <path d={FACE} />
          </clipPath>
          <clipPath id="pr-head">
            <path d={HEAD} />
          </clipPath>
          <clipPath id="pr-gripclip">
            <rect x={GRIP.x} y={GRIP.y} width={GRIP.w} height={GRIP.h} rx="9" />
          </clipPath>
          <linearGradient id="pr-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#45454F" />
            <stop offset="0.45" stopColor="#1B1B21" />
            <stop offset="1" stopColor="#0E0E12" />
          </linearGradient>
          <linearGradient id="pr-faceg" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#2E2E36" />
            <stop offset="1" stopColor="#111115" />
          </linearGradient>
          <pattern id="pr-carbon" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="#fff" opacity="0.05" />
            <rect x="4" y="4" width="4" height="4" fill="#fff" opacity="0.05" />
          </pattern>
          <linearGradient id="pr-gloss" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.26" />
            <stop offset="0.52" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pr-grip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0E0E12" />
            <stop offset="0.45" stopColor="#3A3A44" />
            <stop offset="1" stopColor="#0E0E12" />
          </linearGradient>
          <filter id="pr-shadow" x="-60%" y="-30%" width="220%" height="160%">
            <feDropShadow dx="16" dy="24" stdDeviation="14" floodColor="#16161A" floodOpacity="0.28" />
          </filter>
          <radialGradient id="pb-felt" cx="0.34" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#F4FF8A" />
            <stop offset="0.55" stopColor="#D7F034" />
            <stop offset="1" stopColor="#8FA81A" />
          </radialGradient>
          <radialGradient id="pb-shadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#16161A" stopOpacity="0.3" />
            <stop offset="1" stopColor="#16161A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wall-glow-l" x1="0" x2="1">
            <stop offset="0" stopColor="#D7F034" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D7F034" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wall-glow-r" x1="1" x2="0">
            <stop offset="0" stopColor="#D7F034" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D7F034" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect ref={flashL} x="0" y="0" width="14" height="180" fill="url(#wall-glow-l)" opacity="0" />
        <rect ref={flashR} x="100%" y="0" width="14" height="180" fill="url(#wall-glow-r)" opacity="0" transform="translate(-14 0)" />

        <g className="opacity-30 lg:opacity-40">
          <g ref={racketRef}>
            <g filter="url(#pr-shadow)">
              {/* strap + grip: round, so they don't flatten when the racket turns */}
              <path
                d="M -9 306 C -34 334 -24 372 0 375 C 24 372 34 334 9 306"
                fill="none"
                stroke="#2A2A31"
                strokeWidth="4"
                strokeLinecap="round"
              />
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

              {/* frame thickness, back to front */}
              {LAYER_FILL.map((fill, k) => (
                <use
                  key={k}
                  href="#pr-body"
                  fill={fill}
                  ref={(el) => {
                    layerRefs.current[LAYERS - 1 - k] = el;
                  }}
                />
              ))}

              <g ref={frontRef}>
                <FaceArt variant="front" />
              </g>
              <g ref={backRef} display="none">
                {/* drawn mirrored so it reads correctly when the racket is turned around */}
                <g transform="scale(-1 1)">
                  <FaceArt variant="back" />
                </g>
              </g>

            </g>
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
