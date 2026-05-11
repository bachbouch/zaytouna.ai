// ── Zaytouna AI landing — vanilla JS ─────────────────────

document.addEventListener("DOMContentLoaded", () => {
  initScroll();
  initKinetic();
  initReveal();
  initCounters();
  initTreeParallax();
  initOliveFX();
  initRoleNodes();
  initRoleFilter();
  initModal();
  initDraftBanner();
});

// ── scroll progress + sticky nav ─────────────────────────
function initScroll() {
  const bar = document.querySelector(".scroll-progress");
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max <= 0 ? 0 : window.scrollY / max;
    if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ── kinetic text — split into per-word spans ─────────────
function initKinetic() {
  document.querySelectorAll("[data-kinetic]").forEach((el) => {
    const html = el.innerHTML;
    el.innerHTML = "";
    el.classList.add("kinetic");
    const stagger = parseInt(el.dataset.stagger || "60", 10);
    // Atoms: HTML tags (<...>), whitespace runs, or text fragments. Tags stay whole.
    const atoms = html.split(/(<[^>]+>|\s+)/).filter(Boolean);
    let wordBuf = "";
    let i = 0;
    const flush = () => {
      if (!wordBuf) return;
      const wrap = document.createElement("span");
      wrap.className = "kinetic-word";
      const inner = document.createElement("span");
      inner.innerHTML = wordBuf;
      inner.style.transitionDelay = (i * stagger) + "ms";
      wrap.appendChild(inner);
      el.appendChild(wrap);
      i++;
      wordBuf = "";
    };
    for (const atom of atoms) {
      if (/^\s+$/.test(atom)) {
        flush();
        el.appendChild(document.createTextNode(atom));
      } else {
        // tag or text fragment — accumulate into current word
        wordBuf += atom;
      }
    }
    flush();
  });
}

// ── intersection-observer reveal (.reveal + .kinetic) ────
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => e.target.classList.add("shown"))
        );
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal, .kinetic").forEach((el) => io.observe(el));
}

// ── counters animate on view ─────────────────────────────
function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count || "0", 10);
      const dur = 1400;
      const start = performance.now();
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * ease(p));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
}

// ── tree cursor parallax ─────────────────────────────────
function initTreeParallax() {
  document.querySelectorAll(".olive-stage, .roles-stage").forEach((stage) => {
    const img = stage.querySelector(".olive-img, .roles-logo");
    const rings = stage.querySelector(".olive-rings");
    if (!img) return;
    stage.addEventListener("mousemove", (e) => {
      const r = stage.getBoundingClientRect();
      const cx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const cy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      img.style.setProperty("--tx", (cx * 8).toFixed(2) + "px");
      img.style.setProperty("--ty", (cy * 6).toFixed(2) + "px");
      img.style.setProperty("--rx", (-cy * 3).toFixed(2) + "deg");
      img.style.setProperty("--ry", (cx * 4).toFixed(2) + "deg");
      if (img.classList.contains("olive-img")) {
        img.style.transform =
          `rotateY(${cx * 4}deg) rotateX(${-cy * 3}deg) translate(${cx * 8}px, ${cy * 6}px)`;
      } else {
        img.style.transform =
          `translate(-50%, -50%) translate(${cx * 8}px, ${cy * 6}px)`;
      }
      if (rings) rings.style.transform = `translate(${cx * 4}px, ${cy * 3}px)`;
    });
    stage.addEventListener("mouseleave", () => {
      img.style.transform = img.classList.contains("roles-logo")
        ? "translate(-50%, -50%)"
        : "";
      if (rings) rings.style.transform = "";
    });
  });
}

// ── draft banner dismiss ─────────────────────────────────
function initDraftBanner() {
  const banner = document.querySelector(".draft-banner");
  if (!banner) return;
  const close = banner.querySelector(".draft-close");
  if (!close) return;
  close.addEventListener("click", () => {
    banner.classList.add("hidden");
    document.body.classList.add("banner-dismissed");
  });
}

