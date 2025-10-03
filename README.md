# @sqliteai/docs-chatbot

Documentation search chatbot powered by SQLite and AI.

## Prerequisites

Before using this chatbot, you need to:

1. **Index your documentation** - Use the [SQLite AI Search Action](https://github.com/sqliteai/sqlite-aisearch-action) to create embeddings from your documentation files
2. **Create an edge function** - Follow the [setup guide](https://github.com/sqliteai/sqlite-aisearch-action#create-the-search-edge-function) to deploy the search edge function

## Installation

```bash
npm install @sqliteai/docs-chatbot
```

## Usage

### React Application

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
    <div id="chatbot-container"></div>

    <script src="https://unpkg.com/@sqliteai/docs-chatbot/dist/umd/docs-chatbot.min.js"></script>

    <script>
      DocsChatbot.init({
        containerId: "chatbot-container",
        searchUrl: "your-edge-function-url",
        apiKey: "your-api-key",
        title: "Your Docs",
      });
    </script>
  </body>
</html>
```

## Props / Configuration

| Property                 | Type     | Required | Description                                  |
| ------------------------ | -------- | -------- | -------------------------------------------- |
| `searchUrl`              | `string` | Yes      | Full URL of your deployed SQLite Cloud edge function (e.g., `https://yourproject.sqlite.cloud/v2/functions/aisearch-docs`) |
| `apiKey`                 | `string` | Yes      | SQLite Cloud API key with permissions to execute the edge function |
| `title`                  | `string` | Yes      | Title displayed in the chatbot header |
| `emptyState`             | `object` | No       | Customizes the initial empty state of the chatbot |
| `emptyState.title`       | `string` | No       | Main heading shown before the first message |
| `emptyState.description` | `string` | No       | Subtext shown below the empty state title |
