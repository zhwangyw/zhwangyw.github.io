import { useState } from "react";
import { Modal } from "./Modals";
import { ICON_KEYS, ROAD_ICONS } from "../lib/icons";
import type { RoadStyle } from "../lib/store";

const GRADS = ["grad-klein", "grad-cyan", "grad-original", "grad-chrome", "grad-green", "grad-amber", "grad-pink", "grad-blue"];
const COLORS = ["#72d7ff", "#a56cff", "#e07aff", "#ff82d8", "#75ffc8", "#ffd07a", "#ff6531", "#ffffff"];

export default function StyleModal({
  initial,
  onSave,
  onClose,
}: {
  initial: RoadStyle;
  onSave: (s: RoadStyle) => void;
  onClose: () => void;
}) {
  const [style, setStyle] = useState<RoadStyle>(initial);

  return (
    <Modal eyebrow="STYLE" title="修改样式" onClose={onClose}>
      <div className="field">
        <label>渐变预设</label>
        <div className="style-grid">
          {GRADS.map((g) => (
            <button
              key={g}
              className={"style-swatch " + g + (style.grad === g ? " is-active" : "")}
              onClick={() => setStyle((s) => ({ ...s, grad: g }))}
              aria-label={g}
            />
          ))}
        </div>
      </div>
      <div className="field">
        <label>图标</label>
        <div className="icon-grid">
          {ICON_KEYS.map((k) => {
            const Icon = ROAD_ICONS[k];
            return (
              <button
                key={k}
                className={"icon-slot" + (style.icon === k ? " is-active" : "")}
                onClick={() => setStyle((s) => ({ ...s, icon: k }))}
                aria-label={k}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="field">
        <label>标签（可留空）</label>
        <input value={style.label} onChange={(e) => setStyle((s) => ({ ...s, label: e.target.value }))} placeholder="如：理论 / 实战 / 课题" />
      </div>
      <div className="field">
        <label>标签颜色</label>
        <div className="color-dots">
          {COLORS.map((c) => (
            <button
              key={c}
              className={"color-dot" + (style.labelColor === c ? " is-active" : "")}
              style={{ background: c }}
              onClick={() => setStyle((s) => ({ ...s, labelColor: c }))}
              aria-label={c}
            />
          ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={() => onSave(style)}>
        保存样式
      </button>
    </Modal>
  );
}