// ── olive tree FX: circuit pulses + drifting particles ───
function initOliveFX() {
  const svg = document.querySelector(".olive-fx");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";

  // Stylized circuit-root traces (same coordinates as the React design)
  const TRACES = [
    [[-10, 60], [-50, 70], [-90, 80], [-130, 95], [-170, 115], [-200, 140]],
    [[-10, 70], [-40, 90], [-70, 120], [-95, 150], [-120, 180]],
    [[-5, 75], [-15, 110], [-25, 145], [-35, 180], [-45, 215]],
    [[0, 70], [0, 105], [5, 145], [-5, 185], [0, 220]],
    [[5, 70], [15, 110], [25, 145], [20, 180], [25, 215]],
    [[10, 60], [50, 70], [90, 80], [130, 95], [170, 115], [200, 140]],
    [[10, 70], [40, 90], [70, 120], [95, 150], [120, 180]],
    [[5, 75], [15, 110], [25, 145], [35, 180], [45, 215]],
  ];

  const traceLayer = document.createElementNS(NS, "g");
  const tipLayer = document.createElementNS(NS, "g");
  const pulseLayer = document.createElementNS(NS, "g");
  const particleLayer = document.createElementNS(NS, "g");

  // underlay paths + endpoint tips + pulse pairs
  const pulseGroups = [];
  TRACES.forEach((pts) => {
    const path = document.createElementNS(NS, "path");
    const d = pts.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
    path.setAttribute("d", d);
    path.setAttribute("class", "trace");
    traceLayer.appendChild(path);

    const tip = pts[pts.length - 1];
    const tipDot = document.createElementNS(NS, "circle");
    tipDot.setAttribute("cx", tip[0]);
    tipDot.setAttribute("cy", tip[1]);
    tipDot.setAttribute("r", 2.2);
    tipDot.setAttribute("class", "tip");
    tipLayer.appendChild(tipDot);

    const g = document.createElementNS(NS, "g");
    const halo = document.createElementNS(NS, "circle");
    halo.setAttribute("r", 6);
    halo.setAttribute("class", "pulse-halo");
    const core = document.createElementNS(NS, "circle");
    core.setAttribute("r", 2.4);
    core.setAttribute("class", "pulse-core");
    g.appendChild(halo);
    g.appendChild(core);
    pulseLayer.appendChild(g);
    pulseGroups.push({ halo, core, g });
  });

  // particles: 28 seeded leaves/sparks orbiting the canopy
  const PARTICLE_COUNT = 28;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const seed = {
      i,
      radius: 200 + (i * 41) % 160,
      speed: 0.05 + ((i * 13) % 7) * 0.012,
      phase: (i * 1.317) % (Math.PI * 2),
      size: 1.6 + ((i * 7) % 30) / 10,
      kind: i % 4 === 0 ? "spark" : "leaf",
      wobble: 7 + (i % 4) * 3,
    };
    let el;
    if (seed.kind === "spark") {
      el = document.createElementNS(NS, "circle");
      el.setAttribute("r", seed.size * 0.5);
      el.setAttribute("class", "spark");
    } else {
      el = document.createElementNS(NS, "ellipse");
      el.setAttribute("rx", seed.size * 2.4);
      el.setAttribute("ry", seed.size * 0.75);
      el.setAttribute("class", "leaf");
    }
    particleLayer.appendChild(el);
    particles.push({ seed, el });
  }

  svg.appendChild(traceLayer);
  svg.appendChild(tipLayer);
  svg.appendChild(pulseLayer);
  svg.appendChild(particleLayer);

  // rAF loop
  const start = performance.now();
  let rafId;
  const tick = (now) => {
    const t = (now - start) / 1000;

    // pulses travel along each trace; intensity follows a sine wave
    TRACES.forEach((pts, i) => {
      const len = pts.length - 1;
      const speed = 0.45 + (i % 3) * 0.12;
      const phase = ((t * speed + i * 0.18) % 1 + 1) % 1;
      const idx = phase * len;
      const k = Math.min(Math.max(0, Math.floor(idx)), len - 1);
      const f = idx - k;
      const a = pts[k];
      const b = pts[Math.min(k + 1, pts.length - 1)];
      const x = a[0] + (b[0] - a[0]) * f;
      const y = a[1] + (b[1] - a[1]) * f;
      const intensity = Math.sin(phase * Math.PI);
      const pg = pulseGroups[i];
      pg.g.setAttribute("transform", `translate(${x} ${y})`);
      pg.halo.setAttribute("opacity", 0.18 * intensity);
      pg.core.setAttribute("opacity", 0.95 * intensity);
    });

    // endpoint tips twinkle
    Array.from(tipLayer.children).forEach((tip, i) => {
      const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.6 + i));
      tip.setAttribute("opacity", tw * 0.9);
    });

    // drifting particles
    particles.forEach(({ seed, el }) => {
      const a = seed.phase + t * seed.speed;
      const x = Math.cos(a) * seed.radius + Math.sin(t * 0.6 + seed.phase) * seed.wobble;
      const y = Math.sin(a) * seed.radius * 0.55 - 140 + Math.cos(t * 0.7 + seed.phase) * seed.wobble;
      const op = 0.18 + 0.22 * (1 + Math.sin(t * 1.2 + seed.phase));
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
      if (seed.kind === "leaf") {
        el.setAttribute("transform", `rotate(${(a * 180) / Math.PI} ${x} ${y})`);
      }
      el.setAttribute("opacity", op);
    });

    rafId = requestAnimationFrame(tick);
  };

  // pause when tab hidden to save battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(tick);
  });
  rafId = requestAnimationFrame(tick);
}

