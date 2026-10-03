import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, Plugin} from 'vite';

function financialApiPlugin(env: Record<string, string>): Plugin {
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

              // 1. Primary High-Grade LLM: OpenAI GPT-4o from environment
              const openAiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
              if (openAiKey) {
                for (const model of ['gpt-4o', 'gpt-4o-mini']) {
                  try {
                    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openAiKey}`
                      },
                      body: JSON.stringify({
                        model,
                        messages: [
                          {
                            role: 'system',
                            content: 'You are an expert Wall Street equity research and forensic accounting analyst. You categorize companies into exactly 1 of 7 defined industry lenses. Always output strictly valid JSON.'
                          },
                          {
                            role: 'user',
                            content: prompt
                          }
                        ],
                        response_format: { type: 'json_object' },
                        temperature: 0.1
                      })
                    });

                    if (aiRes.ok) {
                      const data = await aiRes.json();
                      const rawText = data?.choices?.[0]?.message?.content;
                      if (rawText) {
                        const parsed = JSON.parse(rawText);
                        parsed.model = model;
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.end(JSON.stringify(parsed));
                        return;
                      }
                    }
                  } catch {
                    // Try next model or fallback
                  }
                }
              }

              // 2. Secondary fallback: Gemini API if configured
              const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
              if (geminiKey) {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({ apiKey: geminiKey });
                const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
                for (const model of candidateModels) {
                  try {
                    const result = await ai.models.generateContent({
                      model,
                      contents: prompt,
                      config: { responseMimeType: 'application/json' }
                    });
                    if (result && result.text) {
                      res.setHeader('Content-Type', 'application/json');
                      res.setHeader('Access-Control-Allow-Origin', '*');
                      res.end(result.text);
                      return;
                    }
                  } catch {
                    // Try next
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

        // AI Forensic Co-Pilot & Flag Explanation Endpoint (powered by OpenAI GPT-4o)
        if (req.url && req.url.startsWith('/api/ai/forensic-copilot') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { prompt: userPrompt, ticker, flagCode } = JSON.parse(body || '{}');
              const openAiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
              
              const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                  model: 'gpt-4o',
                  messages: [
                    {
                      role: 'system',
                      content: `You are an elite forensic accounting auditor and hedge fund short-seller analyst referencing the authoritative SEC 30 Red Flags taxonomy. Provide concise, razor-sharp institutional analysis referencing exact GAAP/SEC rules, financial ratios, and filing sections.`
                    },
                    {
                      role: 'user',
                      content: `Company: ${ticker || 'Selected Company'}\nFlag Reference: ${flagCode || 'Audit Query'}\n\nQuestion / Directive: ${userPrompt || 'Analyze this forensic accounting signal.'}`
                    }
                  ],
                  temperature: 0.2,
                  max_tokens: 450
                })
              });

              if (aiRes.ok) {
                const data = await aiRes.json();
                const answer = data?.choices?.[0]?.message?.content;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ answer, model: 'gpt-4o' }));
                return;
              }
            } catch {
              // fallback
            }

            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Forensic Copilot unavailable' }));
          });
          return;
        }

        // Yahoo Finance Stock Quote Proxy
        if (req.url && req.url.startsWith('/api/quote/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const ticker = urlObj.pathname.replace('/api/quote/', '').toUpperCase();
          const range = urlObj.searchParams.get('range') || '1d';
          const interval = urlObj.searchParams.get('interval') || '1d';
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

        // Yahoo Finance Real Historical Chart & Candlestick Proxy
        if (req.url && req.url.startsWith('/api/chart/')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const ticker = urlObj.pathname.replace('/api/chart/', '').toUpperCase();
          const range = urlObj.searchParams.get('range') || '1y';
          const interval = urlObj.searchParams.get('interval') || '1wk';
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
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
