import { useEffect, useRef, useState } from "react";

export default function useHeroScrollPin(vh = 150) {
  const containerRef = useRef(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));

      if (progress < 0.33) setStep(1);
      else if (progress < 0.67) setStep(2);
      else setStep(3);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const panelStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
  };

  return { containerRef, panelStyle, step };
}
