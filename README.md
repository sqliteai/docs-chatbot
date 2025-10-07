# @sqliteai/docs-chatbot

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/sqliteai/docs-chatbot)

Documentation search chatbot powered by SQLite and AI.

## Prerequisites

Before using this chatbot, you need to:

1. **Index your documentation** - Use the [SQLite AI Search Action](https://github.com/sqliteai/sqlite-aisearch-action) to create embeddings from your documentation files
2. **Create an edge function** - Follow the [setup guide](https://github.com/sqliteai/sqlite-aisearch-action#create-the-search-edge-function) to deploy the search edge function

## Usage

### React Application

```bash
npm install @sqliteai/docs-chatbot
```

```tsx
import { DocsChatbot } from "@sqliteai/docs-chatbot";
import "@sqliteai/docs-chatbot/style.css";

function App() {
  return (
    <DocsChatbot
      searchUrl="your-edge-function-url"
      apiKey="your-api-key"
      title="Your Docs"
    />
  );
}
```

### Vanilla JavaScript / HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <script src="https://unpkg.com/@sqliteai/docs-chatbot/dist/umd/docs-chatbot.min.js"></script>

    <docs-chatbot
      search-url="your-edge-function-url"
      api-key="your-api-key"
      title="Your Docs"
    >
    </docs-chatbot>
  </body>
</html>
```

**With dynamic configuration:**

```html
<script src="https://unpkg.com/@sqliteai/docs-chatbot/dist/umd/docs-chatbot.min.js"></script>

<docs-chatbot title="Your Docs"> </docs-chatbot>

<script>
  const chatbot = document.querySelector("docs-chatbot");
  chatbot.setAttribute("search-url", "your-edge-function-url");
  chatbot.setAttribute("api-key", "your-api-key");
</script>
```

**With CSS custom properties for theming:**

```html
<docs-chatbot
  search-url="your-edge-function-url"
  api-key="your-api-key"
  title="Your Docs"
  style="--primary: #f5426c; --primary-foreground: #ffffff"
>
</docs-chatbot>
```

## Props / Configuration

### React Component

| Property                 | Type     | Required | Description                                                                                                                |
| ------------------------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `searchUrl`              | `string` | Yes      | Full URL of your deployed SQLite Cloud edge function (e.g., `https://yourproject.sqlite.cloud/v2/functions/aisearch-docs`) |
| `apiKey`                 | `string` | Yes      | SQLite Cloud API key with permissions to execute the edge function                                                         |
| `title`                  | `string` | Yes      | Title displayed in the chatbot header                                                                                      |
| `emptyState`             | `object` | No       | Customizes the initial empty state of the chatbot                                                                          |
| `emptyState.title`       | `string` | No       | Main heading shown before the first message                                                                                |
| `emptyState.description` | `string` | No       | Subtext shown below the empty state title                                                                                  |

### Web Component Attributes

| Attribute                 | Required | Description                                                                                                                |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `search-url`              | Yes      | Full URL of your deployed SQLite Cloud edge function (e.g., `https://yourproject.sqlite.cloud/v2/functions/aisearch-docs`) |
| `api-key`                 | Yes      | SQLite Cloud API key with permissions to execute the edge function                                                         |
| `title`                   | Yes      | Title displayed in the chatbot header                                                                                      |
| `empty-state-title`       | No       | Main heading shown before the first message                                                                                |
| `empty-state-description` | No       | Subtext shown below the empty state title                                                                                  |
