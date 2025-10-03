import { DocsChatbot } from "../lib/DocsChatbot";

function App() {
  return (
    <div className="min-h-screen items-center justify-center">
      <DocsChatbot
        searchUrl={import.meta.env.VITE_SEARCH_API_URL as string}
        apiKey={import.meta.env.VITE_SEARCH_API_KEY as string}
        title="SQLite Cloud Docs"
        emptyState={{
          title: "Ask questions about SQLite Cloud",
          description: "Get help with SQLite Cloud documentation",
        }}
      />
    </div>
  );
}

export default App;
