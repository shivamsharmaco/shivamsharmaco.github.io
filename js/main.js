// Progressive enhancement only — the page works fully without this file.

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade sections in as they enter the viewport
  if ("IntersectionObserver" in window && !reduceMotion) {
    var targets = document.querySelectorAll(".case, .skill-card, .vision, .about, .contact");

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Move focus to anchored sections for keyboard users
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });

  // Side nav: fade in past hero, track active section
  var sideNav = document.getElementById("side-nav");
  var hero = document.getElementById("hero");
  if (sideNav && hero) {
    var sideLinks = sideNav.querySelectorAll("a");
    var sideSections = Array.prototype.filter.call(
      document.querySelectorAll("section[id]"),
      function (el) {
        return sideNav.querySelector('[data-target="' + el.id + '"]');
      }
    );

    var ticking = false;
    function updateSideNav() {
      ticking = false;
      var heroBottom = hero.getBoundingClientRect().bottom;
      sideNav.classList.toggle("is-visible", heroBottom < 80);

      var currentId = sideSections.length ? sideSections[0].id : null;
      sideSections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          currentId = sec.id;
        }
      });
      sideLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("data-target") === currentId);
      });
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateSideNav);
        }
      },
      { passive: true }
    );
    updateSideNav();
  }
})();
