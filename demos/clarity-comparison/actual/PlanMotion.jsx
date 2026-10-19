import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function usePlanMotion(enabled, route) {
  const previous = useRef(null);
  const animations = useRef(new Map());
  useLayoutEffect(() => {
    if (!enabled || !previous.current) return;
    const before = previous.current;
    previous.current = null;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = [...document.querySelectorAll(".all-plans [data-plan]")];
    animations.current.forEach((animation) => animation.cancel());
    animations.current.clear();
    if (reduced) return;
    cards.forEach((card, index) => {
      const old = before.get(card.dataset.plan),
        next = card.getBoundingClientRect();
      const from = old
        ? {
            transform: `translate(${old.x - next.x}px,${old.y - next.y}px)`,
            opacity: 1,
          }
        : { transform: "translateY(12px)", opacity: 0 };
      const animation = card.animate(
        [from, { transform: "translate(0,0)", opacity: 1 }],
        {
          duration: 320,
          easing: "cubic-bezier(.2,.8,.2,1)",
          delay: old ? 0 : Math.min(index, 2) * 35,
        },
      );
      animations.current.set(card, animation);
      animation.onfinish = () => animations.current.delete(card);
    });
  });
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => {
      animations.current.forEach((animation) => animation.cancel());
      animations.current.clear();
      previous.current = null;
    };
    const preference = () => {
      if (reduced.matches) cancel();
    };
    reduced.addEventListener("change", preference);
    return () => {
      cancel();
      reduced.removeEventListener("change", preference);
    };
  }, [route]);
  return () => {
    if (!enabled) return;
    previous.current = new Map(
      [...document.querySelectorAll(".all-plans [data-plan]")].map((card) => [
        card.dataset.plan,
        card.getBoundingClientRect(),
      ]),
    );
  };
}

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

export function CompareTray({ selected, clear, remove, open }) {
  const [snapshot, setSnapshot] = useState(selected);
  const ref = useRef(null);
  const animation = useRef(null);
  const visible = useRef(false);
  useLayoutEffect(() => {
    if (selected.length) setSnapshot(selected);
  }, [selected]);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    animation.current?.cancel();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!selected.length) {
      visible.current = false;
      if (reduced) {
        setSnapshot([]);
        return;
      }
      animation.current = element.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(12px)" },
        ],
        { duration: 140, easing: "ease-in", fill: "forwards" },
      );
      animation.current.onfinish = () => setSnapshot([]);
    } else if (!visible.current && !reduced) {
      visible.current = true;
      animation.current = element.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
  }, [selected, snapshot.length]);
  useEffect(() => () => animation.current?.cancel(), []);
  if (!snapshot.length) return null;
  return (
    <aside
      className="compare-tray"
      ref={ref}
      aria-label="Planes seleccionados para comparar"
      inert={!selected.length ? "" : undefined}
    >
      <div className="compare-tray-content">
        <strong>
          Tu comparación <span>{selected.length}/3</span>
        </strong>
        <div className="compare-tray-chips">
          {snapshot.map((name) => (
            <button
              key={name}
              onClick={() => remove(name)}
              aria-label={`Quitar ${name} de la comparación`}
            >
              {name}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      </div>
      <div className="compare-tray-actions">
        <button className="text-link" onClick={clear}>
          Limpiar
        </button>
        <button className="button" onClick={open}>
          Comparar ({selected.length}) <span aria-hidden="true">↗</span>
        </button>
      </div>
    </aside>
  );
}
