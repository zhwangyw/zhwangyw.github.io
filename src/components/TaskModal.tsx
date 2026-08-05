import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modals";
import { generateTasks } from "../lib/llm";
import { newId, useStore, type RoadItem, type TaskItem } from "../lib/store";

export default function TaskModal({
  item,
  autoFocusAdd,
  onSave,
  onClose,
}: {
  item: RoadItem;
  autoFocusAdd?: boolean;
  onSave: (tasks: TaskItem[]) => void;
  onClose: () => void;
}) {
  const { toast, settings } = useStore();
  const [tasks, setTasks] = useState<TaskItem[]>(item.tasks);
  const [draft, setDraft] = useState("");
  const [generating, setGenerating] = useState(false);
  const addRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusAdd) {
      window.setTimeout(() => addRef.current?.focus(), 50);
    }
  }, [autoFocusAdd]);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: newId(), text, done: false }]);
    setDraft("");
  };
  const toggle = (id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const aiGenerate = async () => {
    setGenerating(true);
    try {
      const list = await generateTasks(item.t, settings);
      if (!list.length) throw new Error("生成结果为空");
      setTasks((t) => [...t, ...list.map((text) => ({ id: newId(), text, done: false }))]);
      toast("已生成 " + list.length + " 条子任务");
    } catch (e) {
      toast(e instanceof Error ? e.message : "生成失败，请手动添加");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal eyebrow="TASKS" title="修改进度 · 子任务" onClose={onClose}>
      <p className="sub" style={{ fontSize: 13, marginBottom: 12 }}>
        进度 = 已完成子任务 / 总子任务。可手动增删勾选，或用大模型一键生成。
      </p>
      <div className="btn-row" style={{ marginBottom: 10 }}>
        <button className="mini-btn" onClick={aiGenerate} disabled={generating}>
          {generating ? "生成中…" : "✨ AI 生成子任务"}
        </button>
        <button className="mini-btn" onClick={() => setTasks((t) => t.map((x) => ({ ...x, done: true })))}>
          全部完成
        </button>
      </div>
      {tasks.map((t) => (
        <div className="task-row" key={t.id}>
          <button className={"box" + (t.done ? " done" : "")} onClick={() => toggle(t.id)} aria-label="勾选">
            {t.done ? "✓" : ""}
          </button>
          <span className={t.done ? "done-text" : ""} style={{ flex: 1 }}>
            {t.text}
          </span>
          <button className="mini-btn danger" onClick={() => remove(t.id)}>
            删
          </button>
        </div>
      ))}
      <div className="task-add">
        <input
          ref={addRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="添加子任务，回车确认"
        />
        <button className="mini-btn" onClick={add}>
          添加
        </button>
      </div>
      <div className="gen-actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" onClick={() => onSave(tasks)}>
          保存进度
        </button>
      </div>
    </Modal>
  );
}
