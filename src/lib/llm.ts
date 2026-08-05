export async function generateTasks(title: string, settings: Record<string, string>): Promise<string[]> {
  const base = (settings.llmBase || "").trim();
  const key = (settings.llmKey || "").trim();
  const model = (settings.llmModel || "").trim() || "deepseek-chat";
  if (!base || !key) throw new Error("未配置大模型 API（设置页）");
  const url = base.replace(/\/+$/, "") + "/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "你是学习规划助手。把任务拆解成 3-8 条可勾选的子任务，只返回 JSON 数组字符串（如 [\"子任务1\",\"子任务2\"]），不要输出任何多余文字。",
        },
        { role: "user", content: "任务：" + title },
      ],
    }),
  });
  if (!res.ok) throw new Error("API 请求失败：" + res.status);
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  const m = content.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("无法解析返回内容");
  const parsed = JSON.parse(m[0]);
  if (!Array.isArray(parsed)) throw new Error("返回格式错误");
  return parsed.map((s: unknown) => String(s).trim()).filter(Boolean);
}
