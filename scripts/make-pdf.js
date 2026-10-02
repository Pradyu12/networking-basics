/* ==================================================================
   PDF EXPORT  ->  Networking Basics handout / prep pack
   ------------------------------------------------------------------
   Renders every slide to a print-optimised HTML page and hands it to
   headless Chromium, which produces the PDF. Chromium is used rather
   than a PDF library so the exported file is pixel-identical to the
   live deck and includes the real draw.io diagrams.

   Usage:  node scripts/make-pdf.js
   Output: Networking-Basics-Handout.pdf (repo root)
   ================================================================== */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_PDF = path.join(ROOT, 'Networking-Basics-Handout.pdf');
const PRINT_HTML = path.join(ROOT, '.print-build.html');

/* —  — Slide data + inlined diagrams —  — */
const slideSandbox = {};
new Function('exports', fs.readFileSync(path.join(ROOT, 'js/slides.js'), 'utf8') +
  '\nexports.slides = slides;')(slideSandbox);
const slides = slideSandbox.slides;

const svgSandbox = {};
new Function('exports', fs.readFileSync(path.join(ROOT, 'js/diagram-svgs.js'), 'utf8') +
  '\nexports.DIAGRAM_SVGS = DIAGRAM_SVGS;')(svgSandbox);
const DIAGRAMS = svgSandbox.DIAGRAM_SVGS;

/* —  — Helpers —  — */
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Diagrams are generated markup: only neutralise tags that could break
   out of the <svg> block. Text nodes keep their characters so the
   labels inside the drawings stay readable. */
function safeSvg(markup) {
  return String(markup).replace(/<\/(script|style)/gi, '<$1');
}

const css = ['main.css', 'animations.css', 'diagrams.css']
  .map((f) => fs.readFileSync(path.join(ROOT, 'css', f), 'utf8')).join('\n');

/* —  — Page markup —  —
   One printed page per slide: the visual, then the speaker notes the
   presenter needs. Notes are printed because this is the prep handout,
   not a copy of the slides. */
function page(slide, i, total) {
  const n = String(i + 1).padStart(2, '0');
  const diagram = slide.diagram ? DIAGRAMS[slide.diagram] : null;

  let visual = '';
  if (diagram) {
    visual = `<div class="diagram">${safeSvg(diagram)}</div>`;
  }

  let bullets = '';
  if (Array.isArray(slide.bulletItems) && slide.bulletItems.length) {
    bullets = '<ul class="bullets">' +
      slide.bulletItems.map((b) => `<li>${esc(b)}</li>`).join('') + '</ul>';
  }

  let visualLine = '';
  if (slide.visual) {
    visualLine = `<p class="visual-line">${esc(slide.visualLabel ? slide.visualLabel + ': ' : '')}${esc(slide.visual)}</p>`;
  }

  const analogy = slide.analogy
    ? `<div class="analogy"><span class="analogy-tag">Analogy</span> ${esc(slide.analogy)}</div>`
    : '';

  const notes = slide.notes
    ? `<div class="notes"><span class="notes-tag">Speaker notes</span><p>${esc(slide.notes)}</p></div>`
    : '';

  return `<section class="page">
  <header class="page-head">
    <span class="eyebrow">${esc(slide.eyebrow || 'Networking')}</span>
    <span class="pageno">${n} / ${String(total).padStart(2, '0')}</span>
  </header>
  <h2 class="title">${esc(slide.title)}</h2>
  ${slide.subtitle ? `<p class="subtitle">${esc(slide.subtitle)}</p>` : ''}
  <div class="body ${diagram ? 'has-diagram' : ''}">
    ${diagram ? visual : bullets + visualLine}
  </div>
  ${analogy}
  ${notes}
</section>`;
}
const body = slides.map((s, i) => page(s, i, slides.length)).join('\n');

