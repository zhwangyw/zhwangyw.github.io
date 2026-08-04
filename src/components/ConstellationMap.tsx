import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Node = { label: string; sub: string; to: string; x: number; y: number; c: string };

const NODES: Node[] = [
  { label: "PyTorch 主线", sub: "学习进度 · 40%", to: "/study", x: 20, y: 40, c: "#72d7ff" },
  { label: "技术博客", sub: "2 篇文章 · 自动归类", to: "/blog", x: 48, y: 22, c: "#a56cff" },
  { label: "知识库", sub: "8 篇精选笔记", to: "/knowledge", x: 76, y: 42, c: "#e07aff" },
  { label: "食谱", sub: "6 道菜谱", to: "/recipes", x: 62, y: 70, c: "#ff82d8" },
  { label: "周复盘", sub: "2026-W32", to: "/study", x: 30, y: 68, c: "#75ffc8" },
  { label: "简历", sub: "求职时间线", to: "/resume", x: 88, y: 76, c: "#ffd07a" },
];
const LINKS: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 2],
  [1, 5],
  [2, 3],
  [2, 5],
  [3, 5],
];

export default function ConstellationMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; label: string; sub: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let hover = -1;
    let raf = 0;
    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pos = (n: Node) => ({ x: (w * n.x) / 100, y: (h * n.y) / 100 });
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const [a, b] of LINKS) {
        const pa = pos(NODES[a]);
        const pb = pos(NODES[b]);
        const g = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
        g.addColorStop(0, "rgba(114,215,255,0.18)");
        g.addColorStop(1, "rgba(165,108,255,0.18)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      NODES.forEach((n, i) => {
        const p = pos(n);
        const tw = reduce ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0015 + i * 1.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, hover === i ? 9 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c;
        ctx.shadowBlur = hover === i ? 26 : 14 * tw;
        ctx.fill();
        ctx.shadowBlur = 0;
        if (hover === i) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 17, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(114,215,255,0.12)";
          ctx.fill();
        }
        ctx.font = "12px 'PingFang SC','Microsoft YaHei',sans-serif";
        ctx.fillStyle = hover === i ? "#fff" : "rgba(229,232,255,0.72)";
        ctx.textAlign = "left";
        ctx.fillText(n.label, p.x + 13, p.y + 4);
      });
    };
    const loop = (t: number) => {
      draw(t);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const crect = canvas.getBoundingClientRect();
      const prect = wrap.getBoundingClientRect();
      const mx = e.clientX - crect.left;
      const my = e.clientY - crect.top;
      hover = -1;
      NODES.forEach((n, i) => {
        const p = pos(n);
        if (Math.hypot(mx - p.x, my - p.y) < 24) hover = i;
      });
      if (hover >= 0) {
        const n = NODES[hover];
        const p = pos(n);
        setTip({ x: mx + (crect.left - prect.left) + 16, y: Math.max(my + (crect.top - prect.top) - 38, 4), label: n.label, sub: n.sub });
      } else setTip(null);
      draw(performance.now());
    };
    const onLeave = () => {
      hover = -1;
      setTip(null);
      draw(performance.now());
    };
    const onClick = () => {
      if (hover >= 0) navigate(NODES[hover].to);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);
    size();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);
    const onResize = () => {
      size();
      if (reduce) draw(0);
    };
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [navigate]);

  return (
    <div className="glass const-panel" ref={wrapRef}>
      <div className="queue-head">
        <h3>知识星空 · 星座图</h3>
        <span className="sub" style={{ fontSize: 12 }}>
          内容织成星座 · 悬停查看 · 点击跳转
        </span>
      </div>
      <canvas ref={canvasRef} className="const-canvas" aria-hidden="true" />
      <div
        className={"const-tooltip" + (tip ? " show" : "")}
        ref={tipRef}
        style={tip ? { left: tip.x, top: tip.y } : undefined}
      >
        {tip && (
          <>
            <b>{tip.label}</b>
            <span>{tip.sub} · 点击进入</span>
          </>
        )}
      </div>
    </div>
  );
}
