import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialRoadmap } from "../data/roadmap";
import { initialRecipes } from "../data/recipes";
import { initialLinkCards } from "../data/linkCards";

export type TaskItem = { id: string; text: string; done: boolean };
export type RoadStyle = { grad: string; icon: string; label: string; labelColor: string };
export type RoadItem = {
  id: string;
  t: string;
  phase: number;
  tasks: TaskItem[];
  style: RoadStyle;
};
export type Recipe = {
  t: string;
  cat: string;
  time: string;
  level: string;
  ics: string[];
  fire?: string[];
  steps: string[];
  link?: string;
  tip?: string;
};
export type LinkCard = { t: string; platform: string; link: string; points: string[] };

type Store = {
  toast: (msg: string) => void;
  roadmap: RoadItem[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadItem[]>>;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  linkCards: LinkCard[];
  setLinkCards: React.Dispatch<React.SetStateAction<LinkCard[]>>;
  studyDocs: Record<string, string>;
  setStudyDoc: (slug: string, md: string) => void;
  settings: Record<string, string>;
  saveSettings: (s: Record<string, string>) => void;
};

const Ctx = createContext<Store | null>(null);

function usePersistent<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v]);
  return [v, setV] as const;
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random());
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [roadmap, setRoadmap] = usePersistent<RoadItem[]>("ks-roadmap-v2", initialRoadmap);
  const [recipes, setRecipes] = usePersistent<Recipe[]>("ks-recipes-v1", initialRecipes);
  const [linkCards, setLinkCards] = usePersistent<LinkCard[]>("ks-linkcards-v1", initialLinkCards);
  const [studyDocs, setStudyDocs] = usePersistent<Record<string, string>>("ks-studydocs-v1", {});
  const [settings, setSettings] = usePersistent<Record<string, string>>("ks-settings-v1", {});
  const timer = useRef<number | undefined>(undefined);
  const [msg, setMsg] = useState("");

  const toast = (m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(""), 1800);
  };
  const saveSettings = (s: Record<string, string>) => {
    setSettings({ ...settings, ...s });
    toast("设置已保存到本机");
  };
  const setStudyDoc = (slug: string, md: string) => {
    setStudyDocs((prev) => ({ ...prev, [slug]: md }));
    toast("已保存到本机");
  };

  return (
    <Ctx.Provider
      value={{ toast, roadmap, setRoadmap, recipes, setRecipes, linkCards, setLinkCards, studyDocs, setStudyDoc, settings, saveSettings }}
    >
      {children}
      <div className={"toast" + (msg ? " show" : "")}>{msg || " "}</div>
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used within StoreProvider");
  return s;
}
