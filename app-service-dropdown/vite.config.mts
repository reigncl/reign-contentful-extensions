import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

function corsProxyPlugin(): Plugin {
  return {
    name: 'cors-proxy',
    configureServer(server) {
      server.middlewares.use('/cors-proxy', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          });
          res.end();
          return;
        }

        // req.url = '/<target-url>'  e.g. '/https://api.example.com/items'
        const targetUrl = req.url?.slice(1);
        if (!targetUrl) {
          res.writeHead(400);
          res.end('Missing target URL');
          return;
        }

        try {
          const forwardHeaders: Record<string, string> = {};
          for (const [key, value] of Object.entries(req.headers)) {
            if (
              !['host', 'origin', 'referer', 'connection'].includes(key.toLowerCase()) &&
              typeof value === 'string'
            ) {
              forwardHeaders[key] = value;
            }
          }

          const response = await fetch(targetUrl, { headers: forwardHeaders });

          res.writeHead(response.status, {
            'Content-Type': response.headers.get('content-type') ?? 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(await response.text());
        } catch (err) {
          res.writeHead(502);
          res.end(String(err));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), corsProxyPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  base: '',
  build: {
    outDir: 'build',
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
});
