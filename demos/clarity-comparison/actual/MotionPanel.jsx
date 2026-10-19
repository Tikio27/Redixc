import { useLayoutEffect, useRef } from "react";
import { spring } from "./fluidMotion";

// Keep the panel mounted during reversal. Springs retain their live velocity.
export function MotionPanel({ enabled, open, kind, children }) {
  const element = useRef(null),
    content = useRef(null),
    controller = useRef(null);
  const opened = useRef(open);
  opened.current = open;
  useLayoutEffect(() => {
    if (!enabled) return;
    const panel = element.current,
      body = content.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const progress = spring(
      (value) => {
        panel.style.setProperty("--panel-progress", value);
        panel.style.setProperty("--panel-offset", `${(1 - value) * -8}px`);
      },
      0,
      0.28,
    );
    const height = spring(
      (value) =>
        panel.style.setProperty("--panel-height", `${Math.max(0, value)}px`),
      0,
      0.28,
    );
    function sync() {
      const visible = opened.current;
      panel.inert = !visible;
      panel.setAttribute("aria-hidden", String(!visible));
      if (visible) panel.hidden = false;
      const target = visible ? 1 : 0;
      if (reduced.matches) {
        progress.jump(target);
        height.jump(visible ? body.getBoundingClientRect().height : 0);
        panel.hidden = !visible;
      } else {
        progress.to(target, () => {
          if (!opened.current) panel.hidden = true;
        });
        if (kind === "result")
          height.to(visible ? body.getBoundingClientRect().height : 0);
      }
    }
    controller.current = sync;
    panel.hidden = !opened.current;
    sync();
    const observer = new ResizeObserver(() => {
      if (opened.current) sync();
    });
    observer.observe(body);
    reduced.addEventListener("change", sync);
    return () => {
      progress.stop();
      height.stop();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      controller.current = null;
    };
  }, [enabled, kind]);
  useLayoutEffect(() => controller.current?.(), [open, children]);
  if (!enabled) return open ? children : null;
  return (
    <div className={`motion-panel motion-panel-${kind}`} ref={element}>
      <div className="motion-panel-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
