import { DocsChatbot } from "../lib/DocsChatbot";
import { useState } from "react";
import { Button } from "./components/ui/button";
import {
  CircleHelp,
  MessageCircleMore,
  PanelRightClose,
} from "lucide-react";

const useRealSearch = import.meta.env.VITE_USE_REAL_SEARCH === "true";
const searchUrl = useRealSearch
  ? ((import.meta.env.VITE_SEARCH_API_URL as string | undefined) ??
    "mock://docs-chatbot")
  : "mock://docs-chatbot";
const apiKey = useRealSearch
  ? ((import.meta.env.VITE_SEARCH_API_KEY as string | undefined) ?? "demo-key")
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
    <div className="dcb:min-h-screen dcb:p-8">
      <div className="dcb:flex dcb:items-center dcb:justify-between dcb:mb-8">
        <div>
          <h1 className="dcb:text-2xl dcb:font-bold dcb:mb-4">Chatbot Demo</h1>
          <div className="dcb:flex dcb:gap-4">
            <Button
              onClick={() => setMode("default")}
              variant={mode === "default" ? "default" : "outline"}
            >
              Default Trigger
            </Button>
            <Button
              onClick={() => setMode("custom")}
              variant={mode === "custom" ? "default" : "outline"}
            >
              Custom Trigger
            </Button>
            <Button
              onClick={() => {
                setMode("embedded");
                setIsEmbeddedChatVisible(true);
              }}
              variant={mode === "embedded" ? "default" : "outline"}
            >
              Embedded Panel
            </Button>
          </div>
        </div>

        {mode === "custom" && (
          <Button onClick={() => setOpen(true)} variant="outline" size="sm">
            <CircleHelp className="dcb:mr-2 dcb:h-4 dcb:w-4" />
            Help & Support
          </Button>
        )}
      </div>

      {mode === "default" ? (
        <DocsChatbot
          search={{ url: searchUrl, apiKey }}
          title="SQLite Cloud Docs"
          persistence={{ key: `docs-demo-default-${demoPersistenceVersion}` }}
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
          persistence={{ key: `docs-demo-custom-${demoPersistenceVersion}` }}
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      ) : (
        <div className="dcb:overflow-x-auto">
          <div className="dcb:grid dcb:min-w-[1240px] dcb:grid-cols-[220px_minmax(0,1fr)_520px] dcb:gap-4">
            <div className="dcb:overflow-hidden dcb:rounded-xl dcb:border dcb:border-border/80 dcb:bg-background">
              <div className="dcb:border-b dcb:border-border/80 dcb:px-3 dcb:py-2.5 dcb:text-sm dcb:font-semibold">
                Files
              </div>
              <div className="dcb:flex dcb:flex-col dcb:p-2">
                {demoFiles.map((file) => (
                  <button
                    key={file.id}
                    className={`dcb:rounded-lg dcb:px-3 dcb:py-2 dcb:text-left dcb:text-sm ${
                      file.id === selectedFile.id
                        ? "dcb:bg-secondary dcb:text-foreground"
                        : "dcb:text-muted-foreground hover:dcb:bg-muted/50"
                    }`}
                    onClick={() => setSelectedFileId(file.id)}
                    type="button"
                  >
                    <div className="dcb:font-medium">{file.title}</div>
                    <div className="dcb:mt-1 dcb:text-xs">{file.path}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="dcb:overflow-hidden dcb:rounded-xl dcb:border dcb:border-border/80 dcb:bg-background">
              <div className="dcb:border-b dcb:border-border/80 dcb:px-4 dcb:py-3">
                <div className="dcb:text-sm dcb:font-semibold">{selectedFile.title}</div>
                <div className="dcb:mt-1 dcb:text-xs dcb:text-muted-foreground">
                  {selectedFile.path}
                </div>
              </div>
              <div className="dcb:space-y-4 dcb:p-4">
                {lastSelectedResult && (
                  <div className="dcb:rounded-lg dcb:border dcb:border-primary/20 dcb:bg-primary/5 dcb:px-3 dcb:py-2 dcb:text-sm">
                    Opened from chatbot result:{" "}
                    <span className="dcb:font-medium">{lastSelectedResult}</span>
                  </div>
                )}
                <div className="dcb:text-3xl dcb:font-semibold">{selectedFile.title}</div>
                <div className="dcb:max-w-2xl dcb:text-sm dcb:leading-7 dcb:text-muted-foreground">
                  {selectedFile.content}
                </div>
              </div>
            </div>

            {isEmbeddedChatVisible ? (
              <DocsChatbot
                search={{ url: searchUrl, apiKey }}
                title="Memory Assistant"
                variant="embedded"
                className="dcb:h-[600px]"
                persistence={{
                  key: `docs-demo-embedded-${demoPersistenceVersion}`,
                }}
                header={{
                  icon: (
                    <MessageCircleMore className="dcb:h-5 dcb:w-5 dcb:text-[#6988b6]" />
                  ),
                  label: (
                    <span className="dcb:text-[15px] dcb:font-semibold dcb:text-[#22304a]">
                      memory.sqlite
                    </span>
                  ),
                  closeButtonIcon: (
                    <PanelRightClose className="dcb:h-5 dcb:w-5 dcb:text-[#6988b6]" />
                  ),
                  onClose: () => setIsEmbeddedChatVisible(false),
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
              <div className="dcb:flex dcb:h-[600px] dcb:items-center dcb:justify-center dcb:rounded-xl dcb:border dcb:border-dashed dcb:border-border/80 dcb:bg-background">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEmbeddedChatVisible(true)}
                >
                  Reopen Memory Assistant
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
