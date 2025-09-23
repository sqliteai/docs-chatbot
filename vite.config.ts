import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "component" || mode === "widget";

  if (isLibrary) {
    return {
      plugins: [
        react(),
        tailwindcss(),
        ...(mode === "component" ? [libInjectCss()] : []),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "globalThis",
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
        emitCss: false,
        rollupOptions: {
          external: mode === "component" ? ["react", "react-dom"] : [],
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
