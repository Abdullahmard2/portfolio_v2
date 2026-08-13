import { useEffect, useRef } from "react";

/**
 * Tracks the mouse position normalized to -1..1 (x) and -1..1 (y),
 * with 0,0 being the center of the viewport. Returns a ref so consumers
 * can read the latest value inside animation loops without re-rendering.
 */
export default function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x, y };
    };
    const handleLeave = () => {
      mouse.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return mouse;
}
