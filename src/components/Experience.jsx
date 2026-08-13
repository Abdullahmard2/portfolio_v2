import React from "react";
import DiveReveal from "./DiveReveal";
import experience from "../data/experience";
import "./Experience.css";

const motions = [
  { origin: "6% 50%", angle: -6, align: "left" },
  { origin: "50% 50%", angle: 4, align: "center" },
  { origin: "50% 6%", angle: 6, align: "center" },
  { origin: "94% 50%", angle: -6, align: "right" },
  { origin: "50% 94%", angle: 5, align: "center" },
];

export default function Experience() {
  return (
    <section id="experience" className="experience-section">
      <DiveReveal origin={motions[0].origin} angle={motions[0].angle} align={motions[0].align} vh={300}>
        <div className="experience-heading">
          <span className="section-eyebrow">Background</span>
          <h2 className="section-title">Experience</h2>
        </div>
      </DiveReveal>

      {experience.map((item, i) => {
        const m = motions[(i + 1) % motions.length];
        const isLast = i === experience.length - 1;
        return (
          <DiveReveal
            key={item.title}
            origin={m.origin}
            angle={m.angle}
            align={m.align}
            vh={300}
            overlap={isLast ? 30 : undefined}
          >
            <div className="experience-row">
              <span className="experience-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="experience-row-title">{item.title}</h3>
              <p className="experience-row-desc">{item.description}</p>
            </div>
          </DiveReveal>
        );
      })}
    </section>
  );
}
