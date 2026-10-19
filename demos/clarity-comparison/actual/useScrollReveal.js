import { useEffect } from "react";

export function useScrollReveal(route) {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const elements = [
      ...document.querySelectorAll(
        "main section:not(.hero):not(.page-intro), main .hero-after, main .values-grid article, main .help-options article, main .plan, main .connection-step-grid>li",
      ),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) reveal(target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );

    function reveal(element, animate = true) {
      element.classList.remove("scroll-pending");
      if (animate) element.classList.add("scroll-enter");
      observer.unobserve(element);
    }

    elements.forEach((element) => {
      // Keep the initial viewport immediately visible, including restored scroll positions.
      if (element.getBoundingClientRect().top < innerHeight) return;
      if (element.matches("article, li")) {
        const index = [...element.parentElement.children].indexOf(element);
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 3) * 60}ms`,
        );
      }
      element.classList.add("scroll-pending");
      observer.observe(element);
    });

    // Anchor navigation and keyboard focus must never land on invisible content.
    const onFocus = (event) =>
      elements.forEach((element) => {
        if (element.contains(event.target)) reveal(element, false);
      });
    const onPreference = () => {
      if (preference.matches)
        elements.forEach((element) => reveal(element, false));
    };
    document.addEventListener("focusin", onFocus);
    preference.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", onPreference);
      elements.forEach((element) => {
        element.classList.remove("scroll-pending", "scroll-enter");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [route]);
}
