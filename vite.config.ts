import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist'],
  },
  plugins: [react(), expressPlugin(), spaFallbackPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}

function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If the request is for a route (not a file), serve index.html
        if (req.method === 'GET' && !req.url?.includes('.') && !req.url?.startsWith('/@')) {
          req.url = '/';
        }
        next();
      });
    },
  };
}
