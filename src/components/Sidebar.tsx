import { NavLink } from "react-router-dom";
import { Article, ChartLineUp, CookingPot, GearSix, Graph, House, Sparkle, UserCircle } from "@phosphor-icons/react";
import { site } from "../data/site";

const items = [
  { to: "/", label: "首页", icon: House },
  { to: "/study", label: "学习进度", icon: ChartLineUp },
  { to: "/blog", label: "博客", icon: Article },
  { to: "/recipes", label: "食谱", icon: CookingPot },
  { to: "/knowledge", label: "知识库", icon: Graph },
  { to: "/resume", label: "简历", icon: UserCircle },
  { to: "/settings", label: "设置", icon: GearSix },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="star-mark">
          <Sparkle size={18} weight="fill" color="#72d7ff" />
        </div>
        <div>
          <b>{site.title}</b>
          <small>{site.handle} · personal</small>
        </div>
      </div>
      <nav className="nav" aria-label="主导航">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => "nav-btn" + (isActive ? " is-active" : "")}
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <b>AI 学习导师维护</b>
        <br />
        数据源：Obsidian 精选 + cyber-mentor
      </div>
    </aside>
  );
}
