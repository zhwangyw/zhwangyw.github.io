import { useEffect, useRef } from "react";

export default function BackgroundFX() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: { x: number; y: number; r: number; p: number; s: number; vy: number; hue: string }[] = [];
    let raf = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor((innerWidth * innerHeight) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.012 + 0.003,
        vy: Math.random() * 0.06 + 0.015,
        hue: Math.random() < 0.75 ? "229, 232, 255" : "165, 108, 255",
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const st of stars) {
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * st.s * 1000 + st.p));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${st.hue},${(tw * 0.9).toFixed(3)})`;
        ctx.fill();
      }
    };
    const tick = (t: number) => {
      draw(t);
      for (const st of stars) {
        st.y -= st.vy;
        if (st.y < -2) {
          st.y = innerHeight + 2;
          st.x = Math.random() * innerWidth;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    size();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(tick);
    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} className="bg-fx" aria-hidden="true" />;
}
