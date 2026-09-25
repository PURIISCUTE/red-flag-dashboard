import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function financialApiPlugin(): Plugin {
  return {
    name: 'financial-api-telemetry',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // AI Industry Classification Endpoint
        if (req.url && req.url.startsWith('/api/ai/classify-industry') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { ticker, companyName, sector } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

              if (apiKey) {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({ apiKey });

                const prompt = `You are an expert Wall Street equity research and forensic accounting analyst.
We evaluate public companies across EXACTLY 7 specific industry lenses:
1. Retail: Omnichannel retail, consumer goods, e-commerce, consumer brands, automotive mobility, food/beverage.
2. Payments: Payment processing, credit card networks, merchant acquiring, digital wallets, cross-border payment rails, BNPL.
3. SaaS: Cloud subscription software, B2B enterprise SaaS, cybersecurity, database/data platforms.
4. Banks: Commercial banks, investment banks, regional/custodial banks, consumer lending institutions.
5. Tech Hardware: Semiconductors, chip fab equipment, servers, consumer electronics, telecom hardware, aerospace/defense hardware.
6. Healthcare: Pharmaceuticals, biotechnology, medical devices, life sciences tools, health insurance, clinical diagnostics.
7. AI/Deep Tech: AI foundation model developers, AI compute infrastructure, robotics, quantum computing, autonomous agents.

Company: "${companyName || ticker}"
Ticker: "${ticker}"
Industry/Sector Context: "${sector || ''}"

TASK: Pick the single most accurate industry lens from the 7 listed above that best captures the company's core economic revenue and operating model.
Respond ONLY with a JSON object in this exact schema:
{
  "lens": "Retail" | "Payments" | "SaaS" | "Banks" | "Tech Hardware" | "Healthcare" | "AI/Deep Tech",
  "reasoning": "Short 1-sentence explanation"
}`;

                const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
                for (const model of candidateModels) {
                  try {
                    const result = await ai.models.generateContent({
                      model,
                      contents: prompt,
                      config: {
                        responseMimeType: 'application/json'
                      }
                    });
                    if (result && result.text) {
                      res.setHeader('Content-Type', 'application/json');
                      res.setHeader('Access-Control-Allow-Origin', '*');
                      res.end(result.text);
                      return;
                    }
                  } catch {
                    // Try next model if current model experiences high demand
                  }
                }
              }
            } catch {
              // fallback below
            }

            // Fallback response if AI call failed
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'AI classification temporarily unavailable' }));
          });
          return;
        }

        // Yahoo Finance Stock Quote Proxy
        if (req.url && req.url.startsWith('/api/quote/')) {
          const ticker = req.url.replace('/api/quote/', '').split('?')[0].toUpperCase();
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const response = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
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
          res.end(JSON.stringify({ error: 'Quote unavailable' }));
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), financialApiPlugin()],
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
