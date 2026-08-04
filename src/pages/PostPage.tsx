import { Link, useParams } from "react-router-dom";
import Markdown from "../components/Markdown";
import { postBySlug } from "../lib/content";

export default function PostPage() {
  const { slug } = useParams();
  const post = slug ? postBySlug(slug) : undefined;
  if (!post) {
    return (
      <div className="page">
        <h1>文章不存在</h1>
        <p className="sub">
          <Link to="/blog">返回博客列表</Link>
        </p>
      </div>
    );
  }
  return (
    <div className="page">
      <p className="eyebrow">blog / {post.slug}</p>
      <h1>{post.title}</h1>
      <p className="sub" style={{ margin: "10px 0 20px" }}>
        {post.date}
        {post.tags.map((t) => (
          <span className="tag-pill" key={t} style={{ marginLeft: 8 }}>
            {t}
          </span>
        ))}
      </p>
      <div className="glass" style={{ padding: "24px 26px" }}>
        <Markdown>{post.markdown}</Markdown>
      </div>
      <p className="sub" style={{ marginTop: 18 }}>
        <Link to="/blog">← 返回博客列表</Link>
      </p>
    </div>
  );
}
