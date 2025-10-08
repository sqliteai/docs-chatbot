import { DocsChatbot } from "../../../dist/esm/index.esm.js";
import "./styles.css";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState<"default" | "custom">("default");
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      {/* Header with mode switcher */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem"
      }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Chatbot Demo
          </h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setMode("default")}
              style={{
                padding: "0.5rem 1rem",
                border: mode === "default" ? "2px solid #000" : "1px solid #ccc",
                background: mode === "default" ? "#000" : "#fff",
                color: mode === "default" ? "#fff" : "#000",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Default Trigger
            </button>
            <button
              onClick={() => setMode("custom")}
              style={{
                padding: "0.5rem 1rem",
                border: mode === "custom" ? "2px solid #000" : "1px solid #ccc",
                background: mode === "custom" ? "#000" : "#fff",
                color: mode === "custom" ? "#fff" : "#000",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Custom Trigger
            </button>
          </div>
        </div>

        {/* Custom trigger button (only shows in custom mode) */}
        {mode === "custom" && (
          <button
            onClick={() => setOpen(true)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              background: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>❓</span>
            Help & Support
          </button>
        )}
      </div>

      {/* Chatbot */}
      {mode === "default" ? (
        <DocsChatbot
          searchUrl={import.meta.env.VITE_SEARCH_API_URL}
          apiKey={import.meta.env.VITE_SEARCH_API_KEY}
          title="SQLite Cloud Docs"
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      ) : (
        <DocsChatbot
          searchUrl={import.meta.env.VITE_SEARCH_API_URL}
          apiKey={import.meta.env.VITE_SEARCH_API_KEY}
          title="SQLite Cloud Docs"
          trigger="custom"
          open={open}
          onOpenChange={setOpen}
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      )}
    </div>
  );
}

export default App;
