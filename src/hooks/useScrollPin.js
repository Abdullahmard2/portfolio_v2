import { useEffect, useRef, useState } from "react";

export const DIVE_OVERLAP_VH = 90;
export const DIVE_APPROACH_VH = 70;

export default function useScrollPin(vh = 300) {
  const containerRef = useRef(null);
  const [state, setState] = useState({
    mode: "before",
    progress: 0,
    bgProgress: 0,
    travel: 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewport = window.innerHeight;

      const sectionTop = scrollY + rect.top;

      const approach = viewport * (DIVE_APPROACH_VH / 100);
      const cameraLength = viewport * (vh / 100);

      const cameraStart = sectionTop - approach;
      const cameraEnd = cameraStart + cameraLength;

      let mode = "before";
      let progress = 0;

      if (scrollY < cameraStart) {
        mode = "before";
      } else if (scrollY >= cameraEnd) {
        mode = "after";
        progress = 1;
      } else {
        mode = "camera";
        progress = Math.min(
          1,
          Math.max(0, (scrollY - cameraStart) / cameraLength)
        );
      }

      setState((s) => {
        if (
          s.mode === mode &&
          Math.abs(s.progress - progress) < 0.0008
        ) {
          return s;
        }

        return {
          mode,
          progress,
          bgProgress: progress,
          travel: cameraLength,
        };
      });
    };

    update();

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [vh]);

  return {
    containerRef,
    panelStyle: {},
    progress: state.progress,
    bgProgress: state.bgProgress,
    mode: state.mode,
    step:
      state.progress < 0.33
        ? 1
        : state.progress < 0.67
          ? 2
          : 3,
  };
}
