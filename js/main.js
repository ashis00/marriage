/* ===========================================================
   Aarav & Isha — Wedding Invitation
   Vanilla JS · no dependencies · performance-friendly
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Envelope intro ---------- */
  const envelope = document.getElementById("envelope");
  const envInner = envelope ? envelope.querySelector(".envelope") : null;
  function openEnvelope() {
    if (!envelope || envelope.classList.contains("open")) return;
    if (envInner) envInner.classList.add("opening");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      envelope.classList.add("open");
      document.body.style.overflow = "";
    }, 900);
    setTimeout(function () {
      if (envelope.parentNode) envelope.parentNode.removeChild(envelope);
    }, 1800);
  }
  if (envelope) {
    document.body.style.overflow = "hidden";
    envelope.addEventListener("click", openEnvelope);
    // auto-open as a fallback so the site is never stuck
    setTimeout(openEnvelope, 4500);
  }

  /* ---------- Navigation ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    },
    { passive: true }
  );

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("show");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Countdown ---------- */
  const weddingDate = new Date("2026-12-14T10:00:00").getTime();
  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }
  function tick() {
    const now = Date.now();
    let diff = weddingDate - now;
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (elDays) elDays.textContent = pad(d);
    if (elHours) elHours.textContent = pad(h);
    if (elMinutes) elMinutes.textContent = pad(m);
    if (elSeconds) elSeconds.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- RSVP form ---------- */
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("rsvpSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = {
        name: form.name.value,
        email: form.email.value,
        attending: form.attending.value,
        guests: form.guests.value,
        message: form.message.value,
        submittedAt: new Date().toISOString(),
      };
      // Stored locally; wire this up to your backend / form service later.
      try {
        const all = JSON.parse(localStorage.getItem("rsvps") || "[]");
        all.push(data);
        localStorage.setItem("rsvps", JSON.stringify(all));
      } catch (err) {
        /* storage may be unavailable; ignore */
      }
      form.reset();
      if (success) {
        success.hidden = false;
        burstHearts();
      }
    });
  }

  /* ---------- Wishes wall ---------- */
  // NOTE: Wishes are stored in localStorage (per-browser). To share wishes
  // across all visitors, replace loadWishes()/saveWishes() with calls to a
  // backend API or a hosted form/database service.
  // SECURITY NOTE: this admin check runs in the browser, so the password is
  // visible in the source. It only deters casual visitors, not determined
  // users. Use a real server-side login for genuine protection.
  var ADMIN_USER = "Admin";
  var ADMIN_PASS = "Iter@3070";

  var wishForm = document.getElementById("wishForm");
  var wishTrack = document.getElementById("wishTrack");
  var wishMarquee = document.getElementById("wishMarquee");
  var wishesEmpty = document.getElementById("wishesEmpty");
  var adminLink = document.getElementById("adminLink");
  var adminModal = document.getElementById("adminModal");
  var adminClose = document.getElementById("adminClose");
  var adminForm = document.getElementById("adminForm");
  var adminError = document.getElementById("adminError");
  var adminBar = document.getElementById("adminBar");
  var adminLogout = document.getElementById("adminLogout");

  function loadWishes() {
    try {
      return JSON.parse(localStorage.getItem("wishes") || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveWishes(list) {
    try {
      localStorage.setItem("wishes", JSON.stringify(list));
    } catch (e) {
      /* storage unavailable */
    }
  }

  function makeWishCard(wish) {
    var card = document.createElement("div");
    card.className = "wish-card";
    card.setAttribute("data-id", wish.id);

    var msg = document.createElement("p");
    msg.className = "wish-msg";
    msg.textContent = "\u201C" + wish.text + "\u201D"; // textContent prevents HTML injection

    var author = document.createElement("span");
    author.className = "wish-author";
    author.textContent = "\u2014 " + wish.name;

    var del = document.createElement("button");
    del.className = "wish-delete";
    del.type = "button";
    del.setAttribute("aria-label", "Delete wish");
    del.textContent = "\u00D7";
    del.addEventListener("click", function () {
      deleteWish(wish.id);
    });

    card.appendChild(del);
    card.appendChild(msg);
    card.appendChild(author);
    return card;
  }

  function renderWishes() {
    if (!wishTrack) return;
    var list = loadWishes();
    wishTrack.innerHTML = "";

    if (!list.length) {
      if (wishesEmpty) wishesEmpty.style.display = "block";
      if (wishMarquee) wishMarquee.style.display = "none";
      return;
    }
    if (wishesEmpty) wishesEmpty.style.display = "none";
    if (wishMarquee) wishMarquee.style.display = "block";

    // Duplicate the set so the marquee can loop seamlessly (-50% translate).
    for (var pass = 0; pass < 2; pass++) {
      list.forEach(function (wish) {
        var card = makeWishCard(wish);
        if (pass === 1) card.setAttribute("aria-hidden", "true");
        wishTrack.appendChild(card);
      });
    }
    // Keep a steady scroll speed regardless of how many wishes there are.
    var duration = Math.max(20, list.length * 7);
    wishTrack.style.setProperty("--marquee-duration", duration + "s");
  }

  function deleteWish(id) {
    if (!document.body.classList.contains("admin-on")) return;
    var list = loadWishes().filter(function (w) {
      return w.id !== id;
    });
    saveWishes(list);
    renderWishes();
  }

  if (wishForm) {
    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = document.getElementById("wishName");
      var textEl = document.getElementById("wishText");
      var name = nameEl.value.trim();
      var text = textEl.value.trim();
      if (!name || !text) {
        wishForm.reportValidity();
        return;
      }
      var list = loadWishes();
      list.push({
        id: "w" + Date.now() + Math.floor(Math.random() * 1000),
        name: name,
        text: text,
        at: new Date().toISOString(),
      });
      saveWishes(list);
      wishForm.reset();
      renderWishes();
    });
  }

  /* ---------- Admin login ---------- */
  function setAdmin(on) {
    if (on) {
      document.body.classList.add("admin-on");
      if (adminBar) adminBar.hidden = false;
      try {
        sessionStorage.setItem("isAdmin", "1");
      } catch (e) {}
    } else {
      document.body.classList.remove("admin-on");
      if (adminBar) adminBar.hidden = true;
      try {
        sessionStorage.removeItem("isAdmin");
      } catch (e) {}
    }
  }
  // Restore admin state within the same browser session.
  try {
    if (sessionStorage.getItem("isAdmin") === "1") setAdmin(true);
  } catch (e) {}

  function openAdminModal() {
    if (adminModal) {
      adminModal.hidden = false;
      if (adminError) adminError.hidden = true;
      var u = document.getElementById("adminUser");
      if (u) u.focus();
    }
  }
  function closeAdminModal() {
    if (adminModal) adminModal.hidden = true;
  }

  if (adminLink) adminLink.addEventListener("click", openAdminModal);
  if (adminClose) adminClose.addEventListener("click", closeAdminModal);
  if (adminModal) {
    adminModal.addEventListener("click", function (e) {
      if (e.target === adminModal) closeAdminModal();
    });
  }
  if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var u = document.getElementById("adminUser").value;
      var p = document.getElementById("adminPass").value;
      if (u === ADMIN_USER && p === ADMIN_PASS) {
        setAdmin(true);
        adminForm.reset();
        closeAdminModal();
      } else if (adminError) {
        adminError.hidden = false;
      }
    });
  }
  if (adminLogout) adminLogout.addEventListener("click", function () {
    setAdmin(false);
  });

  renderWishes();

  /* ---------- Falling petals (canvas) ---------- */  const canvas = document.getElementById("petals");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, petals;
    const COLORS = ["#f6c6cd", "#e7a9b3", "#d98a96", "#e7d6ad", "#f3d4d9"];
    const COUNT = window.innerWidth < 600 ? 16 : 30;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function rand(a, b) {
      return a + Math.random() * (b - a);
    }
    function makePetal() {
      return {
        x: rand(0, w),
        y: rand(-h, 0),
        r: rand(6, 13),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        speed: rand(0.6, 1.8),
        sway: rand(0.5, 1.6),
        angle: rand(0, Math.PI * 2),
        spin: rand(-0.02, 0.02),
        phase: rand(0, Math.PI * 2),
      };
    }
    function init() {
      resize();
      petals = [];
      for (let i = 0; i < COUNT; i++) petals.push(makePetal());
    }
    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.r, -p.r, p.r, p.r, 0, p.r * 1.6);
      ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += 0.01;
        p.y += p.speed;
        p.x += Math.sin(p.phase) * p.sway;
        p.angle += p.spin;
        if (p.y > h + 20) {
          petals[i] = makePetal();
          petals[i].y = -20;
        }
        drawPetal(p);
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize, { passive: true });
    init();
    frame();
  }

  /* ---------- Heart burst on RSVP success ---------- */
  function burstHearts() {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const heart = document.createElement("span");
      heart.textContent = "\u2764";
      heart.style.cssText =
        "position:fixed;left:50%;bottom:60px;font-size:" +
        (14 + Math.random() * 18) +
        "px;color:#d98a96;pointer-events:none;z-index:999;will-change:transform,opacity;";
      document.body.appendChild(heart);
      const angle = (Math.PI * (i / n)) - Math.PI / 2 + (Math.random() - 0.5);
      const dist = 120 + Math.random() * 160;
      const dx = Math.cos(angle) * dist;
      const dy = -Math.abs(Math.sin(angle) * dist) - 120;
      heart.animate(
        [
          { transform: "translate(-50%, 0) scale(0.4)", opacity: 1 },
          { transform: "translate(calc(-50% + " + dx + "px), " + dy + "px) scale(1.2)", opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = function () {
        heart.remove();
      };
    }
  }
})();
