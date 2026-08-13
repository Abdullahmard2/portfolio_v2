import { useEffect, useRef, useState } from "react";

// Watches an element and flips a flag the first time it enters the
// viewport. After that it just unsubscribes — the CSS transition takes
// over from there, so the reveal always plays at the same speed no
// matter how fast someone scrolls, and there's no scroll math to keep
// in sync with page height.
export default function useRevealOnce(options = {}) {
  const { threshold = 0.2, rootMargin = "0px 0px -15% 0px" } = options;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
