import { useEffect, useRef } from "react";

// One step per gesture. Distances are in CSS pixels.
const DRAG_THRESHOLD = 50;
const WHEEL_THRESHOLD = 60;
// A trackpad swipe keeps sending wheel events as it coasts to a stop. Events
// closer together than this belong to the same gesture.
const WHEEL_QUIET_MS = 150;

type Controls = {
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;
  enabled?: boolean;
};

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest("button, a, input, textarea, select, [role=dialog]") !== null;

/**
 * Keyboard (arrows, Home, End), mouse drag and horizontal wheel or
 * trackpad swipes. Each gesture moves the carousel one step.
 */
export const useCarouselControls = ({ enabled = true, ...handlers }: Controls) => {
  // Read through a ref so the listeners never act on stale handlers.
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isEditable(e.target)) return;
      const { onNext, onPrev, onFirst, onLast } = handlersRef.current;
      switch (e.key) {
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "Home":
          onFirst();
          break;
        case "End":
          onLast();
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    let drag: { id: number; x: number; y: number } | null = null;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (isInteractive(e.target)) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag = null;
      // Ignore short drags and mostly vertical ones.
      if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5)
        return;
      if (dx < 0) handlersRef.current.onNext();
      else handlersRef.current.onPrev();
    };
    const onPointerCancel = () => {
      drag = null;
    };

    let wheelTotal = 0;
    let wheelSpent = false;
    let lastWheelAt = 0;
    const onWheel = (e: WheelEvent) => {
      // Only horizontal gestures (trackpad swipe, shift + wheel).
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      // Stops browsers using the swipe for back/forward navigation.
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerWidth : 1;
      const now = performance.now();
      if (now - lastWheelAt > WHEEL_QUIET_MS) {
        wheelTotal = 0;
        wheelSpent = false;
      }
      lastWheelAt = now;
      if (wheelSpent) return;
      wheelTotal += e.deltaX * unit;
      if (Math.abs(wheelTotal) < WHEEL_THRESHOLD) return;
      if (wheelTotal > 0) handlersRef.current.onNext();
      else handlersRef.current.onPrev();
      wheelSpent = true;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("wheel", onWheel);
    };
  }, [enabled]);
};
