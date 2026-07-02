document.addEventListener("DOMContentLoaded", () => {
  const splash = document.querySelector(".splash-screen");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (splash) {
    if (prefersReducedMotion) {
      splash.remove();
    } else {
      document.body.classList.add("is-splashing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          splash.classList.add("is-ready");
        });
      });

      window.setTimeout(() => {
        splash.classList.add("is-leaving");
      }, 2350);

      window.setTimeout(() => {
        document.body.classList.remove("is-splashing");
        splash.remove();
      }, 3200);
    }
  }

  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const header = document.querySelector(".site-header");
  let lastScroll = window.scrollY;
  let headerTicking = false;

  const updateHeader = () => {
    if (!header) return;

    const current = window.scrollY;
    if (current > lastScroll && current > 130) {
      header.style.transform = "translateX(-50%) translateY(-135%)";
      header.style.opacity = "0";
    } else {
      header.style.transform = "translateX(-50%) translateY(0)";
      header.style.opacity = "1";
    }

    lastScroll = Math.max(current, 0);
    headerTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!headerTicking) {
      window.requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }, { passive: true });

  const words = document.querySelectorAll(".rotator-word");
  const heroImages = document.querySelectorAll(".hero-img");
  let currentWord = 0;

  const rotateHero = () => {
    if (!words.length) return;

    words[currentWord].classList.remove("active");
    heroImages[currentWord % heroImages.length]?.classList.remove("active");

    currentWord = (currentWord + 1) % words.length;

    words[currentWord].classList.add("active");
    heroImages[currentWord % heroImages.length]?.classList.add("active");
  };

  window.setInterval(rotateHero, 3600);

  const zoomSection = document.querySelector(".portfolio-zoom");
  const zoomFrame = document.querySelector("#zoomFrame");

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const smoothStep = (value) => value * value * (3 - 2 * value);

  let targetProgress = 0;
  let currentProgress = 0;
  let zoomActive = false;

  const calculateProgress = () => {
    if (!zoomSection || !zoomFrame) return;

    const rect = zoomSection.getBoundingClientRect();
    const scrollable = zoomSection.offsetHeight - window.innerHeight;
    targetProgress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
  };

  const renderZoom = () => {
    if (!zoomSection || !zoomFrame) {
      zoomActive = false;
      return;
    }

    currentProgress += (targetProgress - currentProgress) * 0.11;

    if (Math.abs(targetProgress - currentProgress) < 0.001) {
      currentProgress = targetProgress;
    }

    const eased = smoothStep(currentProgress);
    zoomSection.style.setProperty("--progress", eased.toFixed(4));

    if (Math.abs(targetProgress - currentProgress) > 0.001) {
      window.requestAnimationFrame(renderZoom);
    } else {
      zoomActive = false;
    }
  };

  const requestZoom = () => {
    calculateProgress();

    if (!zoomActive) {
      zoomActive = true;
      window.requestAnimationFrame(renderZoom);
    }
  };

  window.addEventListener("scroll", requestZoom, { passive: true });
  window.addEventListener("resize", requestZoom);
  requestZoom();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
