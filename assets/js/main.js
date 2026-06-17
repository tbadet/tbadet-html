// Shared JS for the academic profile site.
// Handles: dark-mode toggle, scroll-spy nav highlighting on index.html,
// and a light reveal-on-scroll effect. Safe to include on every page —
// it simply does nothing on pages without the relevant elements.

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Theme toggle ----------
  // (The initial theme is already set on <html> by the inline script in
  // <head>, before first paint — this just wires up the button.)
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    var syncToggleLabel = function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    syncToggleLabel();
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable — ignore */ }
      syncToggleLabel();
    });
  }

  // ---------- Reveal-on-scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Scroll-spy nav highlighting (index.html only) ----------
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = document.querySelectorAll('main section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            var isMatch = link.getAttribute('href') === '#' + entry.target.id ||
                           link.getAttribute('href') === 'index.html#' + entry.target.id;
            link.classList.toggle('is-active', isMatch);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

});
