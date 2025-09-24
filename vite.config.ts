import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "component" || mode === "widget";

  if (isLibrary) {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "globalThis",
      },
      css: {
        postcss: "./postcss.config.js",
      },
      build: {
        outDir: mode === "component" ? "dist/component" : "dist/widget",
        lib: {
          entry:
            mode === "component"
              ? path.resolve(__dirname, "src/index.ts")
              : path.resolve(__dirname, "src/widget.ts"),
          name: "SqliteAiChatbot",
          fileName: (format) => {
            if (mode === "component") {
              return `index.${format}.js`;
            } else {
              return format === "es" ? "chatbot.js" : "chatbot.min.js";
            }
          },
          formats: mode === "widget" ? ["umd"] : ["es"],
        },
        emitCss: true,
        cssCodeSplit: false,
        rollupOptions: {
          external:
            mode === "component"
              ? ["react", "react/jsx-runtime", "react-dom", "react-dom/client"]
              : [],
          output:
            mode === "component"
              ? {
                  globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                  },
                }
              : {},
        },
      },
    };
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
