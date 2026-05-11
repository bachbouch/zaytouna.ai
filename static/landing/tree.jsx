// tree.jsx — animated logo: breathing halo, electric circuit pulses, drifting sparks
// Exposes window.OliveTree

const { useEffect, useMemo, useRef, useState } = React;

function useCursor(ref) {
  const [c, setC] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setC({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return c;
}

function useRAF() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf, start = performance.now();
    const tick = (now) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

// Circuit-root pulses: small dots traveling along stylized paths approximating
// the logo's circuit roots, glowing in sequence.
function CircuitPulses({ palette }) {
  const t = useRAF();
  // Each "trace" is a series of points (rel to logo center). Pulses animate along.
  const traces = useMemo(() => ([
    // left side roots
    [[-10, 60], [-50, 70], [-90, 80], [-130, 95], [-170, 115], [-200, 140]],
    [[-10, 70], [-40, 90], [-70, 120], [-95, 150], [-120, 180]],
    [[-5, 75], [-15, 110], [-25, 145], [-35, 180], [-45, 215]],
    // center roots
    [[0, 70], [0, 105], [5, 145], [-5, 185], [0, 220]],
    [[5, 70], [15, 110], [25, 145], [20, 180], [25, 215]],
    // right side roots
    [[10, 60], [50, 70], [90, 80], [130, 95], [170, 115], [200, 140]],
    [[10, 70], [40, 90], [70, 120], [95, 150], [120, 180]],
    [[5, 75], [15, 110], [25, 145], [35, 180], [45, 215]],
  ]), []);

  const pathFor = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  return (
    <g style={{ mixBlendMode: palette.dark ? "screen" : "normal" }}>
      {/* underlay traces */}
      {traces.map((pts, i) => (
        <path key={`u${i}`} d={pathFor(pts)} fill="none"
          stroke={palette.warm} strokeWidth="0.6" opacity="0.22"
          strokeLinecap="round" />
      ))}
      {/* traveling pulses */}
      {traces.map((pts, i) => {
        if (!pts || pts.length < 2) return null;
        const len = pts.length - 1;
        const speed = 0.45 + (i % 3) * 0.12;
        const phase = ((t * speed + i * 0.18) % 1 + 1) % 1;
        const idx = phase * len;
        const k = Math.min(Math.max(0, Math.floor(idx)), len - 1);
        const f = idx - k;
        const a = pts[k]; const b = pts[Math.min(k + 1, pts.length - 1)];
        if (!a || !b) return null;
        const x = a[0] + (b[0] - a[0]) * f;
        const y = a[1] + (b[1] - a[1]) * f;
        // pulse intensity follows a sine wave so it fades in & out
        const intensity = Math.sin(phase * Math.PI);
        return (
          <g key={`p${i}`}>
            <circle cx={x} cy={y} r={6} fill={palette.warm} opacity={0.18 * intensity} />
            <circle cx={x} cy={y} r={2.4} fill={palette.warm} opacity={0.95 * intensity} />
          </g>
        );
      })}
      {/* node dots that softly twinkle on the trace endpoints */}
      {traces.map((pts, i) => {
        const tip = pts[pts.length - 1];
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.6 + i));
        return (
          <circle key={`n${i}`} cx={tip[0]} cy={tip[1]} r="2.2"
            fill={palette.warm} opacity={tw * 0.9} />
        );
      })}
    </g>
  );
}

// Drifting leaf/spark particles around the canopy
function Particles({ palette, count = 28 }) {
  const t = useRAF();
  const seeds = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({
      i, radius: 200 + (i * 41) % 160,
      speed: 0.05 + ((i * 13) % 7) * 0.012,
      phase: (i * 1.317) % (Math.PI * 2),
      size: 1.6 + ((i * 7) % 30) / 10,
      kind: i % 4 === 0 ? "spark" : "leaf",
      wobble: 7 + (i % 4) * 3,
    })),
    [count]
  );
  return (
    <g>
      {seeds.map((s) => {
        const a = s.phase + t * s.speed;
        const x = Math.cos(a) * s.radius + Math.sin(t * 0.6 + s.phase) * s.wobble;
        const y = Math.sin(a) * s.radius * 0.55 - 140
                + Math.cos(t * 0.7 + s.phase) * s.wobble;
        const fill = s.kind === "spark" ? palette.warm : palette.green;
        const op = 0.18 + 0.22 * (1 + Math.sin(t * 1.2 + s.phase));
        if (s.kind === "spark") {
          return <circle key={s.i} cx={x} cy={y} r={s.size * 0.5} fill={fill} opacity={op} />;
        }
        return (
          <ellipse key={s.i} cx={x} cy={y}
            rx={s.size * 2.4} ry={s.size * 0.75}
            transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
            fill={fill} opacity={op} />
        );
      })}
    </g>
  );
}

