import { mountTikkaWidget } from "./core-widget.js";
import type { Size, Theme, WidgetConfig } from "./types.js";

interface ScriptTagConfig {
  market: string;
  window: string;
  theme?: Theme;
  size?: Size;
}

function toWidgetConfig(input: ScriptTagConfig): WidgetConfig {
  return {
    market: input.market,
    window: input.window,
    theme: input.theme ?? "auto",
    size: input.size ?? "compact",
  };
}

function mount(element: Element, config: ScriptTagConfig): void {
  mountTikkaWidget(element, toWidgetConfig(config));
}

function readTheme(value: string | null): Theme {
  if (value === "light" || value === "dark" || value === "auto") {
    return value;
  }
  return "auto";
}

function readSize(value: string | null): Size {
  if (value === "compact" || value === "full") {
    return value;
  }
  return "compact";
}

function scanAndMount(): void {
  const elements = document.querySelectorAll("[data-tikka]");
  elements.forEach((element) => {
    if (element.hasAttribute("data-tikka-mounted")) {
      return;
    }
    const market = element.getAttribute("data-market");
    const windowLabel = element.getAttribute("data-window");
    if (!market || !windowLabel) {
      return;
    }
    element.setAttribute("data-tikka-mounted", "true");
    mount(element, {
      market,
      window: windowLabel,
      theme: readTheme(element.getAttribute("data-theme")),
      size: readSize(element.getAttribute("data-size")),
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scanAndMount);
} else {
  scanAndMount();
}

export { mount };
