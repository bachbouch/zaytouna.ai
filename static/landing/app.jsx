// app.jsx — modern, dynamic, animated Zaytouna site
const { useEffect, useMemo, useRef, useState, useCallback } = React;
const C = window.ZContent;
const OliveTree = window.OliveTree;

// ── palettes ─────────────────────────────────────────────
const PALETTES = {
  ink: {
    name: "Ink", bg: "#0a0a0b", surface: "#111114", line: "rgba(232,227,214,0.08)",
    fg: "#f0ebde", muted: "rgba(240,235,222,0.58)", faint: "rgba(240,235,222,0.32)",
    green: "#9bb069", warm: "#d4a574", accent: "#fafafa", dark: true,
    meshA: "#d4a574", meshB: "#5a6f33", meshC: "#1a2412",
  },
  bone: {
    name: "Bone", bg: "#f4efe3", surface: "#ebe4d3", line: "rgba(20,18,12,0.10)",
    fg: "#14120c", muted: "rgba(20,18,12,0.62)", faint: "rgba(20,18,12,0.32)",
    green: "#3d4a2a", warm: "#a85a2e", accent: "#0e0e0e", dark: false,
    meshA: "#d4a574", meshB: "#a8b88a", meshC: "#f4efe3",
  },
  terra: {
    name: "Terra", bg: "#140d09", surface: "#1c1410", line: "rgba(228,206,178,0.10)",
    fg: "#f0e2cd", muted: "rgba(240,226,205,0.6)", faint: "rgba(240,226,205,0.32)",
    green: "#a8b88a", warm: "#e2a96f", accent: "#fff5e6", dark: true,
    meshA: "#e2a96f", meshB: "#7a4f25", meshC: "#0f0a06",
  },
  paper: {
    name: "Paper", bg: "#faf7ef", surface: "#f0eadc", line: "rgba(20,30,20,0.10)",
    fg: "#0f1a0c", muted: "rgba(15,26,12,0.62)", faint: "rgba(15,26,12,0.32)",
    green: "#5a6f33", warm: "#b8410e", accent: "#0a0a0a", dark: false,
    meshA: "#b8410e", meshB: "#a8b88a", meshC: "#faf7ef",
  },
};

const FONT_PRESETS = {
  serif:  { display: "'Instrument Serif', 'Newsreader', Georgia, serif", body: "'Newsreader', Georgia, serif", mono: "'JetBrains Mono', ui-monospace, monospace", arabic: "'Amiri', serif", displayWeight: 400, displayItalic: false, headingLH: 0.92, headingLS: "-0.035em" },
  sans:   { display: "'Geist', ui-sans-serif, system-ui, sans-serif", body: "'Geist', ui-sans-serif, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace", arabic: "'Noto Sans Arabic', sans-serif", displayWeight: 700, displayItalic: false, headingLH: 0.9, headingLS: "-0.05em" },
  hybrid: { display: "'Instrument Serif', 'Newsreader', Georgia, serif", body: "'Geist', ui-sans-serif, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace", arabic: "'Noto Naskh Arabic', serif", displayWeight: 400, displayItalic: true, headingLH: 0.92, headingLS: "-0.03em" },
};

const DENSITY = { compact: 0.84, regular: 1, airy: 1.18 };

// ── helpers ──────────────────────────────────────────────
const t = (n, lang) => (typeof n === "string" ? n : (n?.[lang] ?? n?.en ?? ""));
const isRTL = (lang) => lang === "ar";

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const reveal = () => {
      // Double rAF so the initial (opacity:0, translated) frame paints before transition starts
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    };
    const fallback = setTimeout(reveal, 1200);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { reveal(); io.disconnect(); clearTimeout(fallback); }
    }, { threshold: 0.05, rootMargin: "0px 0px -10% 0px" });
    io.observe(ref.current);
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal(); io.disconnect(); clearTimeout(fallback);
    }
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
  return [ref, shown];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max <= 0 ? 0 : window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function useCounter(target, active, dur = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / dur);
      setV(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, dur]);
  return v;
}

