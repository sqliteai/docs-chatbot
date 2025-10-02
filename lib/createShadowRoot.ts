import { createRoot } from "react-dom/client";

/**
 * Creates a shadow root with the specified styles and returns a React root in it.
 * @param {HTMLElement} container - Container element to attach shadow root to.
 * @param {string} styles - CSS styles to be applied to the shadow root.
 * @returns {Object} - Object containing the React root and shadow root element.
 */
export default function createShadowRoot(
  container: HTMLElement,
  styles: string
) {
  // Attach a shadow root to the container element
  const shadow = container.attachShadow({ mode: "open" });

  // Create a new CSS style sheet and apply the specified styles
  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(styles);

  // Apply the style sheet to the shadow root
  shadow.adoptedStyleSheets = [globalStyleSheet];

  // Return a React root created inside the shadow root and the shadow element
  return {
    root: createRoot(shadow),
    shadow,
  };
}
