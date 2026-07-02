document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const splash = document.querySelector(".splash-screen");
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setPageReady = () => body.classList.add("page-ready");

  const closeSplash = () => {
    if (!splash) {
      setPageReady();
      return;
    }

    splash.classList.add("is-leaving");

    window.setTimeout(() => {
      body.classList.remove("is-splashing");
      splash.remove();
      setPageReady();
    }, 820);
  };

  if (splash) {
    if (prefersReducedMotion) {
      splash.remove();
      setPageReady();
    } else {
      body.classList.add("is-splashing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => splash.classList.add("is-ready"));
      });

      window.setTimeout(closeSplash, 2050);

      // Failsafe — splash zawsze znika, nawet jeśli przeglądarka zgubi animację.
      window.setTimeout(() => {
        if (document.body.contains(splash)) closeSplash();
      }, 3600);
    }
  } else {
    setPageReady();
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 34);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !nav) return;

    menuButton.classList.remove("is-active");
    nav.classList.remove("is-open");
    body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.classList.toggle("is-active", isOpen);
      body.classList.toggle("menu-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((item, index) => {
    const localIndex = index % 6;
    item.style.setProperty("--delay", `${localIndex * 55}ms`);
  });

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.13,
      rootMargin: "0px 0px -54px 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
