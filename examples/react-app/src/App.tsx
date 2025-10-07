import { DocsChatbot } from "../../../dist/esm/index.esm.js";
import "./styles.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <DocsChatbot
        searchUrl={import.meta.env.VITE_SEARCH_API_URL}
        apiKey={import.meta.env.VITE_SEARCH_API_KEY}
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