// ── roles tree node interactions ─────────────────────────
function initRoleNodes() {
  const desc = document.querySelector(".role-desc");
  document.querySelectorAll(".role-node").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      if (desc) {
        desc.textContent = node.dataset.desc || "";
        desc.classList.add("shown");
      }
    });
    node.addEventListener("mouseleave", () => {
      if (desc) desc.classList.remove("shown");
    });
    node.addEventListener("click", () => openModal(node.dataset.id, node.dataset.name, node.dataset.desc));
  });
}

// ── role filter chips ────────────────────────────────────
function initRoleFilter() {
  const buttons = document.querySelectorAll(".role-filters button");
  const cards = document.querySelectorAll(".member");
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      cards.forEach((c) => c.classList.toggle("hidden", f !== "all" && c.dataset.role !== f));
    })
  );
}

// ── join flow (Typeform-style multi-step) ────────────────
function openModal(preselectRoleId) {
  const dlg = document.getElementById("join-modal");
  if (!dlg) return;
  if (!dlg.dataset.initialized) {
    bootJoinFlow(dlg);
    dlg.dataset.initialized = "1";
  }
  joinGoTo(dlg, 1);
  if (preselectRoleId) dlg._pendingRole = preselectRoleId;
  dlg.showModal();
}

function initModal() {
  const dlg = document.getElementById("join-modal");
  if (!dlg) return;
  document.querySelectorAll("[data-join]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    })
  );
  dlg.querySelector(".flow-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    // click on backdrop only — not on inner stage
    if (e.target === dlg) dlg.close();
  });
}

const FLOW_TOTAL = 4;

function bootJoinFlow(dlg) {
  const state = (dlg._state = {
    first_name: "", last_name: "",
    role: null, other_role: "",
    helps_with: new Set(),
    city: "", email: "", password: "",
  });
  dlg._total = FLOW_TOTAL;

  // Load roles + help items in parallel
  const lang = dlg.dataset.lang === "ar-TN" ? "ar-TN" : "en";
  fetch(`${dlg.dataset.rolesUrl}?lang=${encodeURIComponent(lang)}`)
    .then((r) => r.json())
    .then((d) => renderRoles(dlg, d.roles || []))
    .catch(() => renderRoles(dlg, []));
  fetch(`${dlg.dataset.helpUrl}?lang=${encodeURIComponent(lang)}`)
    .then((r) => r.json())
    .then((d) => renderHelp(dlg, d.items || []))
    .catch(() => renderHelp(dlg, []));

  // Step nav buttons
  dlg.querySelectorAll(".flow-next").forEach((btn) =>
    btn.addEventListener("click", () => onNext(dlg))
  );
  dlg.querySelectorAll(".flow-back").forEach((btn) =>
    btn.addEventListener("click", () => onBack(dlg))
  );
  dlg.querySelector(".flow-submit").addEventListener("click", () => onSubmit(dlg));
  dlg.querySelector(".flow-close-success")?.addEventListener("click", () => dlg.close());

  // Keyboard: Enter on text inputs advances
  dlg.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const stepEl = inp.closest(".flow-step");
      if (!stepEl) return;
      const step = parseInt(stepEl.dataset.step, 10);
      e.preventDefault();
      if (step === FLOW_TOTAL) onSubmit(dlg);
      else onNext(dlg);
    });
  });

  // Track field changes
  bindInput(dlg, 'input[name="first_name"]', "first_name");
  bindInput(dlg, 'input[name="last_name"]', "last_name");
  bindInput(dlg, 'input[name="other_role"]', "other_role");
  bindInput(dlg, 'input[name="city"]', "city");
  bindInput(dlg, 'input[name="email"]', "email");
  bindInput(dlg, 'input[name="password"]', "password");
}

function bindInput(dlg, sel, key) {
  const el = dlg.querySelector(sel);
  if (!el) return;
  el.addEventListener("input", () => { dlg._state[key] = el.value; });
}

function renderRoles(dlg, roles) {
  const wrap = dlg.querySelector(".role-cards");
  wrap.innerHTML = "";
  roles.forEach((r) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "role-card";
    card.dataset.slug = r.slug;
    card.innerHTML = `<span class="glyph">${r.glyph || ""}</span><span class="label">${r.name}</span>`;
    card.addEventListener("click", () => selectRole(dlg, r.slug));
    wrap.appendChild(card);
  });
  // "Other" card
  const otherLabel = dlg.dataset.otherLabel || "Other";
  const otherCard = document.createElement("button");
  otherCard.type = "button";
  otherCard.className = "role-card role-card-other";
  otherCard.dataset.slug = "other";
  otherCard.innerHTML = `<span class="glyph">+</span><span class="label">${otherLabel}</span>`;
  otherCard.addEventListener("click", () => selectRole(dlg, "other"));
  wrap.appendChild(otherCard);

  // Apply pending preselect if any
  if (dlg._pendingRole) {
    selectRole(dlg, dlg._pendingRole);
    dlg._pendingRole = null;
  }
}

