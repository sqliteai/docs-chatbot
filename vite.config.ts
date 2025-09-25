import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import dts from "unplugin-dts/vite";

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "react" || mode === "web";

  if (isLibrary) {
    return {
      plugins: [
        react(),
        ...(mode === "react"
          ? [
              dts({
                include: ["lib/Chatbot.tsx"],
                outDirs: ["dist/esm"],
                tsconfigPath: "./tsconfig.app.json",
                //bundleTypes: true,
              }),
            ]
          : []),
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
      css: {
        postcss: "./postcss.config.js",
      },
      build: {
        outDir: mode === "react" ? "dist/esm" : "dist/umd",
        lib: {
          entry:
            mode === "react"
              ? path.resolve(__dirname, "lib/react.ts")
              : path.resolve(__dirname, "lib/web.ts"),
          name: "SqliteAiChatbot",
          fileName: (format) => {
            if (mode === "react") {
              return format === "es" ? "index.esm.js" : "index.cjs.js";
            } else {
              return "chatbot.min.js";
            }
          },
          formats: mode === "react" ? ["es", "cjs"] : ["umd"],
        },
        emitCss: true,
        cssCodeSplit: false,
        rollupOptions: {
          external:
            mode === "react"
              ? ["react", "react/jsx-runtime", "react-dom", "react-dom/client"]
              : [],
          output:
            mode === "react"
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
