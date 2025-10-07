import React from "react";
import { DocsChatbot, type DocsChatbotProps } from "./DocsChatbot";
import createShadowRoot from "./createShadowRoot";
import cssText from "../src/index.css?inline";
import { ShadowRootProvider } from "@/providers/ShadowRootProvider";

class DocsChatbotElement extends HTMLElement {
  private root: ReturnType<typeof createShadowRoot>["root"] | null = null;
  private portalContainer: HTMLDivElement | null = null;

  static get observedAttributes() {
    return [
      "search-url",
      "api-key",
      "title",
      "empty-state-title",
      "empty-state-description",
    ];
  }

  connectedCallback() {
    try {
      const { root, shadow } = createShadowRoot(this, cssText);
      this.root = root;

      const portalContainer = document.createElement("div");
      portalContainer.id = "portal-container";
      this.portalContainer = portalContainer;
      shadow.appendChild(portalContainer);

      this.render();
    } catch (error) {
      console.error("SqliteAi Chatbot: Failed to initialize", error);
    }
  }

  attributeChangedCallback() {
    if (this.root) {
      this.render();
    }
  }

  private render() {
    if (!this.root || !this.portalContainer) return;

    const searchUrl = this.getAttribute("search-url");
    const apiKey = this.getAttribute("api-key");
    const title = this.getAttribute("title");
    const emptyStateTitle = this.getAttribute("empty-state-title");
    const emptyStateDescription = this.getAttribute("empty-state-description");

    if (!searchUrl || !apiKey || !title) {
      console.error(
        "SqliteAi Chatbot: Missing required attributes (search-url, api-key, title)"
      );
      return;
    }

    const chatbotProps: DocsChatbotProps = {
      searchUrl,
      apiKey,
      title,
      ...(emptyStateTitle &&
        emptyStateDescription && {
          emptyState: {
            title: emptyStateTitle,
            description: emptyStateDescription,
          },
        }),
    };

    this.root.render(
      React.createElement(
        ShadowRootProvider,
        { value: this.portalContainer },
        React.createElement(DocsChatbot, chatbotProps)
      )
    );
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
      this.portalContainer = null;
    }
  }
}

if (typeof window !== "undefined" && !customElements.get("docs-chatbot")) {
  customElements.define("docs-chatbot", DocsChatbotElement);
}

export default DocsChatbotElement;
