import React from "react";
import useRevealOnce from "../hooks/useRevealOnce";
import "./ZoomReveal.css";

// Scales/fades a block into place once, the first time it crosses into
// view — no scroll-scrubbing. That means the timing is always the same
// fixed duration whether someone scrolls fast or slow, and the section
// doesn't need extra height just to give the animation room to play.
export default function ZoomReveal({
  children,
  className = "",
  as = "div",
  align = "center", // "center" | "left" | "right"
  tilt = 0,
  startScale = 0.82,
  peakScale = 1,
  delay = 0,
}) {
  const Tag = as;
  const { ref, visible } = useRevealOnce();

  return (
    <div className={`zoom-block align-${align}`}>
      <Tag
        ref={ref}
        className={`zoom-item ${visible ? "is-visible" : ""} ${className}`}
        style={{
          "--from-scale": startScale,
          "--to-scale": peakScale,
          "--tilt": `${tilt}deg`,
          transitionDelay: visible ? `${delay}ms` : "0ms",
        }}
      >
        {children}
      </Tag>
    </div>
  );
}
