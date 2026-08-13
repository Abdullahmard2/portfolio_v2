import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useHeroScrollPin from "../hooks/useHeroScrollPin";
import profile from "../data/profile";
import "./Hero.css";

const roles = ["Architecture", "Frontend Development", "3D Visualization", "Freelance"];

export default function Hero() {
  const stageRef = useRef(null);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 15, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 15, mass: 0.6 });

  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const textX = useTransform(springX, [-1, 1], [-10, 10]);
  const textY = useTransform(springY, [-1, 1], [-6, 6]);

  // Same trick as the movie/scroll-wrap snippet: a tall spacer keeps the
  // panel pinned on screen while a step number (1/2/3) drives the CSS
  // transitions. The step is what changes, not a live scroll value, so
  // the zoom always plays out over a fixed 1s transition no matter how
  // fast someone scrolls past it — that's what makes it readable instead
  // of flashing by.
  const { containerRef, panelStyle, step } = useHeroScrollPin(150);

  const handleMouseMove = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mvX.set(x);
    mvY.set(y);
  };

  const handleMouseLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const scrollToNext = () => {
    document.getElementById("what-i-do")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero" ref={containerRef} style={{ height: "240vh" }}>
      <div
        className={`hero-zoom step-${step}`}
        style={{ ...panelStyle, height: "100vh" }}
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="hero-stage"
          style={{ rotateX, rotateY, transformPerspective: 900 }}
        >
          <div className="hero-content">
            <motion.div className="hero-text" style={{ x: textX, y: textY }}>
              <h1 className="hero-name">
                <span className="hero-name-outline">ABDULLAH</span>
              </h1>

              <div className="hero-meta">
                <div className="hero-photo-frame">
                  <img
                    src="/profile.jpg"
                    alt={profile.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.classList.add("hero-photo-empty");
                    }}
                  />
                  <span className="hero-photo-hint">photo</span>
                </div>
                <p className="hero-role">{profile.role}</p>
              </div>

              <ul className="hero-tags">
                {roles.map((r) => (
                  <li key={r}>
                    <span className="hero-tag-mark">+</span>
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <button
          className="scroll-cue"
          onClick={scrollToNext}
          aria-label="Scroll down"
        >
          <span className="scroll-cue-wheel">
            <span className="scroll-cue-dot" />
          </span>
          <svg className="scroll-cue-arrow" width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
