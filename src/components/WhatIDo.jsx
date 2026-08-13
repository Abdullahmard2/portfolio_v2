import React from "react";
import DiveReveal from "./DiveReveal";
import "./WhatIDo.css";

const motions = [
  { origin: "6% 50%", angle: -6, align: "left" },
  { origin: "50% 50%", angle: 5, align: "center" },
];

export default function WhatIDo() {
  return (
    <section id="what-i-do" className="dive-section">
      <DiveReveal origin={motions[0].origin} angle={motions[0].angle} align={motions[0].align} vh={300}>
        <div className="dive-heading">
          <span className="dive-eyebrow">What I do</span>
          <h2 className="dive-title">I design buildings,<br />and I build websites.</h2>
        </div>
      </DiveReveal>

      <DiveReveal origin={motions[1].origin} angle={motions[1].angle} align={motions[1].align} vh={300}>
        <p className="dive-sub">
          Architect by training, frontend developer by habit — I move between
          physical space and digital interfaces, treating both as problems of
          structure, light and flow.
        </p>
      </DiveReveal>
    </section>
  );
}
