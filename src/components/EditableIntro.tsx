import { useState } from "react";
import { PencilSimple } from "@phosphor-icons/react";
import { useStore } from "../lib/store";

export default function EditableIntro({ page, defaultText }: { page: string; defaultText: string }) {
  const { intros, setIntro, toast } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const text = intros[page] ?? defaultText;

  const start = () => {
    setDraft(text);
    setEditing(true);
  };
  const save = () => {
    const v = draft.trim();
    if (v) setIntro(page, v);
    else toast("介绍不能为空");
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        className="intro-edit"
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        onBlur={save}
      />
    );
  }
  return (
    <p className="sub editable-intro" onClick={start} title="点击编辑介绍">
      {text}
      <span className="intro-edit-hint">
        <PencilSimple size={12} weight="bold" />
      </span>
    </p>
  );
}
