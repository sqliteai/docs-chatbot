import { createRoot } from "react-dom/client";

/**
 * Creates a shadow root with the specified styles and returns a React root in it.
 *
 * @param {HTMLElement} container - Container element to attach shadow root to.
 * @param {string} styles - CSS styles to be applied to the shadow root.
 * @returns {Object} - Object containing the React root and shadow root element.
 */
export default function createShadowRoot(
  container: HTMLElement,
  styles: string
) {
  const shadow = container.attachShadow({ mode: "open" });

  // Try using adoptedStyleSheets (modern browsers) or fallback to <style> tag (Safari compatibility)
  try {
    if (shadow.adoptedStyleSheets !== undefined) {
      const globalStyleSheet = new CSSStyleSheet();
      globalStyleSheet.replaceSync(styles);
      shadow.adoptedStyleSheets = [globalStyleSheet];
    } else {
      throw new Error("adoptedStyleSheets not supported");
    }
  } catch {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    shadow.appendChild(styleElement);
  }

  return {
    root: createRoot(shadow),
    shadow,
  };
}
