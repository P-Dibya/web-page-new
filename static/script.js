
# ============================================================
# FILE: script.js
# Cyber Automation Engineer — Vanilla JavaScript
# ============================================================

js_content = r"""/**
 * ═══════════════════════════════════════════════════════════
 *  CYBER AUTOMATION ENGINEER  —  script.js
 *  Vanilla JavaScript: no frameworks, no dependencies
 * ═══════════════════════════════════════════════════════════
 *  Sections:
 *   1. Blog Post JSON Data
 *   2. DOM Ready / Init
 *   3. Sticky Navbar & Active Link
 *   4. Hamburger Menu Toggle
 *   5. Dark / Light Theme Toggle (localStorage)
 *   6. Typewriter Effect
 *   7. Hero Canvas — Particle / Circuit Animation
 *   8. Skill Bar Animation (IntersectionObserver)
 *   9. Counter / Stats Animation
 *  10. Dynamic Blog Card Rendering
 *  11. Smooth Scroll (all nav links)
 *  12. Scroll-triggered Fade-in (IntersectionObserver)
 *  13. Footer Year
 *  14. Utility Helpers
 * ═══════════════════════════════════════════════════════════ */

"use strict";

/* ───────────────────────────────────────────────────────────
   1. BLOG POST JSON DATA
   Replace / extend this array to add / edit articles.
   The renderBlogCards() function reads this at runtime.
─────────────────────────────────────────────────────────── */
const BLOG_POSTS = [
  {
    id: 1,
    title: "Securing Modbus TCP: Vulnerabilities, Attack Vectors & Mitigations",
    excerpt:
      "An in-depth analysis of known Modbus TCP weaknesses, replay-attack demonstrations in a lab environment, and practical hardening recommendations for ICS networks.",
    tags: ["OT Cybersecurity", "Modbus", "ICS Security"],
    readTime: "12 min read",
    date: "2024-11-15",
    icon: "🔒",
    gradient: { c1: "#0a1a2a", c2: "#0d1f0d" },
    href: "#",
  },
  {
    id: 2,
    title: "IEC 61131-3 Structured Text: Building a Reusable PID Function Block",
    excerpt:
      "Step-by-step guide to writing a portable, vendor-agnostic PID controller in IEC 61131-3 ST, with anti-windup logic and bumpless transfer implementation.",
    tags: ["PLC Programming", "IEC 61131-3", "ST"],
    readTime: "10 min read",
    date: "2024-10-28",
    icon: "⚙️",
    gradient: { c1: "#1a0a0a", c2: "#0a1a2a" },
    href: "#",
  },
  {
    id: 3,
    title: "OPC UA Security: Configuring Certificates & Encrypted Sessions",
    excerpt:
      "A practical walkthrough of OPC UA certificate management, configuring SecurityPolicy endpoints, and auditing client-server trust on a Siemens S7-1500 setup.",
    tags: ["OPC UA", "SCADA", "PKI"],
    readTime: "14 min read",
    date: "2024-10-08",
    icon: "🛡️",
    gradient: { c1: "#0d0a1a", c2: "#0a1a10" },
    href: "#",
  },
  {
    id: 4,
    title: "Python + PyModbus: Building an ICS Network Scanner",
    excerpt:
      "Write a lightweight Modbus device discovery tool in Python, enumerate connected RTUs/PLCs, and export results to a structured JSON asset inventory.",
    tags: ["Python", "Modbus", "Tooling"],
    readTime: "9 min read",
    date: "2024-09-20",
    icon: "🐍",
    gradient: { c1: "#0a1a0a", c2: "#1a1a0a" },
    href: "#",
  },
  {
    id: 5,
    title: "IEC 62443 Zones & Conduits: Practical Network Segmentation for OT",
    excerpt:
      "Map your plant network to IEC 62443-3-2 Security Level requirements, design DMZ architectures, and enforce conduit policies with firewall rule examples.",
    tags: ["IEC 62443", "OT Security", "Network"],
    readTime: "16 min read",
    date: "2024-09-05",
    icon: "🌐",
    gradient: { c1: "#1a0d0a", c2: "#0a0d1a" },
    href: "#",
  },
  {
    id: 6,
    title: "LabVIEW & MQTT: Real-Time Industrial IoT Dashboard",
    excerpt:
      "Integrate LabVIEW with an MQTT broker to stream sensor data from NI DAQ hardware to a cloud dashboard — includes QoS tuning and TLS configuration.",
    tags: ["LabVIEW", "MQTT", "IIoT"],
    readTime: "11 min read",
    date: "2024-08-18",
    icon: "📊",
    gradient: { c1: "#0a1a1a", c2: "#1a0a1a" },
    href: "#",
  },
];

/* ───────────────────────────────────────────────────────────
   2. DOM READY — Initialise all modules
─────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initHamburger();
  initTypewriter();
  initHeroCanvas();
  initSkillBars();
  initCounters();
  renderBlogCards();
  initSmoothScroll();
  initFadeObserver();
  initFooterYear();
});

/* ───────────────────────────────────────────────────────────
   3. STICKY NAVBAR  &  ACTIVE NAV LINK
─────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Add/remove .scrolled class
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveLink();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Highlight active nav link based on viewport position
  function updateActiveLink() {
    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }
}

/* ───────────────────────────────────────────────────────────
   4. HAMBURGER MENU TOGGLE
─────────────────────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    if (isOpen) {
      mobileMenu.removeAttribute("hidden");
    } else {
      mobileMenu.setAttribute("hidden", "");
    }
  });

  // Close menu on link click
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("hidden", "");
    });
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("hidden", "");
    }
  });
}

/* ───────────────────────────────────────────────────────────
   5. DARK / LIGHT THEME TOGGLE  (localStorage persistence)
─────────────────────────────────────────────────────────── */
function initTheme() {
  const toggle    = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const htmlEl    = document.documentElement;

  // Load saved preference or respect system preference
  const saved = localStorage.getItem("cae-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = saved || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("cae-theme", theme);
    if (theme === "dark") {
      themeIcon.className = "fas fa-moon";
      toggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      themeIcon.className = "fas fa-sun";
      toggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }
}

/* ───────────────────────────────────────────────────────────
   6. TYPEWRITER EFFECT
   Cycles through an array of professional titles.
─────────────────────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const titles = [
    "Automation Engineer",
    "ICS Security Researcher",
    "PLC Developer",
    "OT Cybersecurity Specialist",
    "SCADA Architect",
    "Python Developer",
    "Industry 4.0 Advocate",
    "IIoT Systems Engineer",
  ];

  let titleIdx = 0;
  let charIdx  = 0;
  let deleting = false;
  let pauseTimer = null;

  const TYPE_SPEED   = 70;   // ms per character (typing)
  const DELETE_SPEED = 35;   // ms per character (deleting)
  const PAUSE_AFTER  = 2200; // ms to show complete word

  function tick() {
    const current = titles[titleIdx];

    if (!deleting) {
      // Typing forward
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        // Word complete — pause then start deleting
        deleting = true;
        pauseTimer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ───────────────────────────────────────────────────────────
   7. HERO CANVAS — Particle / Circuit Animation
   Draws animated nodes connected by faint lines,
   producing a circuit-board / network topology effect.
─────────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, particles, animId;

  const PARTICLE_COUNT   = 70;
  const CONNECTION_DIST  = 150;
  const PARTICLE_COLOR   = "rgba(0, 212, 255, 0.7)";
  const LINE_COLOR_BASE  = "rgba(0, 212, 255, ";
  const NODE_RADIUS      = 2;
  const SPEED            = 0.4;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * NODE_RADIUS + 1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
          ctx.strokeStyle = LINE_COLOR_BASE + alpha + ")";
          ctx.lineWidth   = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = PARTICLE_COLOR;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = "rgba(0, 212, 255, 0.6)";
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      init();
      draw();
    }, 200);
  });

  init();
  draw();
}

/* ───────────────────────────────────────────────────────────
   8. SKILL BAR ANIMATION  (IntersectionObserver)
   Bars animate to their target width when scrolled into view.
─────────────────────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.dataset.width || "0";
          fill.style.width = width + "%";
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach((fill) => observer.observe(fill));
}

/* ───────────────────────────────────────────────────────────
   9. COUNTER / STATS ANIMATION
   Counts numeric stat values up from 0 to target.
─────────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1800;
          const step   = Math.ceil(target / (duration / 16));
          let current  = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 16);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ───────────────────────────────────────────────────────────
  10. DYNAMIC BLOG CARD RENDERING
   Reads BLOG_POSTS[] and injects HTML into #blogGrid.
   Replace BLOG_POSTS or swap with a /api/posts fetch call.
─────────────────────────────────────────────────────────── */
function renderBlogCards() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  // Optionally fetch from backend:
  //   fetch("/api/posts")
  //     .then(r => r.json())
  //     .then(posts => injectCards(posts))
  //     .catch(() => injectCards(BLOG_POSTS)); // fallback
  injectCards(BLOG_POSTS);
}

function injectCards(posts) {
  const grid = document.getElementById("blogGrid");

  grid.innerHTML = posts
    .map((post, i) => {
      const tagsHTML = post.tags
        .map((t) => `<span class="blog-tag">${escHtml(t)}</span>`)
        .join("");

      const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return `
        <article class="blog-card"
                 role="listitem"
                 aria-label="${escHtml(post.title)}"
                 style="animation: card-fade-up 0.5s ease ${i * 0.1}s both;">
          <div class="blog-card-thumb"
               style="--c1:${post.gradient.c1}; --c2:${post.gradient.c2};"
               aria-hidden="true">
            <span style="font-size:3rem; position:relative; z-index:1;">${post.icon}</span>
          </div>
          <div class="blog-card-body">
            <div class="blog-card-tags">${tagsHTML}</div>
            <h3 class="blog-card-title">${escHtml(post.title)}</h3>
            <p class="blog-card-excerpt">${escHtml(post.excerpt)}</p>
            <div class="blog-card-meta">
              <span><i class="fas fa-calendar-alt" aria-hidden="true"></i>${formattedDate}</span>
              <span><i class="fas fa-clock" aria-hidden="true"></i>${escHtml(post.readTime)}</span>
            </div>
            <a href="${post.href}" class="blog-read-more" aria-label="Read more: ${escHtml(post.title)}">
              <i class="fas fa-terminal" aria-hidden="true"></i> Read More
            </a>
          </div>
        </article>`;
    })
    .join("");
}

/* ───────────────────────────────────────────────────────────
  11. SMOOTH SCROLL — all anchor links
─────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  // Supports any <a href="#section"> in the document
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = document.getElementById("navbar")?.offsetHeight || 64;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;

    window.scrollTo({ top, behavior: "smooth" });
  });
}

/* ───────────────────────────────────────────────────────────
  12. SCROLL-TRIGGERED FADE-IN  (IntersectionObserver)
   Adds .visible class when elements enter viewport.
   Elements styled with opacity:0 / translateY by default.
─────────────────────────────────────────────────────────── */
function initFadeObserver() {
  // Inject base styles for fade-in via JS (avoids FOUC)
  const style = document.createElement("style");
  style.textContent = `
    .fade-in-el {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .fade-in-el.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Target sections, cards, and major elements
  const targets = document.querySelectorAll(
    ".section-header, .protocol-card, .category-card, .contact-card, .hex-item"
  );
  targets.forEach((el) => el.classList.add("fade-in-el"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ───────────────────────────────────────────────────────────
  13. FOOTER YEAR — auto-update copyright year
─────────────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

/* ───────────────────────────────────────────────────────────
  14. UTILITY HELPERS
─────────────────────────────────────────────────────────── */

/**
 * Escape HTML special characters to prevent XSS when inserting
 * untrusted data (e.g. from API responses) into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
}
"""

print(js_content)
