import React, { useEffect, useRef, useState } from "react";
import { DIVE_OVERLAP_VH } from "../hooks/useScrollPin";
import profile from "../data/profile";
import "./Nav.css";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "what-i-do", label: "What I Do" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState("Intro");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 40 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = SECTIONS.find((s) => s.id === entry.target.id);
            if (match) setCurrent(match.label);
          }
        });
      },
      // A thin invisible line at the vertical center of the viewport
      // (rootMargin shrinks the observed area by 50% top and bottom).
      // "Current section" becomes whichever section's box currently
      // crosses that center line — this works no matter how tall a
      // section is, unlike threshold: 0.5, which needs half of the
      // *entire* section on screen at once and silently fails for any
      // section taller than 2x the viewport (yours now are).
      { threshold: 0, rootMargin: "-50% 0px -50% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Projects has a long spacer before its heading, so target the heading itself.
    // Experience starts a little before the visible Background / Experience dive.
    const target = id === "projects"
      ? document.getElementById("projects-heading")
      : document.getElementById(id);
    if (!target) return;

    let targetY = window.scrollY + target.getBoundingClientRect().top;

    if (id === "experience") {
      targetY += window.innerHeight * 0.55;
    }

    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
  };

  return (
    <>
      <header className={`nav ${visible ? "nav-visible" : "nav-hidden"}`}>
        <button className="nav-name" onClick={() => goTo("hero")}>
          {profile.name}
        </button>
        <nav className="nav-links">
          <button onClick={() => goTo("experience")}>Experience</button>
          <button onClick={() => goTo("projects")}>Projects</button>
          <button onClick={() => goTo("contact")}>Contact</button>
        </nav>
      </header>
      <div className="section-indicator" aria-hidden="true">
        <span className="section-indicator-label">Section</span>
        <span className="section-indicator-value">{current}</span>
      </div>
      <div className="quick-jump">
        <button onClick={() => goTo("hero")}>Home</button>
        <button onClick={() => goTo("projects")}>Projects</button>
      </div>
    </>
  );
}
