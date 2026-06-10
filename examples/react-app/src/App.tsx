import { DocsChatbot } from "../../../dist/esm/index.esm.js";
import "./styles.css";
import { useState } from "react";
import { MessageCircleMore, PanelRightClose } from "lucide-react";

const useRealSearch = import.meta.env.VITE_USE_REAL_SEARCH === "true";
const searchUrl = useRealSearch
  ? import.meta.env.VITE_SEARCH_API_URL || "mock://docs-chatbot"
  : "mock://docs-chatbot";
const apiKey = useRealSearch
  ? import.meta.env.VITE_SEARCH_API_KEY || "demo-key"
  : "demo-key";
const demoPersistenceVersion = "v2";

const demoFiles = [
  {
    id: "getting-started",
    title: "Getting Started",
    path: "docs/getting-started.md",
    content:
      "Create a project, add a database, and connect with the SQLite Cloud dashboard or client SDKs.",
  },
  {
    id: "edge-functions",
    title: "Edge Functions",
    path: "docs/edge-functions.md",
    content:
      "Deploy edge functions close to your data and call them securely with API keys or project-scoped credentials.",
  },
  {
    id: "vector-search",
    title: "Vector Search",
    path: "docs/vector-search.md",
    content:
      "Store embeddings in SQLite tables and run similarity search for semantic retrieval and AI-powered features.",
  },
  {
    id: "cloudsync",
    title: "CloudSync",
    path: "docs/cloudsync.md",
    content:
      "Sync local databases with SQLite Cloud, resolve conflicts, and keep offline-first apps up to date.",
  },
  {
    id: "auth-api-keys",
    title: "API Keys and Auth",
    path: "docs/auth/api-keys.md",
    content:
      "Generate API keys, scope access to projects, and rotate credentials for secure production deployments.",
  },
  {
    id: "memory-chat",
    title: "Memory Chat",
    path: "docs/memory/chat.md",
    content:
      "Index your content with sqlite-memory and expose a searchable chatbot experience with persistent conversation context.",
  },
] as const;

function App() {
  const [mode, setMode] = useState<"default" | "custom" | "embedded">(
    "embedded"
  );
  const [open, setOpen] = useState(false);
  const [isEmbeddedChatVisible, setIsEmbeddedChatVisible] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState<string>(
    demoFiles[0].id
  );
  const [lastSelectedResult, setLastSelectedResult] = useState<string | null>(
    null
  );
  const selectedFile =
    demoFiles.find((file) => file.id === selectedFileId) ?? demoFiles[0];

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
            <button
              onClick={() => {
                setMode("embedded");
                setIsEmbeddedChatVisible(true);
              }}
              style={{
                padding: "0.5rem 1rem",
                border:
                  mode === "embedded" ? "2px solid #000" : "1px solid #ccc",
                background: mode === "embedded" ? "#000" : "#fff",
                color: mode === "embedded" ? "#fff" : "#000",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Embedded Panel
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
          search={{ url: searchUrl, apiKey }}
          title="SQLite Cloud Docs"
          persistence={{ key: `docs-example-default-${demoPersistenceVersion}` }}
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      ) : mode === "custom" ? (
        <DocsChatbot
          search={{ url: searchUrl, apiKey }}
          title="SQLite Cloud Docs"
          dialog={{ trigger: "custom", open, onOpenChange: setOpen }}
          persistence={{ key: `docs-example-custom-${demoPersistenceVersion}` }}
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "220px minmax(0, 1fr) 520px",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              border: "1px solid #d9dee7",
              borderRadius: "12px",
              background: "#fff",
            }}
          >
            <div
              style={{
                padding: "0.75rem",
                borderBottom: "1px solid #d9dee7",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Files
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "0.5rem" }}>
              {demoFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  style={{
                    textAlign: "left",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem",
                    background: file.id === selectedFile.id ? "#f3f5fa" : "transparent",
                    color: file.id === selectedFile.id ? "#111" : "#6b7280",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#111" }}>{file.title}</div>
                  <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>{file.path}</div>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              overflow: "hidden",
              border: "1px solid #d9dee7",
              borderRadius: "12px",
              background: "#fff",
            }}
          >
            <div style={{ padding: "1rem", borderBottom: "1px solid #d9dee7" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{selectedFile.title}</div>
              <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#6b7280" }}>
                {selectedFile.path}
              </div>
            </div>
            <div style={{ padding: "1rem" }}>
              {lastSelectedResult && (
                <div
                  style={{
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(19,67,130,0.15)",
                    background: "rgba(19,67,130,0.05)",
                    fontSize: "0.875rem",
                  }}
                >
                  Opened from chatbot result: <strong>{lastSelectedResult}</strong>
                </div>
              )}
              <div style={{ fontSize: "2rem", fontWeight: 600 }}>{selectedFile.title}</div>
              <div
                style={{
                  marginTop: "1rem",
                  maxWidth: "42rem",
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  color: "#6b7280",
                }}
              >
                {selectedFile.content}
              </div>
            </div>
          </div>

          {isEmbeddedChatVisible ? (
            <DocsChatbot
              search={{ url: searchUrl, apiKey }}
              title="Memory Assistant"
              variant="embedded"
              style={{ height: "600px" }}
              persistence={{
                key: `docs-example-embedded-${demoPersistenceVersion}`,
              }}
              header={{
                icon: (
                  <MessageCircleMore
                    style={{ width: "1.25rem", height: "1.25rem", color: "#6988b6" }}
                  />
                ),
                label: (
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#22304a" }}>
                    memory.sqlite
                  </span>
                ),
                onClose: () => setIsEmbeddedChatVisible(false),
                closeButton: (
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      width: "2rem",
                      height: "2rem",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.5rem",
                      border: "1px solid #d6e2f4",
                      background: "#fff",
                      color: "#6988b6",
                      cursor: "pointer",
                    }}
                    aria-label="Collapse memory assistant"
                  >
                    <PanelRightClose
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                  </button>
                ),
                showClearButton: true,
              }}
              results={{
                snippetMaxLines: 10,
                snippetMaxChars: 900,
                onSelect: (result) => {
                  setLastSelectedResult(result.title);
                  const nextFileId = result.id;
                  if (demoFiles.some((file) => file.id === nextFileId)) {
                    setSelectedFileId(nextFileId);
                  }
                },
              }}
              emptyState={{
                title: "Ask questions about indexed memory",
                description: "",
              }}
            />
          ) : (
            <div
              style={{
                height: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed #d9dee7",
                borderRadius: "12px",
                background: "#fff",
              }}
            >
              <button
                onClick={() => setIsEmbeddedChatVisible(true)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #d9dee7",
                  background: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Reopen Memory Assistant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
