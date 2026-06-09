import React from "react";
import {
  DocsChatbot,
  type DocsChatbotPersistence,
  type DocsChatbotProps,
} from "./DocsChatbot";
import createShadowRoot from "./createShadowRoot";
import cssText from "../src/index.css?inline";
import { ShadowRootProvider } from "@/providers/ShadowRootProvider";
import type { DocumentSearchResult } from "@/types/chat";

class DocsChatbotElement extends HTMLElement {
  private root: ReturnType<typeof createShadowRoot>["root"] | null = null;
  private portalContainer: HTMLDivElement | null = null;
  private _open = false;

  static get observedAttributes() {
    return [
      "search-url",
      "api-key",
      "title",
      "empty-state-title",
      "empty-state-description",
      "persistence-key",
      "persistence-storage",
      "result-snippet-max-lines",
      "result-snippet-max-chars",
      "show-clear-button",
      "variant",
      "trigger",
    ];
  }

  // Public property for controlling open state
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    const oldValue = this._open;
    this._open = value;

    if (oldValue !== value) {
      // Dispatch custom event
      this.dispatchEvent(
        new CustomEvent("openchange", {
          detail: { open: value },
          bubbles: true,
          composed: true,
        })
      );

      // Re-render if connected
      if (this.root) {
        this.render();
      }
    }
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
    const persistenceKey = this.getAttribute("persistence-key");
    const persistenceStorage = this.getAttribute("persistence-storage");
    const resultSnippetMaxLines = this.getAttribute("result-snippet-max-lines");
    const resultSnippetMaxChars = this.getAttribute("result-snippet-max-chars");
    const showClearButton = this.getAttribute("show-clear-button");
    const variant = this.getAttribute("variant");
    const trigger = this.getAttribute("trigger") as "default" | "custom" | null;

    if (!searchUrl || !apiKey || !title) {
      console.error(
        "SqliteAi Chatbot: Missing required attributes (search-url, api-key, title)"
      );
      return;
    }

    const emptyState =
      emptyStateTitle && emptyStateDescription
        ? {
            title: emptyStateTitle,
            description: emptyStateDescription,
          }
        : undefined;

    const persistence: DocsChatbotPersistence | undefined = persistenceKey
      ? {
          key: persistenceKey,
          storage: persistenceStorage === "local" ? "local" : "session",
        }
      : undefined;

    const header =
      showClearButton === null
        ? undefined
        : {
            showClearButton:
              showClearButton === "" || showClearButton === "true",
          };

    const results = {
      onSelect: (result: DocumentSearchResult) => {
        const event = new CustomEvent("resultselect", {
          detail: result,
          bubbles: true,
          composed: true,
          cancelable: true,
        });

        const shouldContinue = this.dispatchEvent(event);

        if (shouldContinue && !event.defaultPrevented) {
          window.open(result.url, "_blank");
        }
      },
      ...(resultSnippetMaxLines !== null &&
        Number.isFinite(Number(resultSnippetMaxLines)) && {
          snippetMaxLines: Number(resultSnippetMaxLines),
        }),
      ...(resultSnippetMaxChars !== null &&
        Number.isFinite(Number(resultSnippetMaxChars)) && {
          snippetMaxChars: Number(resultSnippetMaxChars),
        }),
    };

    const chatbotProps: DocsChatbotProps =
      variant === "embedded"
        ? {
            search: {
              url: searchUrl,
              apiKey,
            },
            title,
            variant: "embedded",
            emptyState,
            persistence,
            header,
            results,
          }
        : trigger === "custom"
          ? {
              search: {
                url: searchUrl,
                apiKey,
              },
              title,
              dialog: {
                trigger: "custom",
                open: this._open,
                onOpenChange: (open: boolean) => {
                  this.open = open;
                },
              },
              emptyState,
              persistence,
              header,
              results,
            }
          : {
              search: {
                url: searchUrl,
                apiKey,
              },
              title,
              emptyState,
              persistence,
              header,
              results,
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
