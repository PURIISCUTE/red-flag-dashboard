import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

function financialApiPlugin(_env: Record<string, string>): Plugin {
  return {
    name: 'financial-api-telemetry',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // SEC EDGAR XBRL Company Facts Ingestion Proxy
        if (req.url && req.url.startsWith('/api/sec/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const cikRaw = urlObj.pathname.replace('/api/sec/', '').trim();
          const cik10 = cikRaw.padStart(10, '0');
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            const response = await fetch(
              `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik10}.json`,
              {
                headers: {
                  'User-Agent': 'InstitutionalForensicsPlatform research@forensicanalytics.org',
                  'Accept-Encoding': 'gzip, deflate',
                  'Host': 'data.sec.gov'
                },
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);
            if (response.ok) {
              const data = await response.json();
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(data));
              return;
            }
          } catch {
            // graceful fallback
          }
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'SEC EDGAR data unavailable' }));
          return;
        }

        // Yahoo Finance Stock Quote Proxy with chartPreviousClose resolution
        if (req.url && req.url.startsWith('/api/quote/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const ticker = urlObj.pathname.replace('/api/quote/', '').toUpperCase();
          const range = urlObj.searchParams.get('range') || '1d';
          const interval = urlObj.searchParams.get('interval') || '5m';
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`,
              {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);
            if (response.ok) {
              const data = await response.json();
              // Normalization helper: Ensure meta has previousClose from chartPreviousClose if undefined
              if (data?.chart?.result?.[0]?.meta) {
                const meta = data.chart.result[0].meta;
                if (!meta.previousClose && meta.chartPreviousClose) {
                  meta.previousClose = meta.chartPreviousClose;
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.setHeader('Pragma', 'no-cache');
              res.setHeader('Expires', '0');
              res.end(JSON.stringify(data));
              return;
            }
          } catch {
            // graceful fallback
          }
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.end(JSON.stringify({ error: 'Quote unavailable' }));
          return;
        }

        // Yahoo Finance Real Historical Chart & Candlestick Proxy
        if (req.url && req.url.startsWith('/api/chart/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const ticker = urlObj.pathname.replace('/api/chart/', '').toUpperCase();
          const range = urlObj.searchParams.get('range') || '1d';
          const interval = urlObj.searchParams.get('interval') || '5m';
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5500);
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`,
              {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: controller.signal
              }
            );
            clearTimeout(timeoutId);
            if (response.ok) {
              const data = await response.json();
              if (data?.chart?.result?.[0]?.meta) {
                const meta = data.chart.result[0].meta;
                if (!meta.previousClose && meta.chartPreviousClose) {
                  meta.previousClose = meta.chartPreviousClose;
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.setHeader('Pragma', 'no-cache');
              res.setHeader('Expires', '0');
              res.end(JSON.stringify(data));
              return;
            }
          } catch {
            // graceful fallback
          }
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.end(JSON.stringify({ error: 'Chart data unavailable' }));
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), financialApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
