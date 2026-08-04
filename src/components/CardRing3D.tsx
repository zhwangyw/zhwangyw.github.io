import { useEffect, useRef, useState } from "react";
import { Draggable, gsap } from "../lib/gsap";
import type { Note } from "../data/notes";

export default function CardRing3D({ items, onSelect }: { items: Note[]; onSelect: (n: Note) => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const movedRef = useRef(false);
  const cruiseRef = useRef<number | null>(null);
  const actionsRef = useRef<{ animateTo(t: number): void; cardCenter(i: number): number } | null>(null);
  const selectRef = useRef<(i: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const [mode3d, setMode3d] = useState(true);
  const [cruise, setCruise] = useState(false);

  const select = (i: number) => {
    activeRef.current = i;
    setActive(i);
    onSelect(items[i]);
    const a = actionsRef.current;
    if (a) a.animateTo(a.cardCenter(i));
  };
  selectRef.current = select;

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    let minX = 0;
    const updateBounds = () => {
      const maxX = Math.max(0, track.scrollWidth - stage.clientWidth + 16);
      minX = -maxX;
      return minX;
    };
    const cardCenter = (i: number) => {
      const card = track.children[i] as HTMLElement | undefined;
      if (!card) return 0;
      const r = card.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      return r.left - s.left + r.width / 2 - s.width / 2;
    };
    const animateTo = (target: number) => {
      gsap.killTweensOf(track);
      gsap.to(track, {
        x: Math.max(minX, Math.min(0, target)),
        duration: 0.34,
        overwrite: "auto",
      });
    };
    actionsRef.current = { animateTo, cardCenter };
    const drag = Draggable.create(track, {
      type: "x",
      bounds: () => ({ minX: updateBounds(), maxX: 0 }),
      inertia: true,
      edgeResistance: 0.75,
      onPress() {
        movedRef.current = false;
        stopCruise();
        gsap.killTweensOf(track);
      },
      onDrag() {
        movedRef.current = true;
      },
    });
    const click = (i: number) => {
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }
      selectRef.current(i);
    };
    Array.from(track.children).forEach((el, i) => el.addEventListener("click", () => click(i)));
    updateBounds();
    return () => {
      drag[0].kill();
      if (cruiseRef.current != null) window.clearInterval(cruiseRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCruise = () => {
    if (cruiseRef.current != null) {
      window.clearInterval(cruiseRef.current);
      cruiseRef.current = null;
      setCruise(false);
    }
  };
  const startCruise = () => {
    stopCruise();
    setCruise(true);
    cruiseRef.current = window.setInterval(() => {
      selectRef.current((activeRef.current + 1) % items.length);
    }, 2600);
  };
  const toggleCruise = () => (cruiseRef.current != null ? stopCruise() : startCruise());
  const toggleMode = () =>
    setMode3d((m) => {
      const next = !m;
      stageRef.current?.classList.toggle("is-3d", next);
      return next;
    });
  const reset = () => {
    stopCruise();
    select(0);
  };

  return (
    <div className="glass ring-wrap">
      <div className="ring-toolbar">
        <button className={"tab" + (mode3d ? " is-active" : "")} onClick={toggleMode}>
          3D 环境
        </button>
        <button className={"tab" + (cruise ? " cruise-on" : "")} onClick={toggleCruise}>
          自动巡航
        </button>
        <button className="tab" onClick={reset}>
          复位视角
        </button>
        <span className="sub" style={{ marginLeft: "auto", fontSize: 12 }}>
          按住拖动 · 点击卡片聚焦
        </span>
      </div>
      <div className={"ring-stage" + (mode3d ? " is-3d" : "")} ref={stageRef}>
        <div className="ring-track" ref={trackRef}>
          {items.map((n, i) => (
            <div
              key={n.t}
              className={"ring-card" + (i === active ? " is-active" : " is-dim")}
            >
              <div className={"card-glow " + n.grad} />
              <strong>{n.t}</strong>
              <span>
                {n.cat} · {n.status} · {n.pri}优先级
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="ring-hint">按住拖动卡片环，点击卡片聚焦到右侧详情。</p>
    </div>
  );
}
