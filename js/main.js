/* Nur Azila Balqis portfolio — vanilla JS, progressive enhancement only.
 * Studied DNA: Off-Register (riso-01) script patterns. Everything works without JS.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Footer year ─────────────────────────────── */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Reveal on load (hero) + on scroll (cards) ── */
  if (!reduceMotion) {
    var revealTargets = [
      ".hero .kicker", ".hero__title", ".hero__lede", ".hero__actions", ".hero__facts",
      ".hero__art", ".about__figure", ".about__body"
    ];
    revealTargets.forEach(function (sel, i) {
      var el = doc.querySelector(sel);
      if (el) {
        el.classList.add("reveal");
        el.style.setProperty("--i", i % 6);
      }
    });

    var cards = Array.prototype.slice.call(doc.querySelectorAll(".card"));
    if ("IntersectionObserver" in window && cards.length) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var card = entry.target;
          var idx = cards.indexOf(card);
          card.classList.add("reveal");
          card.style.setProperty("--i", Math.min(idx, 5));
          obs.unobserve(card);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
      cards.forEach(function (c) { io.observe(c); });
    }
  } else {
    // Reduced motion: show everything immediately.
    Array.prototype.forEach.call(doc.querySelectorAll(".reveal"), function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  /* ── Active nav link tracking ────────────────── */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".masthead__nav a"));
  var sectionMap = {};
  navLinks.forEach(function (link) {
    var id = (link.getAttribute("href") || "").slice(1);
    if (id && doc.getElementById(id)) sectionMap[id] = link;
  });
  var sections = Object.keys(sectionMap).map(function (id) { return doc.getElementById(id); });
  if ("IntersectionObserver" in window && sections.length) {
    var activeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
        var link = sectionMap[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { activeIO.observe(s); }
    );
  }
})();
