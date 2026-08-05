import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";

export type ChatMsg = { role: "user" | "assistant"; content: string; done?: boolean };

const wsUrl = (apiBase: string) =>
  apiBase
    .trim()
    .replace(/\/+$/, "")
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:") + "/api/v1/ws";

export default function DeepTutorChat({ apiBase }: { apiBase: string }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const sessionRef = useRef("");
  const wsRef = useRef<WebSocket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking]);

  const patchLast = (fn: (m: ChatMsg) => ChatMsg) =>
    setMsgs((prev) => {
      if (!prev.length) return prev;
      const copy = prev.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError("");
    setBusy(true);
    setThinking(true);
    setMsgs((prev) => [
      ...prev,
      { role: "user", content: text, done: true },
      { role: "assistant", content: "", done: false },
    ]);

    let acc = "";
    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl(apiBase));
    } catch {
      setError("DeepTutor API 地址无效，请检查设置");
      setBusy(false);
      setThinking(false);
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "message",
          capability: "chat",
          content: text,
          language: "zh",
          ...(sessionRef.current ? { session_id: sessionRef.current } : {}),
        })
      );
    };

    ws.onmessage = (e) => {
      let ev: Record<string, any>;
      try {
        ev = JSON.parse(String(e.data));
      } catch {
        return;
      }
      const meta = ev.metadata || {};
      if (ev.type === "session") {
        const sid = meta.session_id || ev.session_id;
        if (sid) sessionRef.current = sid;
      } else if (ev.type === "content" && typeof ev.content === "string") {
        acc += ev.content;
        setThinking(false);
        patchLast((m) => ({ ...m, content: acc }));
      } else if (ev.type === "stage_start") {
        setThinking(true);
      } else if (ev.type === "error") {
        setError(typeof ev.content === "string" ? ev.content : "DeepTutor 返回错误");
        setBusy(false);
        setThinking(false);
        patchLast((m) => ({ ...m, done: true }));
        try {
          ws.close();
        } catch {
          /* ignore */
        }
      }
      if (meta.turn_terminal) {
        setBusy(false);
        setThinking(false);
        patchLast((m) => ({ ...m, done: true }));
        try {
          ws.close();
        } catch {
          /* ignore */
        }
      }
    };

    ws.onerror = () => {
      setError("无法连接 DeepTutor API，请确认后端已启动");
      setBusy(false);
      setThinking(false);
      patchLast((m) => ({ ...m, done: true }));
    };
    ws.onclose = () => {
      wsRef.current = null;
    };
  };

  const clear = () => {
    setMsgs([]);
    sessionRef.current = "";
    setError("");
  };

  return (
    <div className="glass tutor-card dt-chat">
      <div className="panel-head-row">
        <h3>在线辅导（直连 API）</h3>
        <div className="btn-row">
          <span className="tag-pill">{busy ? "思考中" : msgs.length ? "已连接" : "就绪"}</span>
          <button className="mini-btn" onClick={clear} disabled={!msgs.length}>
            清空
          </button>
        </div>
      </div>

      <div className="chat-scroll">
        {msgs.length === 0 && (
          <p className="sub chat-empty">问任何学习问题，DeepTutor 会带着引用和步骤回答你。</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={"chat-msg " + (m.role === "user" ? "chat-user" : "chat-assistant")}>
            {m.role === "user" ? (
              <span className="chat-bubble chat-bubble-user">{m.content}</span>
            ) : m.done ? (
              <div className="chat-md">
                <Markdown>{m.content || "（空回复）"}</Markdown>
              </div>
            ) : (
              <span className="chat-bubble chat-bubble-ai">
                {m.content || (thinking ? "思考中…" : "")}
                <span className="caret" />
              </span>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {error && <p className="chat-error">{error}</p>}

      <div className="chat-input-row">
        <input
          className="link-input"
          value={input}
          placeholder="输入问题，例如：帮我解释反向传播"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={busy}
        />
        <button className="btn btn-primary" onClick={send} disabled={busy || !input.trim()}>
          发送
        </button>
      </div>
      <p className="setting-note">WebSocket 直连 DeepTutor API：{apiBase}</p>
    </div>
  );
}