const printCss = `
@page { size: A4; margin: 14mm 13mm; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
/* main.css sizes the deck as a fixed 100vh viewport with overflow:hidden and a
   dark palette. In print that clips everything onto a single page, so the
   screen layout has to be explicitly undone here. */
html, body {
  width: auto !important;
  height: auto !important;
  overflow: visible !important;
  background: #fff !important;
  color: #0f172a !important;
}
#app { width: auto !important; height: auto !important; overflow: visible !important; }
body * { opacity: 1 !important; visibility: visible !important; }
.top-bar, .progress-bar, .progress-dots, .speaker-notes,
.controls, .btn-prev, .btn-next, #bg-grid, #bg-animated { display: none !important; }

.page {
  page-break-after: always;
  break-after: page;
  display: flex;
  flex-direction: column;
  min-height: 232mm;
  padding-bottom: 4mm;
}
.page:last-child { page-break-after: auto; break-after: auto; }

.page-head {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1.5px solid #e2e8f0; padding-bottom: 3mm; margin-bottom: 6mm;
}
.eyebrow { font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase;
  font-weight: 700; color: #0891b2; }
.pageno { font-size: 9pt; color: #64748b; font-variant-numeric: tabular-nums; }

.title { font-size: 21pt; line-height: 1.15; margin: 0 0 2mm; color: #0f172a; font-weight: 800; }
.subtitle { font-size: 11pt; color: #475569; margin: 0 0 6mm; font-weight: 600; }

.diagram { margin: 0 0 6mm; }
.diagram svg { width: 100%; height: auto; display: block; border-radius: 6px; }

.bullets { margin: 0; padding-left: 5mm; }
.bullets li { font-size: 11pt; line-height: 1.5; margin-bottom: 3mm; color: #1e293b; }

.visual-line {
  font-family: "Fira Code", ui-monospace, Menlo, monospace;
  font-size: 9.5pt; color: #0369a1; background: #f0f9ff;
  border-left: 3px solid #38bdf8; padding: 3mm 4mm; border-radius: 4px;
}

.analogy {
  margin-top: 6mm; padding: 3.5mm 4mm;
  background: #fffbeb; border-left: 3px solid #f59e0b; border-radius: 4px;
  font-size: 10pt; line-height: 1.5; color: #78350f;
}
.analogy-tag {
  display: block; font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase;
  font-weight: 700; color: #b45309; margin-bottom: 1.5mm;
}

.notes {
  margin-top: auto; padding: 4mm 5mm;
  background: #f8fafc; border: 1px solid #cbd5e1; border-left: 3px solid #0f172a;
  border-radius: 4px;
}
.notes-tag {
  display: block; font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase;
  font-weight: 700; color: #475569; margin-bottom: 2mm;
}
.notes p { margin: 0; font-size: 10pt; line-height: 1.55; color: #1e293b; }

/* diagrams.js marks connector paths with .edge and the deck animates them.
   In print there is nothing to animate, so pin them to the final state. */
.edge { stroke-dasharray: none !important; animation: none !important; }
.packet { opacity: 1 !important; animation: none !important; }
svg * { animation: none !important; transition: none !important; }

/* —  — Study guide appendix —  — */
.guide {
  page-break-before: always;
  break-before: page;
  font-family: Inter, "Segoe UI", system-ui, sans-serif;
  color: #0f172a;
  font-size: 10.5pt;
  line-height: 1.5;
}
.guide h1 {
  font-size: 24pt; margin: 0 0 6mm; padding-bottom: 3mm;
  border-bottom: 2.5px solid #0891b2; color: #0f172a;
}
.guide h2 {
  font-size: 15pt; margin: 9mm 0 3mm; padding-bottom: 2mm;
  border-bottom: 1px solid #e2e8f0; color: #0e7490;
  page-break-after: avoid; break-after: avoid;
}
.guide h3 { font-size: 12pt; margin: 6mm 0 2mm; color: #1e293b;
  page-break-after: avoid; break-after: avoid; }
.guide h4 { font-size: 10.5pt; margin: 4mm 0 1.5mm; color: #475569; }
.guide p { margin: 0 0 3mm; }
.guide ul, .guide ol { margin: 0 0 3mm; padding-left: 6mm; }
.guide li { margin-bottom: 1.5mm; }
.guide strong { color: #0f172a; }
.guide em { color: #475569; }
.guide hr { border: 0; border-top: 1px solid #e2e8f0; margin: 6mm 0; }
.guide code {
  font-family: "Fira Code", ui-monospace, Menlo, monospace;
  font-size: 9pt; background: #f1f5f9; color: #0369a1;
  padding: 0.4mm 1.2mm; border-radius: 3px;
}
.guide pre.code {
  background: #0f172a; color: #e2e8f0; padding: 3.5mm 4mm;
  border-radius: 5px; font-size: 8.5pt; line-height: 1.45;
  overflow-wrap: break-word; white-space: pre-wrap;
  page-break-inside: avoid; break-inside: avoid;
}
.guide pre.code code { background: none; color: inherit; padding: 0; }
.guide table {
  width: 100%; border-collapse: collapse; margin: 0 0 4mm;
  font-size: 8.8pt; page-break-inside: avoid; break-inside: avoid;
}
.guide th {
  background: #0e7490; color: #fff; text-align: left;
  padding: 2mm 2.5mm; font-weight: 700; border: 1px solid #0e7490;
}
.guide td { padding: 1.8mm 2.5mm; border: 1px solid #cbd5e1; vertical-align: top; }
.guide tr:nth-child(even) td { background: #f8fafc; }
.guide a { color: #0369a1; text-decoration: none; }
`;
/* —  — Study guide (markdown) -> HTML —  —
   A deliberately small converter: headings, tables, lists, bold/inline
   code and rules are all the guide uses. */
