import type { ReactNode } from "react";

export default function StatCard({ k, v, d }: { k: string; v: string; d?: ReactNode }) {
  return (
    <div className="glass stat-card">
      <div className="k">{k}</div>
      <div className="v num">{v}</div>
      {d ? <div className="d">{d}</div> : null}
    </div>
  );
}
