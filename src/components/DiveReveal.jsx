import React, { useRef, useEffect } from "react";
import useScrollPin, {
  DIVE_OVERLAP_VH,
} from "../hooks/useScrollPin";
import useMouseParallax from "../hooks/useMouseParallax";
import "./DiveReveal.css";

// Keep the earlier reveal above the next one during the handoff.
let nextDiveOrder = 0;

export default function DiveReveal({
  children,
  as = "div",
  className = "",
  align = "center",
  vh = 300,
  angle = 0,
  origin = "50% 50%",
  wrapClassName = "",
  overlap = DIVE_OVERLAP_VH,
  parallax = true, // same mouse-follow feel as the hero; pass false to opt out
}) {
  const Tag = as;
  const order = useRef(nextDiveOrder++).current;
  const { containerRef, progress, mode } = useScrollPin(vh);
  const zoomRef = useRef(null);
  const mouse = useMouseParallax();

  // Keep mouse movement on the camera layer so the text itself is never independently transformed.
  useEffect(() => {
    if (!parallax) return undefined;
    let raf = requestAnimationFrame(tick);
    let curX = 0;
    let curY = 0;

    function tick() {
      curX += (mouse.current.x - curX) * 0.08;
      curY += (mouse.current.y - curY) * 0.08;
      if (zoomRef.current) {
        zoomRef.current.style.setProperty("--mouse-x", `${curX * 14}px`);
        zoomRef.current.style.setProperty("--mouse-y", `${curY * 10}px`);
      }
      raf = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(raf);
  }, [parallax, mouse]);

  const [originX, originY] = origin.split(" ").map((value) => parseFloat(value));
  const focalX = Number.isFinite(originX) ? originX : 50;
  const focalY = Number.isFinite(originY) ? originY : 50;

  // The zoom pivots on focalY, so the content has to sit at that same
  // vertical position — otherwise the pivot and the text disagree and
  // the zoom looks off-target. Derived automatically so it can't be
  // forgotten on a new motions entry.
  const valign = focalY <= 15 ? "top" : focalY >= 85 ? "bottom" : "middle";

  const scale = Math.min(12.6, Math.max(0.34,
    0.34 +
    Math.min(1, Math.max(0, progress / 0.58)) * 0.66 +
    Math.min(1, Math.max(0, (progress - 0.58) / 0.20)) * 2.1 +
    Math.min(1, Math.max(0, (progress - 0.78) / 0.22)) * 9.5
  ));

  return (
    <div
      ref={containerRef}
      className={`dive-wrap ${wrapClassName}`}
      style={{
        height: `${vh}vh`,
        "--dive-progress": progress,
        "--dive-origin": origin,
        "--dive-overlap": `${overlap}vh`,
      }}
    >
      <div
        ref={zoomRef}
        className={`dive-zoom mode-${mode} valign-${valign}`}
        style={{
          "--dive-order": order,
          "--dive-focal-x": `${focalX}%`,
          "--dive-focal-y": `${focalY}%`,
        }}
      >
        <Tag
          className={`dive-content align-${align} ${className}`}
          style={{ "--dive-angle": `${angle}deg` }}
        >
          {children}
        </Tag>
      </div>
    </div>
  );
}
