import { useEffect, useRef } from "react";

// Retargeting preserves both the on-screen position and velocity.
// Critically damped by default; the frame loop sleeps when the spring settles.
export function spring(render, initial = 0, response = 0.35) {
  let x = initial,
    velocity = 0,
    target = initial,
    frame = 0,
    previous = 0,
    complete;
  const omega = 7 / response;
  function tick(time) {
    let elapsed = Math.min((time - (previous || time)) / 1000, 0.064);
    previous = time;
    while (elapsed > 0) {
      const dt = Math.min(elapsed, 1 / 240);
      velocity += (-omega * omega * (x - target) - 2 * omega * velocity) * dt;
      x += velocity * dt;
      elapsed -= dt;
    }
    render(x);
    if (Math.abs(x - target) < 0.001 && Math.abs(velocity) < 0.01) {
      x = target;
      velocity = 0;
      frame = 0;
      previous = 0;
      render(x);
      const done = complete;
      complete = undefined;
      done?.();
    } else frame = requestAnimationFrame(tick);
  }
  return {
    to(next, done, releaseVelocity) {
      target = next;
      complete = done;
      if (releaseVelocity !== undefined) velocity = releaseVelocity;
      if (!frame) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    },
    jump(next) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      complete = undefined;
      x = target = next;
      velocity = 0;
      render(x);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      complete = undefined;
      previous = 0;
    },
    get value() {
      return x;
    },
  };
}

export function useFluidControls(enabled, route) {
  useEffect(() => {
    if (!enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const controls = new Map();
    const selector =
      ".emil :is(.button,.activity,.theme-control button,.icon-button,.filter-tabs button,.connection-step-action)";
    function state(element) {
      if (!controls.has(element)) {
        const motion = spring(
          (value) => element.style.setProperty("--fluid-scale", value),
          1,
        );
        controls.set(element, { motion, hover: false, down: false });
      }
      return controls.get(element);
    }
    function update(element) {
      const s = state(element);
      if (reduced.matches) {
        s.motion.jump(1);
        return;
      }
      s.motion.to(s.down ? 0.97 : s.hover && fine.matches ? 1.015 : 1);
    }
    const control = (event) => event.target.closest?.(selector);
    function over(event) {
      const el = control(event);
      if (el) {
        state(el).hover = true;
        update(el);
      }
    }
    function out(event) {
      const el = control(event);
      if (el && !el.contains(event.relatedTarget)) {
        state(el).hover = false;
        state(el).down = false;
        update(el);
      }
    }
    function down(event) {
      const el = control(event);
      if (el && !el.disabled && event.button === 0) {
        state(el).down = true;
        update(el);
      }
    }
    function up() {
      controls.forEach((s, el) => {
        if (s.down) {
          s.down = false;
          update(el);
        }
      });
    }
    function keyboard(event) {
      const el = control(event);
      if (el && ["Enter", " "].includes(event.key) && !el.disabled) {
        state(el).down = event.type === "keydown";
        update(el);
      }
    }
    function preference() {
      if (reduced.matches) controls.forEach((s) => s.motion.jump(1));
    }
    const events = {
      pointerover: over,
      pointerout: out,
      pointerdown: down,
      pointerup: up,
      pointercancel: up,
      keydown: keyboard,
      keyup: keyboard,
    };
    Object.entries(events).forEach(([name, handler]) =>
      document.addEventListener(name, handler),
    );
    window.addEventListener("blur", up);
    reduced.addEventListener("change", preference);
    return () => {
      Object.entries(events).forEach(([name, handler]) =>
        document.removeEventListener(name, handler),
      );
      window.removeEventListener("blur", up);
      reduced.removeEventListener("change", preference);
      controls.forEach((s, el) => {
        s.motion.stop();
        el.style.removeProperty("--fluid-scale");
      });
    };
  }, [enabled, route]);
}

export function useFluidSheet(enabled, ref, close) {
  const state = useRef(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 600px)");
    const distance = () =>
      mobile.matches ? element.getBoundingClientRect().height + 24 : 36;
    const motion = spring(
      (y) => {
        element.style.setProperty("--sheet-y", `${y}px`);
        element.style.setProperty(
          "--sheet-opacity",
          Math.max(0, 1 - Math.max(0, y - distance() * 0.55) / (distance() * 0.45)),
        );
      },
      0,
      0.32,
    );
    state.current = {
      motion,
      reduced,
      mobile,
      element,
      distance,
      drag: null,
      closing: false,
    };
    if (!reduced.matches) {
      motion.jump(distance());
      motion.to(0);
    }
    const preference = () => {
      const current = state.current;
      if (reduced.matches) {
        motion.jump(0);
        if (current?.closing) closeRef.current();
      }
    };
    reduced.addEventListener("change", preference);
    return () => {
      motion.stop();
      reduced.removeEventListener("change", preference);
      state.current = null;
    };
  }, [enabled, ref]);
  function dismiss() {
    const s = state.current;
    if (!s || s.reduced.matches) {
      closeRef.current();
      return;
    }
    s.closing = true;
    s.motion.to(s.distance(), () => closeRef.current());
  }
  function finish(event, cancelled = false) {
    const s = state.current;
    if (!s?.drag || s.drag.id !== event.pointerId) return;
    const samples = s.drag.samples;
    // Discard old samples so pausing before release doesn't manufacture a fling.
    const last = samples.at(-1),
      first = samples.find((sample) => last.t - sample.t <= 100) || last;
    const velocity =
      performance.now() - last.t > 100
        ? 0
        : (last.y - first.y) / Math.max(0.008, (last.t - first.t) / 1000);
    s.drag = null;
    const projected = s.motion.value + velocity * 0.18;
    if (
      !cancelled &&
      velocity >= -80 &&
      projected > Math.min(150, s.distance() * 0.25)
    ) {
      s.closing = true;
      s.motion.to(s.distance(), () => closeRef.current(), velocity);
    } else {
      s.closing = false;
      s.motion.to(0, undefined, velocity);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return {
    dismiss,
    handlers: {
      onPointerDown(event) {
        const s = state.current;
        if (!s || !s.mobile.matches || s.reduced.matches || event.button !== 0)
          return;
        // Stop at the live position, including during an entrance or dismissal.
        const initial = s.motion.value;
        s.motion.stop();
        s.closing = false;
        s.drag = {
          id: event.pointerId,
          start: event.clientY,
          initial,
          samples: [{ y: initial, t: performance.now() }],
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove(event) {
        const s = state.current;
        if (!s?.drag || s.drag.id !== event.pointerId) return;
        const raw = s.drag.initial + event.clientY - s.drag.start;
        const y = raw < 0 ? raw * 0.18 : raw;
        s.motion.jump(y);
        s.drag.samples.push({ y, t: performance.now() });
        s.drag.samples = s.drag.samples.filter(
          (sample) => performance.now() - sample.t < 140,
        );
      },
      onPointerUp: (event) => finish(event),
      onPointerCancel: (event) => finish(event, true),
      onLostPointerCapture: (event) => {
        if (state.current?.drag) finish(event, true);
      },
    },
  };
}
