// Movimiento del sitio: transiciones con continuidad espacial,
// un momento orquestado en el hero y plegables reversibles. Todo respeta
// prefers-reduced-motion y degrada a un cambio inmediato sin View Transitions.
import { useEffect, useLayoutEffect } from "react";
import { flushSync } from "react-dom";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const canTransition = () =>
  typeof document.startViewTransition === "function" && !reduced();

// Runs `update` (React state) inside a view transition, then `afterUpdate`
// once the new DOM exists, so it can name or focus the new elements.
export function startTransition(enabled, update, afterUpdate) {
  if (!enabled || !canTransition()) {
    if (afterUpdate) flushSync(update);
    else update();
    afterUpdate?.();
    return null;
  }
  const transition = document.startViewTransition(() => {
    flushSync(update);
    afterUpdate?.();
  });
  // A skipped or aborted transition must not surface as an unhandled error.
  transition.ready.catch(() => {});
  transition.finished.catch(() => {});
  return transition;
}

const HERO_KEY = "redixc-hero-moment";

export function useHeroMoment(enabled, route) {
  useLayoutEffect(() => {
    if (!enabled || route.page !== "inicio" || reduced()) return;
    try {
      if (sessionStorage.getItem(HERO_KEY)) return;
      sessionStorage.setItem(HERO_KEY, "1");
    } catch {
      return;
    }
    const ease = "cubic-bezier(.2,.8,.2,1)";
    const animations = [...document.querySelectorAll(".hero-copy > *")].map(
      (el, i) =>
        el.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 400, delay: i * 50, easing: ease, fill: "backwards" },
        ),
    );
    const photo = document.querySelector(".family-visual img");
    if (photo)
      animations.push(
        photo.animate(
          [
            { opacity: 0, transform: "scale(1.03)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 650, easing: ease },
        ),
      );
    return () => animations.forEach((a) => a.cancel());
  }, [enabled, route]);
}

const DISCLOSURES = ".recommender-disclosure, .faq-list details";

// Height-animated <details>: a second press mid-animation reverses it.
export function useDisclosureMotion(enabled, route) {
  useEffect(() => {
    if (!enabled) return;
    const running = new Map();
    const onClick = (event) => {
      const summary = event.target.closest?.("summary");
      const details = summary?.parentElement;
      if (!details?.matches(DISCLOSURES) || reduced()) return;
      event.preventDefault();
      const current = running.get(details);
      if (current) {
        details.dataset.target =
          details.dataset.target === "open" ? "closed" : "open";
        summary.setAttribute("aria-expanded", details.dataset.target === "open");
        current.reverse();
        return;
      }
      const start = details.getBoundingClientRect().height;
      const opening = !details.open;
      details.open = false;
      const closedHeight = details.getBoundingClientRect().height;
      details.open = true;
      const openHeight = details.getBoundingClientRect().height;
      details.dataset.target = opening ? "open" : "closed";
      // `open` only changes when the animation ends; announce the new state now.
      summary.setAttribute("aria-expanded", opening);
      details.style.overflow = "hidden";
      const animation = details.animate(
        { height: [`${start}px`, `${opening ? openHeight : closedHeight}px`] },
        { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
      running.set(details, animation);
      animation.onfinish = () => {
        running.delete(details);
        details.style.overflow = "";
        details.open = details.dataset.target === "open";
        summary.removeAttribute("aria-expanded");
      };
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      running.forEach((animation) => animation.finish());
    };
  }, [enabled, route]);
}

export function useMenuCascade(enabled, open) {
  useLayoutEffect(() => {
    if (!enabled || !open || reduced()) return;
    const animations = [
      ...document.querySelectorAll("#mobile-navigation > *"),
    ].map((el, i) =>
      el.animate(
        [
          { opacity: 0, transform: "translateY(-6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 200, delay: i * 30, easing: "ease-out", fill: "backwards" },
      ),
    );
    return () => animations.forEach((a) => a.cancel());
  }, [enabled, open]);
}
