import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <p className="eyebrow">404</p>
      <h1>这颗星星不存在</h1>
      <p className="sub">
        <Link to="/">返回首页</Link>
      </p>
    </div>
  );
}
