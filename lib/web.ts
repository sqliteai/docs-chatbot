import React from "react";
import { DocsChatbot, type DocsChatbotProps } from "./DocsChatbot";
import createShadowRoot from "./createShadowRoot";
import cssText from "../src/index.css?inline";
import { ShadowRootProvider } from "@/providers/ShadowRootProvider";

type DocsChatbotConfig = {
  containerId: string;
} & DocsChatbotProps;

class DocsChatbotWidget {
  init(config: DocsChatbotConfig): void {
    const { containerId, ...chatbotProps } = config;

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `SqliteAi Chatbot: Container with id "${containerId}" not found`
      );
      return;
    }

    try {
      const { root, shadow } = createShadowRoot(container, cssText);

      // Create portal container for dialogs inside shadow root
      const portalContainer = document.createElement("div");
      portalContainer.id = "portal-container";
      shadow.appendChild(portalContainer);

      root.render(
        React.createElement(
          ShadowRootProvider,
          { value: portalContainer },
          React.createElement(DocsChatbot, chatbotProps)
        )
      );
    } catch (error) {
      console.error("SqliteAi Chatbot: Failed to initialize", error);
    }
  }
}

const chatbotWidget = new DocsChatbotWidget();

declare global {
  interface Window {
    DocsChatbot: DocsChatbotWidget;
  }
  var DocsChatbot: DocsChatbotWidget | undefined;
}

if (typeof window !== "undefined") {
  window.DocsChatbot = chatbotWidget;
}
if (typeof globalThis !== "undefined") {
  globalThis.DocsChatbot = chatbotWidget;
}

export default chatbotWidget;
