import React from "react";
import { motion, useScroll } from "framer-motion";
import "./ScrollProgress.css";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-track" />
      <motion.div
        className="scroll-progress-fill"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}
