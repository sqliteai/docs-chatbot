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

## Customizing Theme

You can customize the chatbot's appearance by overriding CSS variables.

### Available CSS Variables

```css
:root {
  /* Border radius */
  --docs-chatbot-radius

  /* Colors */
  --docs-chatbot-background
  --docs-chatbot-foreground
  --docs-chatbot-card
  --docs-chatbot-card-foreground
  --docs-chatbot-popover
  --docs-chatbot-popover-foreground
  --docs-chatbot-primary
  --docs-chatbot-primary-foreground
  --docs-chatbot-secondary
  --docs-chatbot-secondary-foreground
  --docs-chatbot-muted
  --docs-chatbot-muted-foreground
  --docs-chatbot-accent
  --docs-chatbot-accent-foreground
  --docs-chatbot-destructive
  --docs-chatbot-border
  --docs-chatbot-input
  --docs-chatbot-ring
}
```

### Usage Examples

**In your global CSS (recommended):**

```css
/* In your main CSS file, import the chatbot styles first */
@import "@sqliteai/docs-chatbot/style.css";

/* Then override the variables */
:root {
  --docs-chatbot-primary: oklch(0.6 0.2 0);
  --docs-chatbot-primary-foreground: oklch(1 0 0);
  --docs-chatbot-border: oklch(0.85 0 0);
}
```

**In React:**

```tsx
import { DocsChatbot } from "@sqliteai/docs-chatbot";
import "./styles.css"; // Your CSS file with overrides

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

**In Vanilla JavaScript / HTML:**

```html
<style>
  docs-chatbot {
    --docs-chatbot-primary: oklch(0.6 0.2 0);
    --docs-chatbot-primary-foreground: oklch(1 0 0);
    --docs-chatbot-border: oklch(0.85 0 0);
  }
</style>

<docs-chatbot
  search-url="your-edge-function-url"
  api-key="your-api-key"
  title="Your Docs"
>
</docs-chatbot>
```
