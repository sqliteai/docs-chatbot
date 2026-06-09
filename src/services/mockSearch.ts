import type { DocumentSearchResult } from "@/types/chat";

type MockDocument = DocumentSearchResult & {
  keywords: string[];
};

const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    url: "https://docs.mock.sqlite.cloud/getting-started",
    snippet:
      "Create a project, add a database, and connect with the SQLite Cloud dashboard or client SDKs. The usual flow is to provision a workspace, create the first database, generate an API key, and verify connectivity from either the dashboard or a local application. Once that baseline is working, you can move on to indexing docs, deploying edge functions, and enabling the assistant against real project data.",
    keywords: ["getting", "started", "project", "database", "connect"],
  },
  {
    id: "edge-functions",
    title: "Edge Functions",
    url: "https://docs.mock.sqlite.cloud/edge-functions",
    snippet:
      "Deploy edge functions close to your data and call them securely with API keys or project-scoped credentials. A typical setup validates the incoming bearer token, reads request parameters, runs the relevant SQL or retrieval logic, and returns a compact JSON payload to the client. For chatbot workloads, the edge function usually wraps search, ranking, and response formatting so the UI can stay thin.",
    keywords: ["edge", "functions", "deploy", "api", "keys"],
  },
  {
    id: "vector-search",
    title: "Vector Search",
    url: "https://docs.mock.sqlite.cloud/vector-search",
    snippet:
      "Store embeddings in SQLite tables and run similarity search for semantic retrieval and AI-powered features. In practice, you chunk documents into smaller passages, compute embeddings for each chunk, and keep metadata such as title, path, and section labels alongside the vectors. Query-time retrieval then ranks the nearest chunks so the chatbot can cite the most relevant snippets instead of scanning entire files.",
    keywords: ["vector", "search", "embeddings", "semantic", "retrieval"],
  },
  {
    id: "cloudsync",
    title: "CloudSync",
    url: "https://docs.mock.sqlite.cloud/cloudsync",
    snippet:
      "Sync local databases with SQLite Cloud, resolve conflicts, and keep offline-first apps up to date. The main operational concerns are deciding which tables should sync, handling reconnect scenarios, and making conflict resolution rules predictable for users. Teams often pair CloudSync with audit metadata so they can understand which device last wrote a row and why a merge happened.",
    keywords: ["cloudsync", "sync", "offline", "conflicts", "local"],
  },
  {
    id: "auth-api-keys",
    title: "API Keys and Auth",
    url: "https://docs.mock.sqlite.cloud/auth/api-keys",
    snippet:
      "Generate API keys, scope access to projects, and rotate credentials for secure production deployments. For production systems, the safer pattern is to issue narrowly scoped keys per environment, store them in server-side secrets, and rotate them on a schedule instead of embedding long-lived credentials in client apps. If an assistant depends on a search edge function, that function should enforce auth and reject missing or invalid tokens early.",
    keywords: ["auth", "api", "keys", "credentials", "security"],
  },
  {
    id: "memory-chat",
    title: "Memory Chat",
    url: "https://docs.mock.sqlite.cloud/memory/chat",
    snippet:
      "Index your content with sqlite-memory and expose a searchable chatbot experience with persistent conversation context. A strong memory-page setup preserves chat history per database, lets result clicks open the matching file in the editor, and keeps snippets compact enough to scan without hiding important context. The host app usually owns database selection, persistence keys, and file navigation while the chatbot focuses on retrieval and rendering.",
    keywords: ["memory", "chat", "index", "content", "persistent"],
  },
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function getTerms(query: string) {
  return normalize(query)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

function scoreDocument(document: MockDocument, terms: string[]) {
  const title = normalize(document.title);
  const snippet = normalize(document.snippet);
  const url = normalize(document.url);
  const keywords = document.keywords.map(normalize);

  return terms.reduce((score, term) => {
    let nextScore = score;

    if (title.includes(term)) nextScore += 6;
    if (keywords.some((keyword) => keyword.includes(term))) nextScore += 4;
    if (snippet.includes(term)) nextScore += 2;
    if (url.includes(term)) nextScore += 1;

    return nextScore;
  }, 0);
}

export function isMockSearchUrl(searchUrl: URL) {
  return (
    searchUrl.protocol === "mock:" ||
    (searchUrl.protocol === "https:" && searchUrl.hostname === "mock.local")
  );
}

export async function runMockSearch(query: string) {
  const terms = getTerms(query);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });

  const ranked = MOCK_DOCUMENTS.map((document) => ({
    document,
    score: scoreDocument(document, terms),
  }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)
    .map(({ document }) => ({
      id: document.id,
      title: document.title,
      url: document.url,
      snippet: document.snippet,
    }));

  if (ranked.length > 0) {
    return ranked;
  }

  return MOCK_DOCUMENTS.slice(0, 3).map(({ id, title, url, snippet }) => ({
    id,
    title,
    url,
    snippet,
  }));
}
