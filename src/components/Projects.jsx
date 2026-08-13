import React from "react";
import DiveReveal from "./DiveReveal";
import projects from "../data/projects";
import "./Projects.css";

function initials(title) {
  return title.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

const motions = [
  { origin: "6% 50%", angle: -6, align: "left" },
  { origin: "50% 50%", angle: -4, align: "center" },
  { origin: "50% 6%", angle: 7, align: "center" },
  { origin: "94% 50%", angle: -7, align: "right" },
  { origin: "50% 94%", angle: 5, align: "center" },
  { origin: "6% 6%", angle: -5, align: "left" },
  { origin: "94% 94%", angle: 6, align: "right" },
];

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div style={{ height: "200vh" }} />

      <div id="projects-heading" className="projects-heading projects-heading-delayed" style={{ marginTop: "0" }}>
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="section-title">Projects I made</h2>
        <div style={{ height: "150vh" }} />
      </div>

      

      {projects.map((project, i) => {
        const CardTag = project.liveUrl ? "a" : "div";
        const linkProps = project.liveUrl
          ? { href: project.liveUrl, target: "_blank", rel: "noopener noreferrer" }
          : {};
        const m = motions[i % motions.length];

        return (
          <DiveReveal
            key={project.id}
            origin={m.origin}
            angle={m.angle}
            align={m.align}
            vh={300}
            wrapClassName=""
            overlap={i === projects.length - 1 ? 30 : undefined}
          >
            <CardTag
              className={`project-card${project.liveUrl ? " project-card-clickable" : ""}`}
              {...linkProps}
            >
              <div className="project-card-visual">
  {project.image ? <img src={project.image} alt={project.title} /> : <span>{initials(project.title)}</span>}
</div>
              <div className="project-card-body">
                <span className="project-card-index">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description}</p>
              </div>
            </CardTag>
          </DiveReveal>
        );
      })}

      <div style={{ height: "150vh" }} />
    </section>
  );
}
