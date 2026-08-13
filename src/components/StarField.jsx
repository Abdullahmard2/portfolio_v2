import React, { useEffect, useRef } from "react";
import useMouseParallax from "../hooks/useMouseParallax";
import "./StarField.css";

const STAR_COUNT_DESKTOP = 420;
const STAR_COUNT_MOBILE = 200;
const FOCAL = 320; // projection focal length
const NEAR_Z = 0.01; // z at which a star respawns far away
const FAR_Z = 1; // starting depth of a fresh star
const SPARKLE_CHANCE = 0.012; // fraction of stars rendered as 4-point sparkles - kept rare

function randomStar(w, h) {
  const isSparkle = Math.random() < SPARKLE_CHANCE;
  return {
    x: (Math.random() * 2 - 1) * w,
    y: (Math.random() * 2 - 1) * h,
    z: Math.random() * FAR_Z + 0.05,
    // per-star twinkle: slow, independent breathing rather than a fast blink
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.05 + Math.random() * 0.12,
    // size class gives real variety: most stars are tiny, quiet pinpricks,
    // only a few are bright feature stars with a soft glow halo
    sizeClass: Math.random() < 0.05 ? "bright" : Math.random() < 0.22 ? "mid" : "dim",
    isSparkle,
  };
}

function sizeFor(sizeClass) {
  if (sizeClass === "bright") return 1.6 + Math.random() * 1.1;
  if (sizeClass === "mid") return 0.9 + Math.random() * 0.6;
  return 0.4 + Math.random() * 0.4;
}

function drawSparkle(ctx, x, y, r, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha * 0.7;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3.5);
  grad.addColorStop(0, "rgba(255,255,255,0.7)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = Math.max(r * 0.28, 0.35);
  ctx.beginPath();
  ctx.moveTo(-r * 3, 0);
  ctx.lineTo(r * 3, 0);
  ctx.moveTo(0, -r * 3);
  ctx.lineTo(0, r * 3);
  ctx.stroke();
  ctx.restore();
}

export default function StarField() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const mouse = useMouseParallax();
  const smoothMouse = useRef({ x: 0, y: 0 });

  const warpBoost = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const count = width < 700 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    starsRef.current = Array.from({ length: count }, () => randomStar(width, height));

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      warpBoost.current += Math.min(Math.abs(delta) * 0.0005, 0.018);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.04;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.04;

      const speed = 0.01 + warpBoost.current;
      warpBoost.current *= 0.93;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const stars = starsRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= speed * dt * 1.6;

        if (s.z <= NEAR_Z) {
          const fresh = randomStar(width, height);
          Object.assign(s, fresh, { z: FAR_Z });
          continue;
        }

        const depthFactor = 1 - s.z;
        const parallaxStrength = 50 * depthFactor;
        const px = s.x + smoothMouse.current.x * parallaxStrength;
        const py = s.y + smoothMouse.current.y * parallaxStrength;

        const scale = FOCAL / (s.z * FOCAL);
        const sx = cx + (px * scale) / 10;
        const sy = cy + (py * scale) / 10;

        if (sx < -60 || sx > width + 60 || sy < -60 || sy > height + 60) continue;

        // slow breathing twinkle: spends most time dim, only briefly bright
        const breathe = 0.5 + 0.5 * Math.sin(now * 0.001 * s.twinkleSpeed + s.phase);
        const twinkle = 0.12 + 0.6 * Math.pow(breathe, 3);
        const depthBrightness = Math.min(1, 0.2 + depthFactor * 0.95);
        const alpha = depthBrightness * twinkle;
        const radius = sizeFor(s.sizeClass) * (0.5 + depthFactor * 2);

        if (s.isSparkle && s.sizeClass !== "dim") {
          drawSparkle(ctx, sx, sy, radius, Math.min(alpha * 1.1, 1));
        } else {
          if (s.sizeClass !== "dim") {
            const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 4);
            glow.addColorStop(0, `rgba(235,238,245,${(alpha * 0.5).toFixed(3)})`);
            glow.addColorStop(1, "rgba(235,238,245,0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(sx, sy, radius * 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
          ctx.arc(sx, sy, Math.max(radius, 0.35), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="starfield-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="starfield-canvas" />
      <div className="starfield-vignette" />
    </div>
  );
}
