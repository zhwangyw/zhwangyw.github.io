import { BookOpen, ChartLineUp, Code, Cpu, Flask, Lightning, NotePencil, Star, type Icon } from "@phosphor-icons/react";

export const ROAD_ICONS: Record<string, Icon> = {
  book: BookOpen,
  bolt: Lightning,
  flask: Flask,
  code: Code,
  trend: ChartLineUp,
  star: Star,
  cpu: Cpu,
  pencil: NotePencil,
};

export const ICON_KEYS = Object.keys(ROAD_ICONS);
