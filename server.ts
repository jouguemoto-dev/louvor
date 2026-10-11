import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CifraClubParsedData {
  title: string;
  artist: string;
  key: string;
  bpm: number;
  timeSig: string;
  category: 'Adoração' | 'Celebração' | 'Louvor' | 'Comunhão' | 'Oferta' | 'Geral';
  chords: string;
  link: string;
  notes?: string;
  capo?: number;
}

/**
 * Parses Cifra Club content from Markdown or HTML
 */
function parseCifraClubContent(text: string, originalUrl: string): CifraClubParsedData {
  let title = '';
  let artist = '';
  let key = 'C';
  let capo = 0;

  // 1. Try Title and Artist extraction from "Title: {Song} - {Artist} - Cifra Club"
  const titleHeaderMatch = text.match(/Title:\s*(.*?)\s*-\s*(.*?)\s*-\s*Cifra Club/i) ||
                           text.match(/Title:\s*(.*?)\s*\|\s*Cifra Club/i);
  if (titleHeaderMatch) {
    title = titleHeaderMatch[1].trim();
    if (titleHeaderMatch[2]) {
      artist = titleHeaderMatch[2].trim();
    }
  }

  // Fallback to URL path extraction (e.g. https://www.cifraclub.com.br/isaias-saad/bondade-de-deus/)
  try {
    const parsedUrl = new URL(originalUrl);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
      if (!artist) {
        artist = segments[0]
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
      if (!title) {
        title = segments[1]
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
    }
  } catch {}

  // 2. Extract Key / Tom
  const tomMatch = text.match(/Tom:\s*([A-G][#b]?m?)/i) ||
                   text.match(/id="cifra_tom"[^>]*>.*?<a[^>]*>(.*?)<\/a>/is) ||
                   text.match(/data-key="([^"]+)"/i);
  if (tomMatch) {
    key = tomMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // 3. Extract Capo
  const capoMatch = text.match(/Capotraste:\s*(\d+)ª/i) ||
                    text.match(/Capo:\s*(\d+)/i) ||
                    text.match(/capo.*?(\d+)ª/i);
  if (capoMatch) {
    capo = parseInt(capoMatch[1], 10) || 0;
  }

  // 4. Extract Chords Body
  let formattedLines: string[] = [];
  const lines = text.split('\n');
  let isCapturing = false;
  let hasFoundStart = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // Check start of actual chord charts
    if (!hasFoundStart) {
      if (
        trimmed.startsWith('[Intro]') ||
        trimmed.startsWith('[Primeira Parte]') ||
        trimmed.startsWith('[Verso]') ||
        trimmed.startsWith('**') ||
        trimmed.includes('**Intro**')
      ) {
        hasFoundStart = true;
        isCapturing = true;
      } else {
        continue;
      }
    }

    // Stop capturing when comments, footer, or tabs section starts
    if (
      trimmed.startsWith('## ') ||
      trimmed.startsWith('Aprenda a tocar') ||
      trimmed.startsWith('Comentários') ||
      trimmed.startsWith('Mais acessadas') ||
      trimmed.startsWith('Partituras') ||
      trimmed.startsWith('Menu de versões')
    ) {
      isCapturing = false;
      continue;
    }

    if (isCapturing) {
      // Break inline section markers like "text [Refrão]" into dedicated headers
      let formatted = line.replace(/\s*\[(Intro|Primeira Parte|Segunda Parte|Refrão|Refr[aã]o|Pré-Refrão|Ponte|Solo|Final|Outro|Interlúdio)\]/gi, '\n\n<b>[$1]</b>\n');

      // Replace bold chords **G**, **F7M/C**, **Am7**, etc. or <b>G</b> with <c>G</c>
      formatted = formatted
        .replace(/\*\*([A-G][#b]?(?:[a-zA-Z0-9\+\/]+)?)\*\*/g, '<c>$1</c>')
        .replace(/<b>([A-G][#b]?(?:[a-zA-Z0-9\+\/]+)?)<\/b>/g, '<c>$1</c>');

      // Replace section headers [Intro], [Refrão], etc. at beginning of lines
      const sectionMatch = formatted.match(/^(?:\[|\()? *(intro|introdução|refrão|refr[aã]o|estrofe|verso|ponte|bridge|solo|final|outro|interlúdio|interlude|pré-refrão|pre-chorus|parte\s*[a-d1-4]|primeira\s*parte|segunda\s*parte) *(?:\]|\))?/i);
      if (sectionMatch || (formatted.trim().startsWith('[') && formatted.trim().endsWith(']'))) {
        const cleanHeader = formatted.replace(/[\[\]\(\)]/g, '').trim();
        formatted = `<b>[${cleanHeader}]</b>`;
      }

      formattedLines.push(formatted);
    }
  }

  let chords = formattedLines.join('\n').trim();

  // If extraction didn't find chords in Markdown, try HTML pre tag fallback
  if (!chords || !chords.includes('<c>')) {
    const preMatch = text.match(/<pre[^>]*>(.*?)<\/pre>/is);
    if (preMatch) {
      let raw = preMatch[1]
        .replace(/<b>(.*?)<\/b>/g, '<c>$1</c>')
        .replace(/<(?!\/?(?:c|b)\b)[^>]+>/g, '');
      chords = raw.trim();
    }
  }

  // Determine worship category
  const lowerContext = (title + ' ' + chords).toLowerCase();
  let category: CifraClubParsedData['category'] = 'Adoração';
  if (lowerContext.includes('oferta') || lowerContext.includes('dízimo') || lowerContext.includes('dinheiro') || lowerContext.includes('tudo é teu')) {
    category = 'Oferta';
  } else if (lowerContext.includes('comunhão') || lowerContext.includes('ceia') || lowerContext.includes('pão e o vinho') || lowerContext.includes('queima')) {
    category = 'Comunhão';
  } else if (lowerContext.includes('celebração') || lowerContext.includes('regozijo') || lowerContext.includes('alegria') || lowerContext.includes('dançar')) {
    category = 'Celebração';
  } else if (lowerContext.includes('louvor') || lowerContext.includes('glória') || lowerContext.includes('exaltai')) {
    category = 'Louvor';
  }

  return {
    title: title || 'Música do Cifra Club',
    artist: artist || 'Ministério de Louvor',
    key: key || 'C',
    bpm: 120,
    timeSig: '4/4',
    category,
    chords: chords || '',
    link: originalUrl,
    capo,
    notes: capo > 0 ? `Capotraste na ${capo}ª casa sugerido pelo Cifra Club.` : 'Importada via link do Cifra Club.'
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API to fetch and parse Cifra Club URL
  app.post('/api/import-cifraclub', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL do Cifra Club não fornecida.' });
      }

      const cleanUrl = url.trim();
      if (!cleanUrl.includes('cifraclub.com.br')) {
        return res.status(400).json({ error: 'O link deve ser do Cifra Club (ex: https://www.cifraclub.com.br/isaias-saad/bondade-de-deus/).' });
      }

      let content = '';

      // Method 1: Fetch via proxy reader to bypass Akamai 403 on Cifra Club
      try {
        const proxyUrl = `https://r.jina.ai/${cleanUrl}`;
        const proxyRes = await fetch(proxyUrl, {
          headers: {
            'Accept': 'text/plain',
          },
          signal: AbortSignal.timeout(12000)
        });

        if (proxyRes.ok) {
          content = await proxyRes.text();
        }
      } catch (proxyErr) {
        console.warn('Proxy reader falhou, tentando requisição direta:', proxyErr);
      }

      // Method 2: Direct fetch fallback
      if (!content) {
        const directRes = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          },
          signal: AbortSignal.timeout(8000)
        });

        if (directRes.ok) {
          content = await directRes.text();
        }
      }

      if (!content) {
        return res.status(502).json({
          error: 'Não foi possível acessar a página do Cifra Club no momento. Verifique se o link está correto.'
        });
      }

      const parsedData = parseCifraClubContent(content, cleanUrl);

      if (!parsedData.chords || parsedData.chords.length < 30) {
        return res.status(422).json({
          error: 'Não foi possível encontrar a cifra estruturada nesta página do Cifra Club. Verifique o link e tente novamente.',
          partialData: parsedData
        });
      }

      return res.json({
        success: true,
        data: parsedData
      });

    } catch (err: any) {
      console.error('Erro na rota import-cifraclub:', err);
      return res.status(500).json({
        error: 'Erro interno ao importar cifra: ' + (err.message || 'Falha desconhecida')
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount Vite development middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LouvorApp server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
