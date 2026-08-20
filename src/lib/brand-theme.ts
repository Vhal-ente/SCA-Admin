export const DEFAULT_BRAND_COLOR = "#32D9BC";
export const BRAND_COLOR_STORAGE_KEY = "sca-primary-brand-color";

export function normalizeHexColor(value: string) {
  const compact = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(compact)) {
    return `#${compact.split("").map(character => character.repeat(2)).join("")}`.toUpperCase();
  }
  return /^[0-9a-fA-F]{6}$/.test(compact) ? `#${compact.toUpperCase()}` : null;
}

function hexToRgb(hex: string) {
  return {
    red: parseInt(hex.slice(1, 3), 16),
    green: parseInt(hex.slice(3, 5), 16),
    blue: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const channels = [red, green, blue].map(channel => channel / 255);
  const maximum = Math.max(...channels);
  const minimum = Math.min(...channels);
  const lightness = (maximum + minimum) / 2;
  const delta = maximum - minimum;
  let hue = 0;

  if (delta !== 0) {
    if (maximum === channels[0]) hue = ((channels[1] - channels[2]) / delta) % 6;
    else if (maximum === channels[1]) hue = (channels[2] - channels[0]) / delta + 2;
    else hue = (channels[0] - channels[1]) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

function relativeLuminance(red: number, green: number, blue: number) {
  const [r, g, b] = [red, green, blue].map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function applyBrandColor(value: string) {
  const normalized = normalizeHexColor(value);
  if (!normalized || typeof document === "undefined") return null;

  const rgb = hexToRgb(normalized);
  const hsl = rgbToHsl(rgb.red, rgb.green, rgb.blue);
  const foreground = relativeLuminance(rgb.red, rgb.green, rgb.blue) > 0.179 ? "0 0% 4%" : "0 0% 98%";
  const root = document.documentElement;

  root.style.setProperty("--primary", hsl);
  root.style.setProperty("--ring", hsl);
  root.style.setProperty("--sidebar-primary", hsl);
  root.style.setProperty("--sidebar-ring", hsl);
  root.style.setProperty("--primary-foreground", foreground);
  root.style.setProperty("--sidebar-primary-foreground", foreground);
  return normalized;
}

export function getSavedBrandColor() {
  if (typeof window === "undefined") return DEFAULT_BRAND_COLOR;
  return normalizeHexColor(window.localStorage.getItem(BRAND_COLOR_STORAGE_KEY) ?? "") ?? DEFAULT_BRAND_COLOR;
}

export function saveBrandColor(value: string) {
  const normalized = applyBrandColor(value);
  if (normalized && typeof window !== "undefined") {
    window.localStorage.setItem(BRAND_COLOR_STORAGE_KEY, normalized);
  }
  return normalized;
}
