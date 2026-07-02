document.addEventListener("DOMContentLoaded", () => {
  const splash = document.querySelector(".splash-screen");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (splash) {
    if (reduced) {
      splash.remove();
    } else {
      document.body.classList.add("is-splashing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => splash.classList.add("is-ready"));
      });

      setTimeout(() => splash.classList.add("is-leaving"), 2250);
      setTimeout(() => {
        document.body.classList.remove("is-splashing");
        splash.remove();
      }, 3100);
    }
  }

  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));

  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (!header) return;

    const currentY = window.scrollY;

    if (currentY > lastY && currentY > 130) {
      header.style.transform = "translateX(-50%) translateY(-135%)";
      header.style.opacity = "0";
    } else {
      header.style.transform = "translateX(-50%) translateY(0)";
      header.style.opacity = "1";
    }

    lastY = Math.max(currentY, 0);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
