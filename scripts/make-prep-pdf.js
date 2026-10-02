/* Prep-notes PDF: PREP-NOTES.md -> styled A4 PDF via headless Chromium. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'Networking-Basics-Prep-Notes.pdf');
const BUILD = path.join(ROOT, '.prep-build.html');

const md = fs.readFileSync(path.join(ROOT, 'PREP-NOTES.md'), 'utf8');
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  let h = esc(s);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/`([^`]+?)`/g, '<code>$1</code>');
  h = h.replace(/\[([^\]]+?)\]\((https?:[^)]+?)\)/g, '<a href="$2">$1</a>');
  return h;
}

function mdToHtml(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
      continue;
    }
    if (/^\|.*\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const isSep = (r) => /^\|?[\s:\-|]+\|?$/.test(r);
      const body = rows.filter((r) => !isSep(r));
      const head = cells(body[0]).map((c) => '<th>' + inline(c) + '</th>').join('');
      const rest = body.slice(1).map((r) =>
        '<tr>' + cells(r).map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('');
      out.push('<table><thead><tr>' + head + '</tr></thead><tbody>' + rest + '</tbody></table>');
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push('<h' + h[1].length + '>' + inline(h[2]) + '</h' + h[1].length + '>'); i++; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i]))
        items.push('<li>' + inline(lines[i++].replace(/^\s*[-*]\s+/, '')) + '</li>');
      out.push('<ul>' + items.join('') + '</ul>');
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i]))
        items.push('<li>' + inline(lines[i++].replace(/^\s*\d+\.\s+/, '')) + '</li>');
      out.push('<ol>' + items.join('') + '</ol>');
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push('<blockquote>' + inline(buf.join(' ')) + '</blockquote>');
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\||```|\s*[-*]\s|\s*\d+\.\s|>|:scale(-{3,}$))/.test(lines[i])) buf.push(lines[i++]);
    out.push('<p>' + inline(buf.join(' ')) + '</p>');
  }
  return out.join('\n');
}
const body = mdToHtml(md);
const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>Networking Basics — Prep Notes</title><style>
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Inter','Segoe UI',system-ui,sans-serif; color: #16213a;
  font-size: 11.5pt; line-height: 1.6; max-width: 100%; margin: 0; }
h1 { font-size: 22pt; border-bottom: 3px solid #26355e; padding-bottom: 8px; }
h2 { font-size: 15pt; color: #26355e; border-bottom: 2px solid #dfe6f5;
  padding-bottom: 4px; margin-top: 28px; page-break-after: avoid; }
h3 { font-size: 12.5pt; color: #3a4a75; page-break-after: avoid; }
p, li { orphans: 3; widows: 3; }
table { border-collapse: collapse; width: 100%; margin: 10px 0 14px;
  font-size: 10pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th, td { border: 1px solid #b9c4dd; padding: 5px 8px; text-align: left; vertical-align: top; }
th { background: #26355e; color: #fff; }
tr:nth-child(even) td { background: #f2f5fb; }
code { font-family: 'Fira Code',Consolas,monospace; font-size: 9.5pt;
  background: #eef1f8; border: 1px solid #d5dcea; border-radius: 4px; padding: 0 4px; }
pre { background: #101828; color: #e8ecf5; padding: 12px 14px; border-radius: 8px;
  overflow-x: hidden; white-space: pre-wrap; }
pre code { background: none; border: none; color: inherit; padding: 0; }
blockquote { border-left: 4px solid #6c8ebf; background: #eef3fc; margin: 12px 0;
  padding: 8px 14px; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
hr { border: none; border-top: 1px solid #ccd5e8; margin: 18px 0; }
ul, ol { padding-left: 22px; }
a { color: #1a56db; }
</style></head><body>${body}</body></html>`;

fs.writeFileSync(BUILD, html, 'utf8');

const os = require('os');
function findChrome() {
  const cache = path.join(os.homedir(), '.cache');
  const found = [];
  for (const root of [path.join(cache, 'ms-playwright'), path.join(cache, 'puppeteer')]) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs.readdirSync(root))
      for (const rel of ['chrome-linux/chrome', 'chrome-linux64/chrome',
        'chrome-headless-shell-linux64/chrome-headless-shell',
        'chrome-linux/chrome-headless-shell'])
        if (fs.existsSync(path.join(root, d, rel))) found.push(path.join(root, d, rel));
  }
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'])
    if (fs.existsSync(p)) found.push(p);
  return found;
}
const chrome = findChrome();
if (!chrome.length) { console.error('No Chromium found.'); process.exit(1); }
execFileSync(chrome[0], ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--no-first-run', '--virtual-time-budget=20000', '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer', '--print-to-pdf=' + OUT, 'file://' + BUILD],
  { stdio: ['ignore', 'inherit', 'inherit'] });
fs.unlinkSync(BUILD);
console.log('WROTE ' + OUT + ' (' + (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB)');
