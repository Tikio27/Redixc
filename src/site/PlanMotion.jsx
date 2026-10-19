import { useLayoutEffect } from "react";

export function useHeroEntrance(enabled, route) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const elements = [...document.querySelectorAll(".hero-copy > *")];
    const animations = elements.map((element, index) =>
      element.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 360,
          delay: Math.min(index, 4) * 45,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "backwards",
        },
      ),
    );
    const image = document.querySelector(".family-visual");
    if (image)
      animations.push(
        image.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 480,
          easing: "ease-out",
        }),
      );
    const cancel = () => animations.forEach((animation) => animation.cancel());
    const preference = () => {
      if (reduced.matches) cancel();
    };
    reduced.addEventListener("change", preference);
    return () => {
      cancel();
      reduced.removeEventListener("change", preference);
    };
  }, [enabled, route]);
}
