/**
 * Extrai título, resumo, conteúdo e imagens de uma URL de notícia
 * usando Jina Reader (r.jina.ai) — funciona client-side sem CORS issues.
 */

export interface ExtractedNews {
  title: string;
  excerpt: string;
  contentHtml: string;
  images: string[];
  sourceUrl: string;
  sourceName: string;
}

/** Converte markdown simples (do Jina) para HTML compatível com Tiptap */
function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md
    // Remove o título duplicado no início se começar com #
    .replace(/^#\s+.+\n+/, '')
    // Headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold / italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Images
    .replace(/!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-xl max-w-full h-auto my-4 mx-auto block" />')
    // Links
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Blockquotes
    .replace(/^>\s+(.*$)/gim, '<blockquote><p>$1</p></blockquote>')
    // Unordered lists (simple)
    .replace(/^\s*[-*+]\s+(.*$)/gim, '<li>$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

  // Agrupa <li> consecutivos em <ul>
  html = html.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => `<ul>${match}</ul>`);

  // Parágrafos: quebra por linhas em branco
  const blocks = html.split(/\n{2,}/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Já é tag de bloco
      if (/^<(h[1-6]|ul|ol|blockquote|img|p|div)/i.test(trimmed)) {
        return trimmed;
      }
      // Linhas simples viram <br> dentro do parágrafo
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return html;
}

/** Extrai URLs de imagens do markdown */
function extractImagesFromMarkdown(md: string): string[] {
  const images: string[] = [];
  const regex = /!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  while ((match = regex.exec(md)) !== null) {
    const url = match[1];
    // Filtra ícones pequenos / tracking / data uris
    if (
      !url.includes('data:') &&
      !url.includes('favicon') &&
      !url.includes('icon') &&
      !url.includes('logo') &&
      !url.match(/\.(svg|gif)(\?|$)/i) &&
      !images.includes(url)
    ) {
      images.push(url);
    }
  }
  return images;
}

/** Tenta extrair o nome do domínio como source */
function getSourceName(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host;
  } catch {
    return 'Fonte externa';
  }
}

/**
 * Função principal: busca a página via Jina Reader e retorna dados estruturados.
 */
export async function extractNewsFromUrl(url: string): Promise<ExtractedNews> {
  // Normaliza URL
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  // Valida URL básica
  try {
    new URL(normalized);
  } catch {
    throw new Error('URL inválida. Cole um link completo (ex: https://...)');
  }

  const endpoint = `https://r.jina.ai/${normalized}`;

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Return-Format': 'markdown',
    },
  });

  if (!res.ok) {
    throw new Error(`Não foi possível acessar a página (HTTP ${res.status}). Tente outro link.`);
  }

  const json = await res.json();

  if (json.code !== 200 || !json.data) {
    throw new Error(json.message || 'Falha ao extrair conteúdo da página.');
  }

  const data = json.data;
  const title = (data.title || '').trim() || 'Sem título';
  const description = (data.description || '').trim();
  const contentMd = (data.content || '').trim();
  const sourceUrl = data.url || normalized;

  // Imagens do markdown
  const images = extractImagesFromMarkdown(contentMd);

  // Converte para HTML
  const contentHtml = markdownToHtml(contentMd);

  // Excerpt: usa description ou primeiros ~200 chars do content limpo
  let excerpt = description;
  if (!excerpt && contentMd) {
    const plain = contentMd
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/[#>*_\-]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    excerpt = plain.slice(0, 220) + (plain.length > 220 ? '…' : '');
  }

  return {
    title,
    excerpt,
    contentHtml,
    images,
    sourceUrl,
    sourceName: getSourceName(sourceUrl),
  };
}
