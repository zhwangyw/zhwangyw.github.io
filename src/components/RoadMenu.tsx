import { useEffect, useRef } from "react";

export default function RoadMenu({
  x,
  y,
  onClose,
  onRename,
  onStyle,
  onTasks,
  onDelete,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onStyle: () => void;
  onTasks: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="road-menu" ref={ref} style={{ left: Math.max(8, Math.min(x, innerWidth - 170)), top: Math.max(8, y) }}>
      <button className="road-menu-item" onClick={onRename}>
        重命名
      </button>
      <button className="road-menu-item" onClick={onStyle}>
        修改样式
      </button>
      <button className="road-menu-item" onClick={onTasks}>
        修改进度
      </button>
      <button className="road-menu-item danger" onClick={onDelete}>
        删除
      </button>
    </div>
  );
}