// Main hero tree
function OliveTree({ palette, density = "regular", height = 620, interactive = true, label }) {
  const ref = useRef(null);
  const cursor = useCursor(ref);
  const t = useRAF();
  const cx = interactive ? (cursor.x - 0.5) * 2 : 0;
  const cy = interactive ? (cursor.y - 0.5) * 2 : 0;
  const dark = palette.dark;
  const breath = 1 + 0.025 * Math.sin(t * 0.8);

  return (
    <div ref={ref} style={{
      position: "relative", width: "100%", height,
      display: "flex", justifyContent: "center", alignItems: "center",
      perspective: 1400,
    }}>
      {/* breathing halo */}
      <div style={{
        position: "absolute",
        width: 720, height: 720, borderRadius: "50%",
        background: `radial-gradient(circle, ${palette.warm}33 0%, ${palette.warm}14 30%, ${palette.green}08 55%, transparent 75%)`,
        filter: "blur(20px)",
        transform: `translate(${cx * 16}px, ${cy * 12}px) scale(${breath})`,
        transition: "transform 240ms cubic-bezier(.2,.7,.3,1)",
        pointerEvents: "none",
      }} />

      {/* concentric breathing rings */}
      <svg viewBox="-360 -360 720 720" width="720" height="720"
        style={{
          position: "absolute", overflow: "visible", pointerEvents: "none",
          transform: `translate(${cx * 4}px, ${cy * 3}px)`,
          transition: "transform 360ms cubic-bezier(.2,.7,.3,1)",
        }}>
        {[0, 1, 2].map((i) => {
          const phase = (t * 0.4 + i * 0.6) % 3;
          const r = 120 + phase * 80;
          const op = Math.max(0, 0.25 - phase * 0.08);
          return (
            <circle key={i} cx="0" cy="0" r={r} fill="none"
              stroke={palette.warm} strokeWidth="0.5" opacity={op} />
          );
        })}
      </svg>

      {/* particles + circuit pulses (overlaid above logo for glow on dark) */}
      <svg viewBox="-300 -300 600 600" width="600" height="600"
        style={{
          position: "absolute", overflow: "visible",
          transform: `translate(${cx * 6}px, ${cy * 4}px) scale(0.93)`,
          transition: "transform 300ms cubic-bezier(.2,.7,.3,1)",
          pointerEvents: "none", zIndex: 3,
        }}>
        <CircuitPulses palette={palette} />
        <Particles palette={palette} />
      </svg>

      {/* the logo */}
      <img src="/static/landing/assets/zaytouna-logo.png" alt="Zaytouna olive tree"
        style={{
          width: "min(380px, 62%)", aspectRatio: "1 / 1", height: "auto", objectFit: "contain",
          position: "relative", zIndex: 2,
          transform: `rotateY(${cx * 4}deg) rotateX(${-cy * 3}deg) translate(${cx * 8}px, ${cy * 6}px) scale(${breath})`,
          transformStyle: "preserve-3d",
          transition: "transform 220ms cubic-bezier(.2,.7,.3,1)",
          filter: dark
            ? `drop-shadow(0 30px 60px ${palette.warm}3a) drop-shadow(0 0 18px ${palette.warm}22) brightness(1.06)`
            : `drop-shadow(0 24px 50px rgba(0,0,0,.14))`,
          userSelect: "none", pointerEvents: "none",
        }} />

      {label && (
        <div style={{
          position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
          font: "10px var(--mono)", letterSpacing: "0.24em", textTransform: "uppercase",
          color: palette.fg, opacity: 0.35, zIndex: 4, whiteSpace: "nowrap",
        }}>{label}</div>
      )}
    </div>
  );
}

window.OliveTree = OliveTree;
