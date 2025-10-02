import React from "react";
import { Chatbot, type ChatbotProps } from "./Chatbot";
import createShadowRoot from "./createShadowRoot";
import cssText from "../src/index.css?inline";
import { ShadowRootProvider } from "@/providers/ShadowRootProvider";

type SqliteAiChatbotConfig = {
  containerId: string;
} & ChatbotProps;

class SqliteAiChatbotWidget {
  init(config: SqliteAiChatbotConfig): void {
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
          React.createElement(Chatbot, chatbotProps)
        )
      );
    } catch (error) {
      console.error("SqliteAi Chatbot: Failed to initialize", error);
    }
  }
}

const chatbotWidget = new SqliteAiChatbotWidget();

declare global {
  interface Window {
    SqliteAiChatbot: SqliteAiChatbotWidget;
  }
  var SqliteAiChatbot: SqliteAiChatbotWidget | undefined;
}

if (typeof window !== "undefined") {
  window.SqliteAiChatbot = chatbotWidget;
}
if (typeof globalThis !== "undefined") {
  globalThis.SqliteAiChatbot = chatbotWidget;
}

export default chatbotWidget;
