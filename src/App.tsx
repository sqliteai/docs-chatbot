import { DocsChatbot } from "../lib/DocsChatbot";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { CircleHelp } from "lucide-react";

function App() {
  const [mode, setMode] = useState<"default" | "custom">("default");
  const [open, setOpen] = useState(false);

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
          searchUrl={import.meta.env.VITE_SEARCH_API_URL as string}
          apiKey={import.meta.env.VITE_SEARCH_API_KEY as string}
          title="SQLite Cloud Docs"
          emptyState={{
            title: "Ask questions about SQLite Cloud",
            description: "Get help with SQLite Cloud documentation",
          }}
        />
      ) : (
        <DocsChatbot
          searchUrl={import.meta.env.VITE_SEARCH_API_URL as string}
          apiKey={import.meta.env.VITE_SEARCH_API_KEY as string}
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