// ── animated mesh gradient background ────────────────────
function MeshBG({ palette }) {
  const [t_, setT_] = useState(0);
  useEffect(() => {
    let raf, s = performance.now();
    const tick = (now) => { setT_((now - s) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const blob = (cx, cy, color, op) => ({
    position: "absolute", width: "60vw", height: "60vw",
    left: `calc(${cx}% - 30vw)`, top: `calc(${cy}% - 30vw)`,
    background: `radial-gradient(circle, ${color}${op} 0%, transparent 60%)`,
    filter: "blur(60px)", pointerEvents: "none",
  });
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
      background: palette.bg, pointerEvents: "none",
    }}>
      <div style={blob(20 + Math.sin(t_ * 0.18) * 12, 18 + Math.cos(t_ * 0.14) * 10, palette.meshA, palette.dark ? "28" : "20")} />
      <div style={blob(80 + Math.sin(t_ * 0.12) * 10, 70 + Math.cos(t_ * 0.16) * 12, palette.meshB, palette.dark ? "22" : "1c")} />
      <div style={blob(50 + Math.cos(t_ * 0.10) * 18, 100 + Math.sin(t_ * 0.12) * 8, palette.meshC, palette.dark ? "30" : "10")} />
      {/* grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
        opacity: palette.dark ? 0.07 : 0.04, mixBlendMode: palette.dark ? "screen" : "multiply",
      }} />
    </div>
  );
}

// ── kinetic split-text reveal ────────────────────────────
function KineticText({ children, delay = 0, stagger = 50, style, className }) {
  const [ref, shown] = useReveal();
  const words = String(children).split(/(\s+)/);
  return (
    <span ref={ref} style={style} className={className}>
      {words.map((w, i) => /\s+/.test(w) ? w : (
        <span key={i} style={{
          display: "inline-block", overflow: "hidden", verticalAlign: "top",
        }}>
          <span style={{
            display: "inline-block",
            transform: shown ? "translateY(0)" : "translateY(110%)",
            opacity: shown ? 1 : 0,
            transition: `transform 900ms cubic-bezier(.2,.7,.18,1) ${delay + i * stagger}ms, opacity 600ms ease ${delay + i * stagger}ms`,
          }}>{w}</span>
        </span>
      ))}
    </span>
  );
}

function Reveal({ children, delay = 0, y = 24, style }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} style={{
      ...style,
      transform: shown ? "translateY(0)" : `translateY(${y}px)`,
      opacity: shown ? 1 : 0,
      transition: `transform 800ms cubic-bezier(.2,.7,.2,1) ${delay}ms, opacity 700ms ease ${delay}ms`,
    }}>{children}</div>
  );
}

// ── marquee ──────────────────────────────────────────────
function Marquee({ items, palette, speed = 60 }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div style={{
      overflow: "hidden", position: "relative",
      padding: "22px 0", borderTop: `0.5px solid ${palette.line}`,
      borderBottom: `0.5px solid ${palette.line}`,
      maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
    }}>
      <div style={{
        display: "inline-flex", gap: 60, whiteSpace: "nowrap",
        animation: `mq ${items.length * speed / 4}s linear infinite`,
      }}>
        {repeated.map((it, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 60,
            font: "italic 36px/1 'Newsreader', serif",
            letterSpacing: "-0.02em", color: palette.fg,
          }}>
            {it}
            <span style={{ width: 8, height: 8, borderRadius: 99, background: palette.warm, opacity: 0.85 }} />
          </span>
        ))}
      </div>
      <style>{`@keyframes mq { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }`}</style>
    </div>
  );
}

// ── nav with scroll progress ─────────────────────────────
function Nav({ palette, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f, { passive: true }); f();
    return () => window.removeEventListener("scroll", f);
  }, []);
  const link = { color: palette.fg, textDecoration: "none", font: "13px var(--body)", opacity: 0.78, fontWeight: 400 };
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "16px 32px",
        background: scrolled ? (palette.dark ? "rgba(10,10,11,0.65)" : "rgba(244,239,227,0.65)") : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        borderBottom: scrolled ? `0.5px solid ${palette.line}` : "0.5px solid transparent",
        transition: "background 220ms, border-color 220ms",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/static/landing/assets/zaytouna-logo.png" alt="Zaytouna"
            style={{ width: 28, height: 28, objectFit: "contain", filter: palette.dark ? "brightness(1.05)" : "none" }} />
          <span style={{ font: "600 16px/1 var(--display)", letterSpacing: "-0.02em", color: palette.fg }}>Zaytouna</span>
          <span style={{ font: "10px var(--mono)", letterSpacing: "0.2em", color: palette.faint, marginLeft: 2 }}>AI</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#manifesto" style={link}>{t(C.nav.philosophy, lang)}</a>
          <a href="#vision" style={link}>{t(C.nav.vision, lang)}</a>
          <a href="#grove" style={link}>{t(C.nav.grove, lang)}</a>
          <a href="#join" style={link}>{t(C.nav.join, lang)}</a>
          <div style={{ display: "flex", padding: 2, borderRadius: 99, border: `0.5px solid ${palette.line}` }}>
            {["en", "ar", "fr"].map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{
                appearance: "none", border: 0,
                background: lang === l ? palette.fg : "transparent",
                color: lang === l ? palette.bg : palette.muted,
                font: "10px var(--mono)", letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "5px 9px", borderRadius: 99, cursor: "pointer",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </nav>
      <div style={{
        position: "fixed", top: 0, left: 0, height: 2, zIndex: 51,
        width: `${progress * 100}%`, background: palette.warm,
        boxShadow: `0 0 12px ${palette.warm}`,
        transition: "width 80ms linear",
      }} />
    </>
  );
}

// ── hero ─────────────────────────────────────────────────
function Hero({ palette, lang, headline, density, onJoin, fontMeta }) {
  const heroT = C.hero.headlines[headline];
  const headlineText = t(heroT, lang);
  const rtl = isRTL(lang);
  return (
    <section style={{
      height: "100vh", overflow: "hidden", position: "relative",
      display: "grid", gridTemplateRows: "auto 1fr auto",
      paddingTop: 72, paddingBottom: 36,
    }}>
      {/* eyebrow row */}
      <div style={{
        display: "flex", justifyContent: "space-between", padding: "24px 40px 0",
        font: "10px var(--mono)", letterSpacing: "0.22em", color: palette.faint, textTransform: "uppercase",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: palette.warm, boxShadow: `0 0 12px ${palette.warm}` }} />
          {t(C.hero.kicker, lang)}
        </span>
        <span>36.806°N · 10.181°E · TUNIS</span>
      </div>

      {/* main two-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: rtl ? "1.05fr 1fr" : "1fr 1.05fr",
        alignItems: "center", gap: 32,
        padding: "0 40px", maxWidth: 1480, width: "100%", margin: "0 auto",
        minHeight: 0, position: "relative",
      }}>
        {/* text column */}
        <div style={{
          gridColumn: rtl ? 2 : 1, direction: rtl ? "rtl" : "ltr",
          textAlign: rtl ? "right" : "left", position: "relative", zIndex: 3,
        }}>
          <Reveal>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24,
              padding: "6px 12px 6px 8px", borderRadius: 99,
              border: `0.5px solid ${palette.line}`, background: palette.surface + "88",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              font: "10px var(--mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: palette.muted,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 99, background: palette.warm,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: palette.dark ? "#1a1108" : palette.bg, fontWeight: 700, fontSize: 10,
              }}>ز</span>
              <span>{t({ en: "Founding chapter · 2026", ar: "الفصل التأسيسي · 2026", fr: "Chapitre fondateur · 2026" }, lang)}</span>
            </div>
          </Reveal>

          <h1 key={`${headline}-${lang}`} style={{
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
            fontWeight: fontMeta.displayWeight,
            fontSize: "clamp(48px, 6.4vw, 110px)",
            lineHeight: fontMeta.headingLH,
            fontStyle: fontMeta.displayItalic ? "italic" : "normal",
            letterSpacing: fontMeta.headingLS, color: palette.fg, margin: 0,
            whiteSpace: "pre-line", textWrap: "balance",
          }}>
            {headlineText.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                <KineticText delay={i * 220} stagger={70}>{line}</KineticText>
              </span>
            ))}
          </h1>

          <Reveal delay={650}>
            <p style={{
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
              fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.55,
              color: palette.muted, maxWidth: 520, margin: "26px 0 0", textWrap: "pretty",
            }}>{t(C.hero.sub, lang)}</p>
          </Reveal>

          <Reveal delay={850}>
            <div style={{
              display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap",
              justifyContent: rtl ? "flex-end" : "flex-start",
            }}>
              <a href="#manifesto" className="z-btn-primary" style={{
                background: palette.fg, color: palette.bg, padding: "13px 22px", borderRadius: 99,
                fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
                fontWeight: 500, fontSize: 13, letterSpacing: "0.01em",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>{t(C.hero.cta_primary, lang)} <span style={{ opacity: 0.5 }}>↗</span></a>
              <a href="#join" onClick={(e) => { e.preventDefault(); onJoin(); }} className="z-btn-ghost" style={{
                background: "transparent", color: palette.fg, padding: "13px 22px", borderRadius: 99,
                fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
                fontWeight: 500, fontSize: 13,
                textDecoration: "none", border: `0.5px solid ${palette.line}`,
              }}>{t(C.hero.cta_secondary, lang)} →</a>
            </div>
          </Reveal>

          {/* tiny stats row */}
          <Reveal delay={1050}>
            <div style={{
              display: "flex", gap: 32, marginTop: 44,
              borderTop: `0.5px solid ${palette.line}`, paddingTop: 18,
              direction: rtl ? "rtl" : "ltr",
            }}>
              {[
                { v: "342", l: t({ en: "Members", ar: "أعضاء", fr: "Membres" }, lang) },
                { v: "14", l: t({ en: "Governorates", ar: "ولاية", fr: "Gouvernorats" }, lang) },
                { v: "6", l: t({ en: "Working groups", ar: "فرق", fr: "Groupes" }, lang) },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "var(--display)", fontWeight: 600, fontSize: 22,
                    color: palette.fg, letterSpacing: "-0.02em",
                  }}>{s.v}</div>
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em",
                    textTransform: "uppercase", color: palette.faint, marginTop: 3,
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* tree column */}
        <div style={{
          gridColumn: rtl ? 1 : 2,
          position: "relative", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          minHeight: 0,
        }}>
          <OliveTree palette={palette} density={density} height={"min(78vh, 720px)"} />
        </div>
      </div>

      {/* bottom indicator */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px",
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em",
        color: palette.faint, textTransform: "uppercase",
      }}>
        <span>{t({ en: "Scroll to read the manifesto", ar: "اسحب لقراءة البيان", fr: "Faites défiler pour lire le manifeste" }, lang)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 0.5, height: 18, background: `linear-gradient(to bottom, ${palette.warm}, transparent)`, animation: "fall 1.8s ease-in-out infinite", display: "inline-block" }} />
          01 / 05
        </span>
      </div>
      <style>{`@keyframes fall { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 100%{transform:scaleY(0);transform-origin:bottom} }`}</style>
    </section>
  );
}

