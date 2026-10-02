#!/usr/bin/env node
/* Exports every page of networking-diagrams.drawio to:
     - assets/diagrams/NN-name.svg   (standalone, viewable in a browser)
     - js/diagram-svgs.js            (same markup as DIAGRAM_SVGS, inlined so the
                                      deck also works when opened via file://)
   Run: node scripts/export-svgs.js   (needs the drawio desktop CLI + a display)

   Why the JS copy: the slide engine injects an SVG string into the DOM, the three
   animated slides move packets with setAttribute('cx', ...), and fetch() is blocked
   for file:// URLs - so the markup has to travel with the page. */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'networking-diagrams.drawio');
const SVG_DIR = path.join(ROOT, 'assets', 'diagrams');
const JS_OUT = path.join(ROOT, 'js', 'diagram-svgs.js');
const DRAWIO = process.env.DRAWIO_BIN || '/snap/bin/drawio';

/* Page order MUST match the PAGES array at the bottom of scripts/generate-drawio.js. */
const PAGES = [
  { page: 1, name: 'networkPathIntro', file: '01-network-path-intro.svg', label: 'Networking path: internet to devices' },
  { page: 2, name: 'valueIcons', file: '02-value-icons.svg', label: 'What networks enable' },
  { page: 3, name: 'fullNetwork', file: '03-network-components.svg', label: 'Network components: internet to devices' },
  { page: 4, name: 'osiLayers', file: '04-osi-layers.svg', label: 'OSI model, seven layers' },
  { page: 5, name: 'dnsResolution', file: '05-dns-resolution.svg', label: 'DNS resolution steps' },
  { page: 6, name: 'internetPath', file: '06-internet-path.svg', label: 'Path from laptop to server' },
  { page: 7, name: 'finalMap', file: '07-final-map.svg', label: 'Complete network architecture' },
  { page: 8, name: 'networkScale', file: '08-network-scale.svg', label: 'Scale of networks' },
  { page: 9, name: 'deviceIcons', file: '09-device-icons.svg', label: 'Network devices and their jobs' },
  { page: 10, name: 'topologies', file: '10-topologies.svg', label: 'Bus, star, ring and mesh topologies' },
  { page: 11, name: 'deviceToNetwork', file: '11-device-to-network.svg', label: 'Device to device via a network' },
  { page: 12, name: 'hubVsSwitch', file: '12-hub-vs-switch.svg', label: 'Hub broadcast vs switch forwarding' },
  { page: 13, name: 'switching', file: '13-switching.svg', label: 'How a switch learns MAC addresses' },
  { page: 14, name: 'routing', file: '14-routing.svg', label: 'Inter-network routing' },
  { page: 15, name: 'routerVsSwitch', file: '15-router-vs-switch.svg', label: 'Switch vs router' },
  { page: 16, name: 'encapsulation', file: '16-encapsulation.svg', label: 'Data encapsulation' },
  { page: 17, name: 'osiInAction', file: '17-osi-in-action.svg', label: 'OSI model in action' },
  { page: 18, name: 'tcpipModel', file: '18-tcpip-model.svg', label: 'TCP/IP four layer model' },
  { page: 19, name: 'macVsIp', file: '19-mac-vs-ip.svg', label: 'MAC vs IP addresses' },
  { page: 20, name: 'ipv4Addressing', file: '20-ipv4-addressing.svg', label: 'IPv4 structure: 32 bits in four octets' },
  { page: 21, name: 'ipClasses', file: '21-ip-classes.svg', label: 'IP address classes A to E' },
  { page: 22, name: 'ipRanges', file: '22-ip-ranges.svg', label: 'Private and reserved IPv4 ranges' },
  { page: 23, name: 'subnetting', file: '23-subnetting.svg', label: 'Subnetting' },
  { page: 24, name: 'tcpVsUdp', file: '24-tcp-vs-udp.svg', label: 'TCP vs UDP' },
  { page: 25, name: 'protocolMap', file: '25-protocol-map.svg', label: 'Common protocols and ports' },
  { page: 26, name: 'dhcpDora', file: '26-dhcp-dora.svg', label: 'DHCP DORA process' },
  { page: 27, name: 'portsAndSockets', file: '27-ports-and-sockets.svg', label: 'Ports and sockets' },
  { page: 28, name: 'websiteLoading', file: '28-website-loading.svg', label: 'Loading a website' },
  { page: 29, name: 'firewall', file: '29-firewall.svg', label: 'Firewall and network security' },
  { page: 30, name: 'nat', file: '30-nat.svg', label: 'NAT address translation' },
  { page: 31, name: 'securityLayers', file: '31-security-layers.svg', label: 'Network security layers' },
  { page: 32, name: 'troubleshooting', file: '32-troubleshooting.svg', label: 'Troubleshooting flow' },
  { page: 33, name: 'cheatSheet', file: '33-cheat-sheet.svg', label: 'Networking cheat sheet' },
  { page: 34, name: 'questions', file: '34-questions.svg', label: 'Questions' }
];

