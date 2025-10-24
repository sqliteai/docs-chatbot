# @sqliteai/docs-chatbot

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/sqliteai/docs-chatbot)

Embeddable AI chatbot for documentation, powered by SQLite Cloud.

## Quick Start

### Prerequisites

Before using this chatbot, you need to:

1. **Index your documentation** - Use the [SQLite AI Search Action](https://github.com/sqliteai/sqlite-aisearch-action) to create embeddings from your documentation files
2. **Create an edge function** - Follow the [setup guide](https://github.com/sqliteai/sqlite-aisearch-action#create-the-search-edge-function) to deploy the search edge function

### React

```bash
npm install @sqliteai/docs-chatbot
```

```tsx
import { DocsChatbot } from "@sqliteai/docs-chatbot";
import "@sqliteai/docs-chatbot/style.css";

function App() {
  return (
    <DocsChatbot
      searchUrl="https://yourproject.sqlite.cloud/v2/functions/aisearch-docs"
      apiKey="your-api-key"
      title="Help Center"
    />
  );
}
```

### Vanilla JavaScript

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
      search-url="https://yourproject.sqlite.cloud/v2/functions/aisearch-docs"
      api-key="your-api-key"
      title="Help Center"
    >
    </docs-chatbot>
  </body>
</html>
```

## Trigger Modes

### Default Trigger

<img width="1887" height="829" alt="Screen Shot 2025-10-24 at 14 39 33 PM" src="https://github.com/user-attachments/assets/dfb3b8c0-ba8b-4c7d-bf0d-a4022982d45f" />

Adds a floating button in the bottom-right corner that opens the chatbot when clicked.

```tsx
<DocsChatbot
  searchUrl="your-edge-function-url"
  apiKey="your-api-key"
  title="Help Center"
/>
```

### Custom Trigger

<img width="1898" height="830" alt="Screen Shot 2025-10-24 at 14 42 16 PM" src="https://github.com/user-attachments/assets/a2efaa07-f441-4281-bf8c-818b98a8c8b1" />

Use your own button or trigger element to control when the chatbot opens. This mode is useful when you want the chatbot to integrate seamlessly with your existing UI design or place the trigger in a specific location (like a navigation bar or help menu).
  
**React:**

```tsx
import { DocsChatbot } from "@sqliteai/docs-chatbot";
import "@sqliteai/docs-chatbot/style.css";
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Your custom button anywhere in your app */}
      <button onClick={() => setOpen(true)}>Help & Support</button>

      {/* Chatbot with custom trigger mode */}
      <DocsChatbot
        searchUrl="your-edge-function-url"
        apiKey="your-api-key"
        title="Help Center"
        trigger="custom"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
```

**Vanilla JavaScript:**

```html
<script src="https://unpkg.com/@sqliteai/docs-chatbot/dist/umd/docs-chatbot.min.js"></script>

<!-- Your custom button -->
<button id="help-btn">Help & Support</button>

<!-- Chatbot with custom trigger mode -->
<docs-chatbot
  search-url="your-edge-function-url"
  api-key="your-api-key"
  title="Help Center"
  trigger="custom"
>
</docs-chatbot>

<script>
  const chatbot = document.querySelector("docs-chatbot");
  const button = document.getElementById("help-btn");

  // Open chatbot when button is clicked
  button.addEventListener("click", () => {
    chatbot.open = true;
  });

  // Listen to state changes (optional)
  chatbot.addEventListener("openchange", (e) => {
    console.log("Chatbot open:", e.detail.open);
  });
</script>
```

## API Reference

### React Component Props

| Property                 | Type                      | Required                    | Description                                                                                                                |
| ------------------------ | ------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `searchUrl`              | `string`                  | Yes                         | Full URL of your deployed SQLite Cloud edge function (e.g., `https://yourproject.sqlite.cloud/v2/functions/aisearch-docs`) |
| `apiKey`                 | `string`                  | Yes                         | SQLite Cloud API key with permissions to execute the edge function                                                         |
| `title`                  | `string`                  | Yes                         | Title displayed in the chatbot header                                                                                      |
| `emptyState`             | `object`                  | No                          | Customizes the initial empty state of the chatbot                                                                          |
| `emptyState.title`       | `string`                  | No                          | Main heading shown before the first message                                                                                |
| `emptyState.description` | `string`                  | No                          | Subtext shown below the empty state title                                                                                  |
| `trigger`                | `"default" \| "custom"`   | No                          | Trigger mode: `"default"` uses floating button, `"custom"` requires you to control `open` state (default: `"default"`)     |
| `open`                   | `boolean`                 | Yes when `trigger="custom"` | Control the chatbot open state (only used with `trigger="custom"`)                                                         |
| `onOpenChange`           | `(open: boolean) => void` | Yes when `trigger="custom"` | Callback fired when the open state changes (only used with `trigger="custom"`)                                             |

### Web Component

#### Attributes

| Attribute                 | Required | Description                                                                                                                |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `search-url`              | Yes      | Full URL of your deployed SQLite Cloud edge function (e.g., `https://yourproject.sqlite.cloud/v2/functions/aisearch-docs`) |
| `api-key`                 | Yes      | SQLite Cloud API key with permissions to execute the edge function                                                         |
| `title`                   | Yes      | Title displayed in the chatbot header                                                                                      |
| `empty-state-title`       | No       | Main heading shown before the first message                                                                                |
| `empty-state-description` | No       | Subtext shown below the empty state title                                                                                  |
| `trigger`                 | No       | Trigger mode: `"default"` uses floating button, `"custom"` requires controlling `open` property (default: `"default"`)     |

#### Properties

| Property | Type      | Description                                                     |
| -------- | --------- | --------------------------------------------------------------- |
| `open`   | `boolean` | Get or set the chatbot open state (property-only, no attribute) |

#### Events

| Event        | Detail              | Description                               |
| ------------ | ------------------- | ----------------------------------------- |
| `openchange` | `{ open: boolean }` | Fired when the chatbot open state changes |

## Theming

Customize the chatbot's appearance using CSS variables.

### CSS Variables

| Variable                              | Description              |
| ------------------------------------- | ------------------------ |
| `--docs-chatbot-radius`               | Border radius            |
| `--docs-chatbot-background`           | Background color         |
| `--docs-chatbot-foreground`           | Text color               |
| `--docs-chatbot-primary`              | Primary color            |
| `--docs-chatbot-primary-foreground`   | Primary text color       |
| `--docs-chatbot-secondary`            | Secondary color          |
| `--docs-chatbot-secondary-foreground` | Secondary text color     |
| `--docs-chatbot-muted`                | Muted color              |
| `--docs-chatbot-muted-foreground`     | Muted text color         |
| `--docs-chatbot-accent`               | Accent color             |
| `--docs-chatbot-accent-foreground`    | Accent text color        |
| `--docs-chatbot-border`               | Border color             |
| `--docs-chatbot-input`                | Input background color   |
| `--docs-chatbot-ring`                 | Focus ring color         |
| `--docs-chatbot-card`                 | Card background color    |
| `--docs-chatbot-card-foreground`      | Card text color          |
| `--docs-chatbot-popover`              | Popover background color |
| `--docs-chatbot-popover-foreground`   | Popover text color       |
| `--docs-chatbot-destructive`          | Destructive/error color  |

### Examples

**React:**

```css
/* In your main CSS file, import the chatbot styles first */
@import "@sqliteai/docs-chatbot/style.css";

/* Then override the variables */
:root {
  --docs-chatbot-primary: oklch(0.6 0.2 0);
  --docs-chatbot-primary-foreground: oklch(1 0 0);
  --docs-chatbot-border: oklch(0.85 0 0);
  --docs-chatbot-radius: 8px;
}
```

```tsx
import { DocsChatbot } from "@sqliteai/docs-chatbot";
import "./styles.css"; // Your CSS file with overrides

function App() {
  return (
    <DocsChatbot
      searchUrl="your-edge-function-url"
      apiKey="your-api-key"
      title="Help Center"
    />
  );
}
```

**Vanilla JavaScript:**

```html
<style>
  docs-chatbot {
    --docs-chatbot-primary: oklch(0.6 0.2 0);
    --docs-chatbot-primary-foreground: oklch(1 0 0);
    --docs-chatbot-border: oklch(0.85 0 0);
    --docs-chatbot-radius: 8px;
  }
</style>

<docs-chatbot
  search-url="your-edge-function-url"
  api-key="your-api-key"
  title="Help Center"
>
</docs-chatbot>
```
