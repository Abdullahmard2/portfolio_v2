import React, { useState } from "react";
import ZoomReveal from "./ZoomReveal";
import profile from "../data/profile";
import "./Contact.css";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Use the visitor's email as the reply-to address.
    const visitorEmail = formData.get("email");
    const visitorName = formData.get("name");

    formData.append("_replyto", visitorEmail);
    formData.append(
      "_subject",
      `New portfolio message from ${visitorName}`
    );

    try {
      const response = await fetch("https://formspree.io/f/xeajaajp", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus("error");
    }
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

          <button
            className="contact-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
                ? "Sent — thank you"
                : status === "error"
                  ? "Try again"
                  : "Send message"}
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
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