// ── manifesto ────────────────────────────────────────────
function Manifesto({ palette, lang, fontMeta }) {
  return (
    <section id="manifesto" style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "100px 32px 60px", maxWidth: 1280, margin: "0 auto",
      position: "relative", zIndex: 2, width: "100%",
    }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", color: palette.warm }}>§ 01</span>
          <span style={{ width: 28, height: "0.5px", background: palette.line }} />
          <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", textTransform: "uppercase", color: palette.fg }}>{t(C.manifesto.label, lang)}</span>
        </div>
      </Reveal>
      <h2 style={{
        fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
        fontWeight: fontMeta.displayWeight,
        fontSize: "clamp(40px, 5.4vw, 76px)",
        lineHeight: fontMeta.headingLH,
        fontStyle: fontMeta.displayItalic ? "italic" : "normal",
        letterSpacing: fontMeta.headingLS, color: palette.fg,
        margin: "0 0 32px", maxWidth: 980,
        direction: isRTL(lang) ? "rtl" : "ltr",
      }}>
        <KineticText stagger={80}>{t(C.manifesto.title, lang)}</KineticText>
      </h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {C.manifesto.body.map((para, i) => (
          <Reveal key={i} delay={i * 80}>
            <li style={{
              display: "grid", gridTemplateColumns: "72px 1fr", gap: 24,
              padding: "14px 0",
              borderTop: i === 0 ? `0.5px solid ${palette.line}` : "0",
              borderBottom: `0.5px solid ${palette.line}`,
            }}>
              <span style={{ font: "11px var(--mono)", letterSpacing: "0.2em", color: palette.warm, paddingTop: 8 }}>
                {String(i + 1).padStart(2, "0")} / {String(C.manifesto.body.length).padStart(2, "0")}
              </span>
              <p style={{
                fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
                fontWeight: 500, fontSize: "clamp(16px, 1.4vw, 22px)", lineHeight: 1.36,
                color: palette.fg, margin: 0,
                letterSpacing: "-0.012em", textWrap: "pretty",
                direction: isRTL(lang) ? "rtl" : "ltr",
              }}>{t(para, lang)}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

// ── vision ───────────────────────────────────────────────
function Vision({ palette, lang, fontMeta }) {
  return (
    <section id="vision" style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "100px 32px 60px",
      borderTop: `0.5px solid ${palette.line}`, borderBottom: `0.5px solid ${palette.line}`,
      background: palette.dark ? `linear-gradient(180deg, ${palette.bg}cc, ${palette.surface}aa, ${palette.bg}cc)` : `linear-gradient(180deg, ${palette.bg}cc, ${palette.surface}88, ${palette.bg}cc)`,
      position: "relative", zIndex: 2, backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", color: palette.warm }}>§ 02</span>
            <span style={{ width: 28, height: "0.5px", background: palette.line }} />
            <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", textTransform: "uppercase", color: palette.fg }}>{t(C.vision.label, lang)}</span>
          </div>
        </Reveal>
        <h2 style={{
          fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
          fontWeight: fontMeta.displayWeight,
          fontSize: "clamp(40px, 5.4vw, 76px)",
          lineHeight: fontMeta.headingLH,
          fontStyle: fontMeta.displayItalic ? "italic" : "normal",
          letterSpacing: fontMeta.headingLS, color: palette.fg,
          margin: "0 0 28px", whiteSpace: "pre-line",
          direction: isRTL(lang) ? "rtl" : "ltr",
        }}>
          {t(C.vision.title, lang).split("\n").map((ln, i) => (
            <span key={i} style={{ display: "block" }}>
              <KineticText stagger={80} delay={i * 200}>{ln}</KineticText>
            </span>
          ))}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: `0.5px solid ${palette.line}`, borderLeft: `0.5px solid ${palette.line}` }}>
          {C.vision.pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 70} y={32}>
              <div className="vision-card" style={{
                padding: "22px 22px",
                borderRight: `0.5px solid ${palette.line}`,
                borderBottom: `0.5px solid ${palette.line}`,
                direction: isRTL(lang) ? "rtl" : "ltr",
                background: "transparent",
                transition: "background 240ms",
                minHeight: 180,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  fontFamily: "var(--display)", fontWeight: 700,
                  fontSize: "clamp(32px, 3vw, 48px)", lineHeight: 1,
                  color: palette.warm, opacity: 0.95, letterSpacing: "-0.04em",
                  marginBottom: 10,
                }}>{p.n}</div>
                <h3 style={{
                  fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
                  fontWeight: 600, fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.25,
                  color: palette.fg, margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}>{t(p.name, lang)}</h3>
                <p style={{
                  font: "13px/1.5 var(--body)", color: palette.muted, margin: 0, textWrap: "pretty",
                  fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
                }}>{t(p.desc, lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── roles tree (logo + orbital nodes) ────────────────────
function useCursorL(ref) {
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

function RolesTree({ palette, lang, onPick }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const cursor = useCursorL(ref);
  const cx = (cursor.x - 0.5) * 2;
  const cy = (cursor.y - 0.5) * 2;
  const items = C.roles.items.map((r, i) => {
    const angles = [-162, -136, -110, -86, -62, -38, -14, 12, 38, 64];
    const a = (angles[i] * Math.PI) / 180;
    return { ...r, x: Math.cos(a) * 290, y: Math.sin(a) * 260 - 60 };
  });
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "min(72vh, 640px)" }}>
      <img src="/static/landing/assets/zaytouna-logo.png" alt=""
        style={{
          position: "absolute", left: "50%", top: "50%",
          width: "min(380px, 56%)", aspectRatio: "1 / 1", height: "auto", objectFit: "contain",
          transform: `translate(-50%, -50%) translate(${cx * 8}px, ${cy * 6}px)`,
          filter: palette.dark
            ? `drop-shadow(0 24px 50px ${palette.warm}3a) drop-shadow(0 0 14px ${palette.warm}1f) brightness(1.06)`
            : `drop-shadow(0 18px 36px rgba(0,0,0,.14))`,
          transition: "transform 280ms cubic-bezier(.2,.7,.3,1)",
          pointerEvents: "none", userSelect: "none",
        }} />
      <svg viewBox="-360 -360 720 720" width="100%" height="100%"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          {items.map((it, idx) => {
            const seed = (idx * 73) % 100 / 100;
            const ox = (it.x * 0.18) + (seed - 0.5) * 40;
            const oy = -80 + Math.sin(idx * 1.7) * 30;
            return (
              <linearGradient key={`g${it.id}`} id={`branch-${it.id}`}
                gradientUnits="userSpaceOnUse"
                x1={ox} y1={oy} x2={it.x} y2={it.y}>
                <stop offset="0%" stopColor={palette.green} stopOpacity="0" />
                <stop offset="55%" stopColor={palette.green} stopOpacity="0" />
                <stop offset="72%" stopColor={palette.warm} stopOpacity="0.25" />
                <stop offset="88%" stopColor={palette.warm} stopOpacity="0.6" />
                <stop offset="100%" stopColor={palette.warm} stopOpacity="0.95" />
              </linearGradient>
            );
          })}
        </defs>
        {items.map((it, idx) => {
          const isHover = hover === it.id;
          const seed = (idx * 73) % 100 / 100;
          const ox = (it.x * 0.18) + (seed - 0.5) * 40;
          const oy = -80 + Math.sin(idx * 1.7) * 30;
          const c1x = ox + (it.x - ox) * 0.18;
          const c1y = oy + (it.y - oy) * 0.05 + Math.sin(idx * 2.1) * 24;
          const c2x = ox + (it.x - ox) * 0.78;
          const c2y = oy + (it.y - oy) * 0.65 - Math.cos(idx * 1.3) * 18;
          const d = `M ${ox} ${oy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${it.x} ${it.y}`;
          return (
            <path key={`ln${it.id}`} d={d} fill="none"
              stroke={`url(#branch-${it.id})`}
              strokeWidth={1.2}
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1 1"
              strokeDashoffset={isHover ? 0 : 1}
              style={{
                transition: "stroke-dashoffset 720ms cubic-bezier(.4,0,.2,1)",
                pointerEvents: "none",
              }} />
          );
        })}
        {items.map((it) => {
          const isHover = hover === it.id;
          const ease = "cubic-bezier(.4,0,.2,1)";
          return (
            <g key={it.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(it.id)} onMouseLeave={() => setHover(null)}
              onClick={() => onPick(it.id)}>
              {/* invisible larger hit target */}
              <circle cx={it.x} cy={it.y} r={48} fill="transparent" />
              {/* halo */}
              <circle cx={it.x} cy={it.y} r={isHover ? 54 : 36} fill={palette.warm}
                opacity={isHover ? 0.2 : 0}
                style={{ transition: `opacity 500ms ${ease}, r 500ms ${ease}` }} />
              {/* main node */}
              <circle cx={it.x} cy={it.y} r={isHover ? 26 : 22}
                fill={isHover ? palette.warm : palette.bg}
                stroke={isHover ? palette.warm : palette.fg}
                strokeOpacity={isHover ? 1 : 0.32}
                strokeWidth={1}
                style={{ transition: `r 420ms ${ease}, fill 500ms ${ease}, stroke 500ms ${ease}, stroke-opacity 500ms ${ease}` }} />
              <text x={it.x} y={it.y + 6} textAnchor="middle"
                style={{
                  font: "600 16px var(--display)",
                  fill: isHover ? palette.bg : palette.fg,
                  transition: `fill 500ms ${ease}`,
                  pointerEvents: "none",
                }}>{it.glyph}</text>
              {(() => {
                const label = t(it.name, lang);
                const charW = 8.4;
                const w = Math.max(72, label.length * charW + 36);
                const h = 30;
                const ly = it.y + (isHover ? 64 : 58);
                return (
                  <g style={{ transition: `transform 420ms ${ease}`, pointerEvents: "none" }}>
                    <rect
                      x={it.x - w / 2} y={ly - h / 2}
                      width={w} height={h} rx={h / 2}
                      fill={isHover ? palette.warm : palette.bg}
                      stroke={isHover ? palette.warm : palette.fg}
                      strokeOpacity={isHover ? 1 : 0.22}
                      strokeWidth={0.7}
                      style={{ transition: `fill 500ms ${ease}, stroke 500ms ${ease}, stroke-opacity 500ms ${ease}, y 420ms ${ease}` }} />
                    <text x={it.x} y={ly + 4.5} textAnchor="middle"
                      style={{
                        font: "600 13px var(--mono)", letterSpacing: "0.16em", textTransform: "uppercase",
                        fill: isHover ? palette.bg : palette.fg,
                        opacity: isHover ? 1 : 0.78,
                        transition: `fill 500ms ${ease}, opacity 500ms ${ease}, y 420ms ${ease}`,
                      }}>{label}</text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>
      {hover && (() => {
        const it = items.find(i => i.id === hover);
        return (
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            maxWidth: 480, textAlign: "center",
            font: "13px/1.55 var(--body)", color: palette.muted,
            background: palette.surface + "ee", padding: "10px 18px", borderRadius: 12,
            border: `0.5px solid ${palette.line}`,
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            direction: isRTL(lang) ? "rtl" : "ltr",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          }}>{t(it.desc, lang)}</div>
        );
      })()}
    </div>
  );
}

function Roles({ palette, lang, onPick, fontMeta }) {
  return (
    <section id="join" style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "100px 32px 60px", maxWidth: 1280, margin: "0 auto",
      position: "relative", zIndex: 2, width: "100%",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.9fr) 1.4fr", gap: 48, alignItems: "center" }}>
        <div>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", color: palette.warm }}>§ 03</span>
              <span style={{ width: 28, height: "0.5px", background: palette.line }} />
              <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", textTransform: "uppercase", color: palette.fg }}>{t(C.roles.label, lang)}</span>
            </div>
          </Reveal>
          <h2 style={{
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
            fontWeight: fontMeta.displayWeight,
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: fontMeta.headingLH,
            fontStyle: fontMeta.displayItalic ? "italic" : "normal",
            letterSpacing: fontMeta.headingLS, color: palette.fg,
            margin: "0 0 16px", whiteSpace: "pre-line",
            direction: isRTL(lang) ? "rtl" : "ltr",
          }}>
            {t(C.roles.title, lang).split("\n").map((ln, i) => (
              <span key={i} style={{ display: "block" }}>
                <KineticText stagger={80} delay={i * 200}>{ln}</KineticText>
              </span>
            ))}
          </h2>
          <Reveal delay={400}>
            <p style={{
              font: "15px/1.55 var(--body)", color: palette.muted, maxWidth: 460, margin: 0,
              direction: isRTL(lang) ? "rtl" : "ltr",
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            }}>{t(C.roles.sub, lang)}</p>
          </Reveal>
        </div>
        <Reveal delay={500}>
          <RolesTree palette={palette} lang={lang} onPick={onPick} />
        </Reveal>
      </div>
    </section>
  );
}

// ── grove ────────────────────────────────────────────────
function Counter({ to, label, palette, suffix = "", fontMeta }) {
  const [ref, shown] = useReveal();
  const v = useCounter(to, shown);
  return (
    <div ref={ref}>
      <div style={{
        fontFamily: "var(--display)",
        fontWeight: fontMeta?.displayWeight || 700,
        fontSize: "clamp(40px, 4.4vw, 68px)",
        lineHeight: 0.95,
        fontStyle: fontMeta?.displayItalic ? "italic" : "normal",
        letterSpacing: "-0.04em",
        color: palette.fg, fontVariantNumeric: "tabular-nums",
      }}>{v}{suffix}</div>
      <div style={{ font: "10px var(--mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: palette.muted, marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

function Grove({ palette, lang, fontMeta }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? C.grove.members : C.grove.members.filter(m => m.role === filter);
  return (
    <section id="grove" style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "100px 32px 60px",
      borderTop: `0.5px solid ${palette.line}`, borderBottom: `0.5px solid ${palette.line}`,
      position: "relative", zIndex: 2,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", color: palette.warm }}>§ 04</span>
            <span style={{ width: 28, height: "0.5px", background: palette.line }} />
            <span style={{ font: "11px var(--mono)", letterSpacing: "0.22em", textTransform: "uppercase", color: palette.fg }}>{t(C.grove.label, lang)}</span>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "end", marginBottom: 22 }}>
          <h2 style={{
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
            fontWeight: fontMeta.displayWeight,
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: fontMeta.headingLH,
            fontStyle: fontMeta.displayItalic ? "italic" : "normal",
            letterSpacing: fontMeta.headingLS, color: palette.fg,
            margin: 0, whiteSpace: "pre-line",
            direction: isRTL(lang) ? "rtl" : "ltr",
          }}>
            {t(C.grove.title, lang).split("\n").map((ln, i) => (
              <span key={i} style={{ display: "block" }}>
                <KineticText stagger={80} delay={i * 200}>{ln}</KineticText>
              </span>
            ))}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingBottom: 4 }}>
            <Counter to={342} label={t({en:"Members",ar:"أعضاء",fr:"Membres"}, lang)} palette={palette} fontMeta={fontMeta} />
            <Counter to={14} label={t({en:"Governorates",ar:"ولايات",fr:"Gouvernorats"}, lang)} palette={palette} fontMeta={fontMeta} />
            <Counter to={6} label={t({en:"Working groups",ar:"فرق عمل",fr:"Groupes"}, lang)} palette={palette} fontMeta={fontMeta} />
          </div>
        </div>
        <Reveal>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {[{ id: "all", name: { en: "All", ar: "الكل", fr: "Tous" } }, ...C.roles.items].map((r) => (
              <button key={r.id} onClick={() => setFilter(r.id)} style={{
                appearance: "none", border: `0.5px solid ${filter === r.id ? palette.fg : palette.line}`,
                background: filter === r.id ? palette.fg : "transparent",
                color: filter === r.id ? palette.bg : palette.muted,
                padding: "6px 11px", borderRadius: 99, cursor: "pointer",
                font: "10px var(--mono)", letterSpacing: "0.14em", textTransform: "uppercase",
                transition: "all 180ms",
              }}>{t(r.name, lang)}</button>
            ))}
          </div>
        </Reveal>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 0, borderTop: `0.5px solid ${palette.line}`, borderLeft: `0.5px solid ${palette.line}`,
          maxHeight: "38vh", overflow: "hidden",
        }}>
          {filtered.slice(0, 8).map((m, i) => {
            const role = C.roles.items.find(r => r.id === m.role);
            return (
              <Reveal key={i} delay={i * 30} y={16}>
                <div className="grove-card" style={{
                  padding: "16px 16px",
                  borderRight: `0.5px solid ${palette.line}`,
                  borderBottom: `0.5px solid ${palette.line}`,
                  position: "relative", overflow: "hidden",
                  transition: "background 220ms",
                  height: "100%",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 99, background: palette.surface,
                    border: `0.5px solid ${palette.line}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    font: "600 14px var(--display)", color: palette.fg, marginBottom: 10,
                    letterSpacing: "-0.01em",
                  }}>{m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                  <div style={{ font: "500 14px var(--display)", color: palette.fg, marginBottom: 3, letterSpacing: "-0.01em" }}>{m.name}</div>
                  <div style={{ font: "9px var(--mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: palette.warm, marginBottom: 6 }}>
                    {t(role?.name || { en: m.role }, lang)} · {m.city}
                  </div>
                  <div style={{
                    font: "11px/1.45 var(--body)", color: palette.muted,
                    direction: isRTL(lang) ? "rtl" : "ltr",
                    fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>{t(m.bio, lang)}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA + footer ─────────────────────────────────────────
function CTAFooter({ palette, lang, onJoin, fontMeta }) {
  return (
    <section style={{
      height: "100vh", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "120px 32px 36px", textAlign: "center",
      position: "relative", zIndex: 2,
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h2 style={{
          fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
          fontWeight: fontMeta.displayWeight,
          fontSize: "clamp(64px, 11vw, 180px)",
          lineHeight: 0.92,
          fontStyle: fontMeta.displayItalic ? "italic" : "normal",
          letterSpacing: "-0.05em", color: palette.fg,
          margin: "0 auto 24px", whiteSpace: "pre-line", maxWidth: 1280,
          direction: isRTL(lang) ? "rtl" : "ltr",
        }}>
          {t(C.cta.title, lang).split("\n").map((ln, i) => (
            <span key={i} style={{ display: "block" }}>
              <KineticText stagger={80} delay={i * 200}>{ln}</KineticText>
            </span>
          ))}
        </h2>
        <Reveal delay={500}>
          <p style={{
            font: "16px/1.55 var(--body)", color: palette.muted, maxWidth: 540, margin: "0 auto 28px",
            direction: isRTL(lang) ? "rtl" : "ltr",
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
          }}>{t(C.cta.sub, lang)}</p>
        </Reveal>
        <Reveal delay={650}>
          <button onClick={onJoin} className="z-btn-cta" style={{
            appearance: "none", border: 0, background: palette.warm,
            color: palette.dark ? "#1a1108" : palette.bg,
            padding: "16px 32px", borderRadius: 99, cursor: "pointer",
            font: "600 14px var(--body)", letterSpacing: "0.01em",
            fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            boxShadow: `0 10px 40px ${palette.warm}55`,
            transition: "transform 200ms ease, box-shadow 200ms ease",
          }}>{t(C.cta.button, lang)}</button>
        </Reveal>
      </div>
      <footer style={{
        paddingTop: 28, borderTop: `0.5px solid ${palette.line}`,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        font: "10px var(--mono)", letterSpacing: "0.14em", color: palette.faint, textTransform: "uppercase",
      }}>
        <span>zaytouna.ai · {t(C.footer.address, lang)}</span>
        <span>{t(C.footer.rights, lang)}</span>
        <span>© 2026 — Zaytouna Foundation</span>
      </footer>
    </section>
  );
}

// ── join modal ───────────────────────────────────────────
function JoinModal({ palette, lang, roleId, onClose }) {
  const role = C.roles.items.find(r => r.id === roleId);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", city: "", why: "" });
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!role) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: palette.dark ? "rgba(0,0,0,0.7)" : "rgba(20,18,12,0.5)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fade 200ms ease both",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 540, background: palette.bg,
        border: `0.5px solid ${palette.line}`, borderRadius: 20, padding: 36,
        position: "relative", direction: isRTL(lang) ? "rtl" : "ltr",
        animation: "pop 280ms cubic-bezier(.2,.8,.2,1) both",
        boxShadow: `0 30px 80px ${palette.dark ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.18)"}`,
      }}>
        <button onClick={onClose} aria-label="close" style={{
          position: "absolute", top: 16, right: 16, appearance: "none", border: 0,
          background: "transparent", color: palette.muted, font: "18px var(--body)",
          cursor: "pointer", width: 32, height: 32, borderRadius: 99,
        }}>×</button>
        {!submitted ? (
          <>
            <span style={{ font: "11px var(--mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: palette.muted }}>{t(C.modal.title_prefix, lang)}</span>
            <h3 style={{
              font: "700 44px/1.02 var(--display)", letterSpacing: "-0.03em", color: palette.fg,
              margin: "10px 0 22px",
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
            }}>{t(role.name, lang)}</h3>
            <p style={{
              font: "14px/1.55 var(--body)", color: palette.muted, margin: "0 0 26px",
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            }}>{t(role.desc, lang)}</p>
            <div style={{ display: "grid", gap: 14 }}>
              {[["name", t(C.modal.name, lang)], ["email", t(C.modal.email, lang)], ["city", t(C.modal.city, lang)]].map(([k, label]) => (
                <label key={k} style={{ display: "block" }}>
                  <span style={{ font: "10px var(--mono)", letterSpacing: "0.16em", textTransform: "uppercase", color: palette.faint }}>{label}</span>
                  <input value={form[k]} onChange={(e) => setForm(f => ({ ...f, [k]: e.target.value }))}
                    style={{
                      width: "100%", marginTop: 5, padding: "11px 14px", borderRadius: 10,
                      border: `0.5px solid ${palette.line}`, background: palette.surface,
                      color: palette.fg, font: "14px var(--body)", outline: "none",
                    }} />
                </label>
              ))}
              <label>
                <span style={{ font: "10px var(--mono)", letterSpacing: "0.16em", textTransform: "uppercase", color: palette.faint }}>{t(C.modal.why, lang)}</span>
                <textarea value={form.why} onChange={(e) => setForm(f => ({ ...f, why: e.target.value }))}
                  rows={3} style={{
                    width: "100%", marginTop: 5, padding: "11px 14px", borderRadius: 10,
                    border: `0.5px solid ${palette.line}`, background: palette.surface,
                    color: palette.fg, font: "14px/1.45 var(--body)", outline: "none", resize: "vertical",
                  }} />
              </label>
            </div>
            <button onClick={() => setSubmitted(true)} style={{
              marginTop: 22, width: "100%", appearance: "none", border: 0,
              background: palette.fg, color: palette.bg, padding: "14px 20px",
              borderRadius: 99, font: "600 14px var(--body)", cursor: "pointer",
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            }}>{t(C.modal.submit, lang)}</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <img src="/static/landing/assets/zaytouna-logo.png" alt="" width="72" height="72"
              style={{ margin: "0 auto 18px", display: "block", objectFit: "contain" }} />
            <h3 style={{
              font: "700 36px/1.05 var(--display)", letterSpacing: "-0.02em", color: palette.fg, margin: "0 0 10px",
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--display)",
            }}>{t(C.modal.submitted_t, lang)}</h3>
            <p style={{
              font: "14px/1.55 var(--body)", color: palette.muted,
              fontFamily: lang === "ar" ? "var(--arabic)" : "var(--body)",
            }}>{t(C.modal.submitted_b, lang)}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop  { from { opacity: 0; transform: translateY(20px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ink",
  "headline": "rooted",
  "lang": "en",
  "fonts": "sans",
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t_, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t_.palette] || PALETTES.ink;
  const fonts = FONT_PRESETS[t_.fonts] || FONT_PRESETS.sans;
  const lang = t_.lang;
  const [modalRole, setModalRole] = useState(null);

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--display", fonts.display);
    r.setProperty("--body", fonts.body);
    r.setProperty("--mono", fonts.mono);
    r.setProperty("--arabic", fonts.arabic);
    r.setProperty("--bg", palette.bg);
    r.setProperty("--fg", palette.fg);
    document.body.style.background = palette.bg;
    document.body.style.color = palette.fg;
  }, [palette, fonts]);

  const marqueeWords = lang === "ar"
    ? ["سيادة", "دارجة", "مفتوح", "تونس", "حركة", "غابة", "صبر", "جذور"]
    : lang === "fr"
    ? ["souveraineté", "darija", "ouvert", "Tunisie", "mouvement", "bosquet", "patience", "racines"]
    : ["sovereignty", "darija", "open weights", "Tunisia", "movement", "the grove", "patience", "roots"];

  return (
    <div style={{ color: palette.fg, minHeight: "100vh", position: "relative" }}>
      <MeshBG palette={palette} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav palette={palette} lang={lang} setLang={(l) => setTweak("lang", l)} />
        <Hero palette={palette} lang={lang} headline={t_.headline} density={t_.density} fontMeta={fonts}
              onJoin={() => setModalRole("researcher")} />
        <Marquee items={marqueeWords} palette={palette} />
        <Manifesto palette={palette} lang={lang} fontMeta={fonts} />
        <Vision palette={palette} lang={lang} fontMeta={fonts} />
        <Roles palette={palette} lang={lang} fontMeta={fonts} onPick={(id) => setModalRole(id)} />
        <Grove palette={palette} lang={lang} fontMeta={fonts} />
        <CTAFooter palette={palette} lang={lang} fontMeta={fonts} onJoin={() => setModalRole("researcher")} />
      </div>
      {modalRole && <JoinModal palette={palette} lang={lang} roleId={modalRole} onClose={() => setModalRole(null)} />}

      <TweaksPanel>
        <TweakSection label="Visual" />
        <TweakSelect label="Palette" value={t_.palette}
          options={[
            { value: "ink", label: "Ink · dark" },
            { value: "bone", label: "Bone · light" },
            { value: "terra", label: "Terra · warm dark" },
            { value: "paper", label: "Paper · light" },
          ]}
          onChange={(v) => setTweak("palette", v)} />
        <TweakRadio label="Type" value={t_.fonts}
          options={["serif", "sans", "hybrid"]}
          onChange={(v) => setTweak("fonts", v)} />
        <TweakRadio label="Density" value={t_.density}
          options={["compact", "regular", "airy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Content" />
        <TweakSelect label="Headline" value={t_.headline}
          options={[
            { value: "rooted", label: "Rooted in Tunisia…" },
            { value: "build", label: "We are building Tunisia's AI" },
            { value: "darija", label: "We're not waiting (Darija)" },
          ]}
          onChange={(v) => setTweak("headline", v)} />
        <TweakRadio label="Language" value={t_.lang}
          options={["en", "ar", "fr"]}
          onChange={(v) => setTweak("lang", v)} />
      </TweaksPanel>

      <style>{`
        .vision-card:hover { background: ${palette.dark ? "rgba(212,165,116,0.04)" : "rgba(184,65,14,0.03)"} }
        .grove-card:hover { background: ${palette.dark ? "rgba(212,165,116,0.05)" : "rgba(184,65,14,0.04)"} }
        .z-btn-primary { transition: transform 200ms ease, box-shadow 200ms ease }
        .z-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 30px ${palette.dark ? "rgba(240,235,222,0.18)" : "rgba(0,0,0,0.18)"} }
        .z-btn-ghost { transition: background 180ms ease, border-color 180ms ease }
        .z-btn-ghost:hover { background: ${palette.dark ? "rgba(240,235,222,0.06)" : "rgba(0,0,0,0.05)"}; border-color: ${palette.fg} !important }
        .z-btn-cta { transition: transform 200ms ease, box-shadow 200ms ease }
        .z-btn-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 50px ${palette.warm}77 }
      `}</style>
    </div>
  );
}

window.App = App;
