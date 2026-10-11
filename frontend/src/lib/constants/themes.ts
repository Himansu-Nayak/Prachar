/**
 * PRACHAR Brand & Phygital Card Theme Palette
 *
 * Curated palette reflecting Odisha cultural heritage and modern dark luxury aesthetics.
 */

export interface ThemeColorOption {
  name: string;
  value: string;
  border?: string;
  previewClass?: string;
}

export const THEME_COLORS: ThemeColorOption[] = [
  { name: "Slate Navy", value: "#0F172A", border: "border-slate-500", previewClass: "bg-slate-900" },
  { name: "Odisha Saffron", value: "#EA580C", border: "border-orange-500", previewClass: "bg-orange-600" },
  { name: "Emerald Forest", value: "#059669", border: "border-emerald-500", previewClass: "bg-emerald-600" },
  { name: "Crimson Rose", value: "#E11D48", border: "border-rose-500", previewClass: "bg-rose-600" },
  { name: "Royal Purple", value: "#7C3AED", border: "border-purple-500", previewClass: "bg-purple-600" },
  { name: "Amber Gold", value: "#D97706", border: "border-amber-500", previewClass: "bg-amber-600" },
];

export const DEFAULT_THEME_COLOR = THEME_COLORS[0].value;
export const CULTURAL_GOLD = "#FFB703";
export const ODISHA_SAFFRON = "#EA580C";
