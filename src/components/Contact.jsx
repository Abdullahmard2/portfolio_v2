import React, { useState } from "react";
import ZoomReveal from "./ZoomReveal";
import profile from "../data/profile";
import "./Contact.css";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sent

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <section id="contact" className="contact-section contact-last">
      <ZoomReveal as="div" className="contact-heading" align="left" tilt={7}>
        <span className="section-eyebrow">Get in touch</span>
        <h2 className="section-title">Contact me</h2>
      </ZoomReveal>

      <ZoomReveal
        as="div"
        className="contact-grid"
        align="center"
        tilt={-7}
        startScale={0.82}
        peakScale={1}
        endScale={1.06}
      >
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required />
          </div>
          <button className="contact-submit" type="submit">
            {status === "sent" ? "Sent — thank you" : "Send message"}
          </button>
        </form>

        <div className="contact-side">
          <p className="contact-side-text">
            Prefer email? Reach me directly, or find me on any of the
            platforms below.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="contact-socials">
            {profile.socials
              .filter((s) => s.label !== "Email")
              .map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
          </div>
        </div>
      </ZoomReveal>

      <span className="contact-credit">
        © {new Date().getFullYear()} {profile.name} — built with React
      </span>
    </section>
  );
}