function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  const inline = (t) => esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push('<pre class="code">' + esc(buf.join('\n')) + '</pre>');
      continue;
    }

    // table: header row followed by a separator row
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]);
      out.push('<table><thead><tr>' +
        head.map((h) => '<th>' + inline(h) + '</th>').join('') +
        '</tr></thead><tbody>' +
        rows.slice(2).map((r) => '<tr>' + cells(r).map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>');
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); i++; continue; }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>');
        i++;
      }
      out.push('<ul>' + items.join('') + '</ul>');
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>');
        i++;
      }
      out.push('<ol>' + items.join('') + '</ol>');
      continue;
    }

    if (!line.trim()) { i++; continue; }

    // paragraph: gather until a blank line
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\||```|\s*[-*]\s|\s*\d+\.\s|-{3,}$)/.test(lines[i])) {
      buf.push(lines[i++]);
    }
    out.push('<p>' + inline(buf.join(' ')) + '</p>');
  }
  return out.join('\n');
}

const guidePath = path.join(ROOT, 'STUDY-GUIDE.md');
let guideSection = '';
if (fs.existsSync(guidePath)) {
  const guideHtml = mdToHtml(fs.readFileSync(guidePath, 'utf8'));
  guideSection = '<section class="guide">\n' + guideHtml + '\n</section>';
}

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Networking Basics — Handout</title>
<style>${css}</style>
<style>${printCss}</style>
</head>
<body>${body}
${guideSection}
</body></html>`;

fs.writeFileSync(PRINT_HTML, html, 'utf8');
console.log('wrote ' + PRINT_HTML + ' = ' + fs.statSync(PRINT_HTML).size + ' bytes');

/* —  — Headless Chromium —  — */
function findChrome() {
  const cache = path.join(os.homedir(), '.cache');
  const roots = [
    path.join(cache, 'ms-playwright'),
    path.join(cache, 'puppeteer')
  ];
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs.readdirSync(root)) {
      for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
        const p = path.join(root, d, rel);
        if (fs.existsSync(p)) found.push(p);
      }
    }
  }
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) found.push(p);
  }
  return found;
}

const chrome = findChrome();
if (!chrome.length) {
  console.error('No Chromium/Chrome binary found. Install one and re-run.');
  process.exit(1);
}

console.log('Rendering ' + slides.length + ' pages...');
console.log('Using: ' + chrome[0]);

execFileSync(chrome[0], [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--virtual-time-budget=20000',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  '--print-to-pdf=' + OUT_PDF,
  'file://' + PRINT_HTML
], { stdio: ['ignore', 'inherit', 'inherit'] });

fs.unlinkSync(PRINT_HTML);

const kb = (fs.statSync(OUT_PDF).size / 1024).toFixed(0);
console.log('WROTE ' + OUT_PDF + '  (' + kb + ' KB)');