import { useState } from "react";
import Markdown from "./Markdown";

export default function MdEditor({
  content,
  onSave,
}: {
  content: string;
  onSave: (md: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  const start = () => {
    setDraft(content);
    setEditing(true);
  };
  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="md-editor">
      <div className="btn-row" style={{ marginBottom: 10 }}>
        {editing ? (
          <>
            <button className="mini-btn" onClick={save}>
              保存
            </button>
            <button className="mini-btn" onClick={() => setEditing(false)}>
              取消
            </button>
          </>
        ) : (
          <button className="mini-btn" onClick={start}>
            编辑
          </button>
        )}
      </div>
      {editing ? (
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
      ) : content ? (
        <Markdown>{content}</Markdown>
      ) : (
        <p className="sub" style={{ margin: 0 }}>
          暂无内容。
        </p>
      )}
    </div>
  );
}