/* Packet fixtures - the animations only ever move these with setAttribute('cx', ...),
   so each one must survive export as a real <circle> carrying a stable id.
   class="packet" picks up the cyan fill + glow from css/diagrams.css.
   cy is the row the packet travels along (kept in sync with the page layout). */
const PACKETS = {
  dnsResolution: [{ id: 'pkt_dns', cx: 100, cy: 240, r: 4 }],
  internetPath: [{ id: 'pkt_internet', cx: 100, cy: 216, r: 4 }],
  finalMap: [{ id: 'pkt_final', cx: 200, cy: 150, r: 4 }],
  deviceToNetwork: [{ id: 'pkt_device', cx: 200, cy: 232, r: 4 }],
  switching: [{ id: 'pkt_switch', cx: 285, cy: 152, r: 4 }],
  routing: [{ id: 'pkt_route', cx: 200, cy: 186, r: 4 }],
  dhcpDora: [{ id: 'pkt_dhcp', cx: 180, cy: 216, r: 4 }],
  portsAndSockets: [{ id: 'pkt_port', cx: 400, cy: 200, r: 4 }],
  websiteLoading: [{ id: 'pkt_web', cx: 140, cy: 121, r: 4 }],
  firewall: [{ id: 'pkt_fw', cx: 160, cy: 206, r: 4 }],
  nat: [{ id: 'pkt_nat', cx: 340, cy: 208, r: 4 }],
  osiInAction: [{ id: 'pkt_osi', cx: 400, cy: 106, r: 4 }],
  tcpVsUdp: [
    { id: 'tcp_pkt', cx: 200, cy: 352, r: 4 },
    { id: 'udp_pkt', cx: 600, cy: 352, r: 4 }
  ]
};

const PKT_FILL = '#22d3ee';

/* drawio writes straight into assets/diagrams: the snap cannot write to hidden
   paths in $HOME (dotfiles sit outside the home interface) and gets a private /tmp. */
function exportPage(page, outFile) {
  execFileSync(DRAWIO, [
    '-x', '-f', 'svg', '-t', '--size', 'page',
    /* light theme pins the authored colours instead of emitting light-dark() pairs:
       the deck has a fixed dark background, so the diagram must never flip colours */
    '--theme', 'light',
    '-p', String(page), '-o', outFile, SRC
  ], {
    env: { ...process.env, DISPLAY: process.env.DISPLAY || ':0' },
    stdio: 'pipe'
  });
  return fs.readFileSync(outFile, 'utf8');
}

