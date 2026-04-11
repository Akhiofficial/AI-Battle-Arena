/**
 * Lightweight markdown → HTML parser.
 * Every element is given Tailwind classes so no external CSS is needed.
 */

// Tailwind class maps
const CLS = {
  h1:     'font-[family-name:var(--font-display)] text-[1.05rem] font-semibold text-[#e3e0f8] mt-3 mb-1',
  h2:     'font-[family-name:var(--font-display)] text-[0.96rem] font-semibold text-[#e3e0f8] mt-3 mb-1',
  h3:     'font-[family-name:var(--font-display)] text-[0.875rem] font-semibold text-[#d2bbff] mt-2 mb-1',
  p:      'text-[0.85rem] leading-relaxed text-[#ccc3d8] my-1',
  ul:     'list-disc list-inside my-1 space-y-0.5',
  ol:     'list-decimal list-inside my-1 space-y-0.5',
  li:     'text-[0.85rem] leading-relaxed text-[#ccc3d8]',
  strong: 'font-semibold text-[#e3e0f8]',
  em:     'italic text-[#ffb784]',
  code:   'bg-violet-900/20 text-violet-300 font-[family-name:var(--font-mono)] text-[0.8em] px-1.5 py-0.5 rounded',
  pre:    'bg-[rgba(10,10,26,.85)] border border-[rgba(74,68,85,.3)] rounded-lg p-4 my-2 overflow-x-auto',
  preCode:'font-[family-name:var(--font-mono)] text-[0.76rem] leading-relaxed text-[#e2e8f0] block',
};

export function parseMarkdown(md) {
  if (!md) return '';

  const lines = md.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ──────────────────────────────────
    if (line.startsWith('```')) {
      i++;
      let code = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += escHtml(lines[i]) + '\n';
        i++;
      }
      html += `<pre class="${CLS.pre}"><code class="${CLS.preCode}">${code.trimEnd()}</code></pre>\n`;
      i++;
      continue;
    }

    // ── Headings ───────────────────────────────────────────
    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      const lvl = Math.min(hm[1].length, 3);
      const cls = CLS[`h${lvl}`];
      html += `<h${lvl} class="${cls}">${inline(hm[2])}</h${lvl}>\n`;
      i++; continue;
    }

    // ── Unordered list ─────────────────────────────────────
    if (/^[\*\-]\s+/.test(line)) {
      html += `<ul class="${CLS.ul}">\n`;
      while (i < lines.length && /^[\*\-]\s+/.test(lines[i])) {
        html += `<li class="${CLS.li}">${inline(lines[i].replace(/^[\*\-]\s+/, ''))}</li>\n`;
        i++;
      }
      html += '</ul>\n';
      continue;
    }

    // ── Ordered list ───────────────────────────────────────
    if (/^\d+\.\s+/.test(line)) {
      html += `<ol class="${CLS.ol}">\n`;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        html += `<li class="${CLS.li}">${inline(lines[i].replace(/^\d+\.\s+/, ''))}</li>\n`;
        i++;
      }
      html += '</ol>\n';
      continue;
    }

    // ── Blank line ─────────────────────────────────────────
    if (line.trim() === '') { i++; continue; }

    // ── Paragraph ──────────────────────────────────────────
    html += `<p class="${CLS.p}">${inline(line)}</p>\n`;
    i++;
  }

  return html;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold + italic
    .replace(/\*\*\*(.*?)\*\*\*/g,
      `<strong class="${CLS.strong}"><em class="${CLS.em}">$1</em></strong>`)
    // Bold
    .replace(/\*\*(.*?)\*\*/g,
      `<strong class="${CLS.strong}">$1</strong>`)
    // Italic
    .replace(/\*(.*?)\*/g,
      `<em class="${CLS.em}">$1</em>`)
    // Inline code
    .replace(/`([^`]+)`/g,
      `<code class="${CLS.code}">$1</code>`);
}
