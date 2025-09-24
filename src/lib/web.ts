import React from "react";
import { createRoot } from "react-dom/client";
import { Chatbot } from "./Chatbot";
import cssText from "../index.css?inline";

interface SqliteAiChatbotConfig {
  containerId: string;
}

class SqliteAiChatbotWidget {
  private injectCSS(): void {
    if (
      typeof document !== "undefined" &&
      !document.querySelector("[data-sqlitecloud-widget-css]")
    ) {
      const styleElement = document.createElement("style");
      styleElement.setAttribute("data-sqlitecloud-widget-css", "");
      styleElement.textContent = cssText;
      document.head.appendChild(styleElement);
    }
  }

  init(config: SqliteAiChatbotConfig): void {
    // Inject CSS first
    this.injectCSS();

    const { containerId } = config;

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `SqliteAi Chatbot: Container with id "${containerId}" not found`
      );
      return;
    }

    try {
      const root = createRoot(container);
      root.render(React.createElement(Chatbot, null));
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