function postProcess(svg, name) {
  let s = svg;
  /* strip the embedded source copy drawio keeps for round-tripping */
  s = s.replace(/<content>[\s\S]*?<\/content>/g, '');
  /* strip the accessibility shim that links back to drawio.com */
  s = s.replace(/<a [^>]*drawio\.com[^>]*>[\s\S]*?<\/a>/g, '');
  /* Drop drawio's rasterised <image> copies of every text label. Each label is a
     <switch> of <foreignObject> (real, selectable HTML text) + a base64 PNG
     fallback; the PNGs are ~80% of the file and no browser that runs this deck
     ever selects them. */
  const before = s.length;
  s = s.replace(/<image\b[^>]*data:image\/png;base64,[^>]*\/>/g, '');
  const saved = before - s.length;
  /* no XML prologue inside an HTML document */
  s = s.replace(/^\s*<\?xml[^>]*\?>\s*/, '').replace(/^\s*<!DOCTYPE[^>]*>\s*/i, '');
  /* Tag the connector paths. draw.io emits every edge as a <path pointer-events="stroke">;
     shapes are <rect>/<ellipse>/text instead, so this is an exact test for "is an edge".
     The class lets css/diagrams.css run a gentle dash-flow on connectors without
     touching outlines or text. */
  let edges = 0;
  s = s.replace(/<path\b([^>]*)\/>/g, (m, attrs) => {
    if (!/pointer-events="stroke"/.test(attrs)) return m;
    edges++;
    return `<path class="edge"${attrs}/>`;
  });
  /* the CSS sizes diagrams via .network-svg */
  s = s.replace(/<svg([^>]*)>/, (m, attrs) => {
    let a = attrs.replace(/\sclass="[^"]*"/, '');
    if (!/xmlns=/.test(a)) a = ' xmlns="http://www.w3.org/2000/svg"' + a;
    if (!/preserveAspectRatio=/.test(a)) a += ' preserveAspectRatio="xMidYMid meet"';
    return `<svg${a} class="network-svg" role="img" aria-label="${name}">`;
  });
  /* packet fixtures go last so they paint on top of the diagram */
  const packets = (PACKETS[name] || []).map((p) =>
    `<circle id="${p.id}" class="packet" cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${PKT_FILL}" opacity="0"/>`
  ).join('');
  s = s.replace(/<\/svg>[\s\S]*$/, `${packets}</svg>`);
  const out = s.trim() + '\n';
  /* fail loudly rather than shipping a broken asset */
  const problems = [];
  if (!/^<svg\b/.test(out)) problems.push('missing <svg> root');
  if (!/viewBox="0 0 800 460"/.test(out)) problems.push('unexpected viewBox');
  if (/data:image\//.test(out)) problems.push('base64 image still present');
  if (/light-dark\(/.test(out)) problems.push('theme-dependent colour left in');
  if (!/class="network-svg"/.test(out)) problems.push('missing .network-svg class');
  for (const p of PACKETS[name] || []) {
    if (!out.includes(`id="${p.id}"`)) problems.push(`missing packet ${p.id}`);
  }
  if (problems.length) throw new Error(`${name}: ${problems.join('; ')}`);
  if (!edges) console.warn(`  note: ${name} has no tagged connectors`);
  return { svg: out, saved, edges };
}

function toJsString(svg) {
  return svg.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

fs.mkdirSync(SVG_DIR, { recursive: true });
const entries = [];
let total = 0;

for (const p of PAGES) {
  const target = path.join(SVG_DIR, p.file);
  const { svg, saved, edges } = postProcess(exportPage(p.page, target), p.name);
  fs.writeFileSync(target, svg, 'utf8');
  total += svg.length;
  entries.push({ ...p, svg });
  console.log(`${p.file.padEnd(28)} ${String(svg.length).padStart(7)} bytes  ` +
    `${String(edges).padStart(3)} edges  (-${(saved / 1024).toFixed(1)} KB text rasters)`);
}

/* pages get renamed/removed as the deck grows - never leave orphaned assets behind */
const expected = new Set(PAGES.map((p) => p.file));
for (const f of fs.readdirSync(SVG_DIR)) {
  if (f.endsWith('.svg') && !expected.has(f)) {
    fs.unlinkSync(path.join(SVG_DIR, f));
    console.log(`removed stale ${f}`);
  }
}

const header = `/* GENERATED FILE - do not edit by hand.
   Source: networking-diagrams.drawio (page order matches the PAGES table in
   scripts/export-svgs.js). Regenerate with: node scripts/export-svgs.js
   The same markup lives, unmodified, in assets/diagrams/*.svg. */
'use strict';
const DIAGRAM_SVGS = {`;

const body = entries.map((e) =>
  `  /* ${e.label} */\n  ${e.name}: \`${toJsString(e.svg)}\``
).join(',\n');

fs.writeFileSync(JS_OUT, `${header}\n${body}\n};\n`, 'utf8');
console.log(`\ntotal svg ${(total / 1024).toFixed(1)} KB`);
console.log(`WROTE ${SVG_DIR}/*.svg`);
console.log(`WROTE ${JS_OUT} ${(fs.statSync(JS_OUT).size / 1024).toFixed(1)} KB`);