function selectRole(dlg, slug) {
  dlg._state.role = slug;
  dlg.querySelectorAll(".role-card").forEach((c) =>
    c.classList.toggle("selected", c.dataset.slug === slug)
  );
  const otherWrap = dlg.querySelector(".other-role-wrap");
  if (otherWrap) otherWrap.hidden = slug !== "other";
  if (slug === "other") {
    setTimeout(() => otherWrap.querySelector("input")?.focus(), 50);
  }
}

function renderHelp(dlg, items) {
  const wrap = dlg.querySelector(".help-cards");
  wrap.innerHTML = "";
  items.forEach((h) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "help-card";
    card.dataset.slug = h.slug;
    card.innerHTML = `<span class="help-check"></span><span class="label">${h.label}</span>`;
    card.addEventListener("click", () => toggleHelp(dlg, h.slug, card));
    wrap.appendChild(card);
  });
}

function toggleHelp(dlg, slug, card) {
  const set = dlg._state.helps_with;
  if (set.has(slug)) { set.delete(slug); card.classList.remove("selected"); }
  else { set.add(slug); card.classList.add("selected"); }
}

function joinGoTo(dlg, step) {
  dlg._step = step;
  const total = dlg._total || FLOW_TOTAL;
  // progress
  const pct = Math.min(100, (step / total) * 100);
  const bar = dlg.querySelector(".flow-progress-bar");
  if (bar) bar.style.width = pct.toFixed(1) + "%";
  // step meta
  const num = dlg.querySelector(".flow-step-num");
  const tot = dlg.querySelector(".flow-step-total");
  if (num) num.textContent = String(Math.min(step, total)).padStart(2, "0");
  if (tot) tot.textContent = String(total).padStart(2, "0");
  // swap visible step
  const current = dlg.querySelector(".flow-step.active");
  const target = dlg.querySelector(`.flow-step[data-step="${step}"]`);
  if (current === target) return;
  if (current) {
    current.classList.remove("active");
  }
  if (target) {
    target.classList.add("active");
    // focus first input
    setTimeout(() => {
      const inp = target.querySelector("input:not([type=hidden])");
      inp?.focus();
    }, 60);
  }
  // hide error
  dlg.querySelectorAll(".flow-error").forEach((e) => (e.hidden = true));
}

function validateStep(dlg, step) {
  const s = dlg._state;
  if (step === 1) {
    if (!s.first_name.trim() || !s.last_name.trim()) {
      return "Please enter your first and last name.";
    }
  } else if (step === 2) {
    if (!s.role) return "Pick a branch — or write your own.";
    if (s.role === "other" && !s.other_role.trim()) return "Describe yourself in a few words.";
  } else if (step === 3) {
    // help is optional
  } else if (step === 4) {
    if (!s.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) {
      return "Enter a valid email address.";
    }
    if (s.password.length < 8) return "Password must be at least 8 characters.";
  }
  return null;
}

function showError(dlg, step, msg) {
  const stepEl = dlg.querySelector(`.flow-step[data-step="${step}"]`);
  const err = stepEl?.querySelector(".flow-error");
  if (!err) return;
  err.textContent = msg;
  err.hidden = false;
}

function onNext(dlg) {
  const step = dlg._step;
  const err = validateStep(dlg, step);
  if (err) { showError(dlg, step, err); return; }
  joinGoTo(dlg, step + 1);
}

function onBack(dlg) {
  if (dlg._step > 1) joinGoTo(dlg, dlg._step - 1);
}

function onSubmit(dlg) {
  const err = validateStep(dlg, 4);
  if (err) { showError(dlg, 4, err); return; }
  const btn = dlg.querySelector(".flow-submit");
  btn.disabled = true;
  const s = dlg._state;
  const payload = {
    first_name: s.first_name,
    last_name: s.last_name,
    role: s.role,
    other_role: s.role === "other" ? s.other_role : "",
    helps_with: Array.from(s.helps_with),
    city: s.city,
    email: s.email,
    password: s.password,
  };
  fetch(dlg.dataset.joinUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || "Server error");
      joinGoTo(dlg, 5);
    })
    .catch((e) => {
      showError(dlg, 4, e.message || "Something went wrong.");
    })
    .finally(() => { btn.disabled = false; });
}
