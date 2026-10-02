#!/usr/bin/env node
/* Generates networking-presentation/networking-diagrams.drawio (7 pages, 800x460, dark theme).
   Run: node scripts/generate-drawio.js */
'use strict';
const fs = require('fs');
const path = require('path');

const C = {
  primary: '#3b82f6', glow: '#60a5fa', cyan: '#06b6d4', cyanLt: '#22d3ee',
  purple: '#a855f7', violet: '#8b5cf6', green: '#10b981', amber: '#f59e0b',
  red: '#ef4444', text: '#e2e3e7', dim: '#94a3b8', white: '#f8fafc',
  tile: '#1e293b', deep: '#16233b', osiRow: '#111a2b', iconFill: '#1c2f4d'
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BOUNDS = { w: 800, h: 460 };
const OVERFLOW = [];

/* Labels are plain HTML: when the text is wider than its box, draw.io wraps it and
   the cell grows taller than the declared height. Content that spills past the page
   makes the export cover TWO pages (a 800x920 canvas for an 800x460 page), which
   silently wrecks the aspect ratio on the slide. Every text vertex is measured here
   and reported, so the problem is caught while generating rather than at export. */
function vtx(id, style, x, y, w, h, value = '') {
  if (value) {
    const fsM = /fontSize=(\d+)/.exec(style);
    const size = fsM ? Number(fsM[1]) : 12;
    /* strip tags/entities - they do not consume width */
    const plain = String(value).replace(/&nbsp;/g, ' ')
      .replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ');
    /* ~0.55em average glyph advance for the default sans stack */
    const needed = plain.length * size * 0.55;
    const lines = Math.max(1, Math.ceil(needed / Math.max(1, w)));
    const grow = lines * size * 1.25;
    const bottom = y + Math.max(h, grow);
    if (bottom > BOUNDS.h || y < 0 || x < 0 || x + w > BOUNDS.w) {
      OVERFLOW.push(`${id}: text "${plain.slice(0, 40)}" at y=${y} h=${h} ` +
        `wraps to ${lines} line(s) -> bottom ${Math.round(bottom)} ` +
        `(page ${BOUNDS.w}x${BOUNDS.h})`);
    }
  }
  return `<mxCell id="${id}" value="${esc(value)}" style="${style}" vertex="1" parent="1">` +
    `<mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
}
function eg(id, src, tgt, style) {
  return `<mxCell id="${id}" style="${style}" edge="1" parent="1" source="${src}" target="${tgt}">` +
    `<mxGeometry relative="1" as="geometry"/></mxCell>`;
}
/* edge with explicit waypoints - used for bus-style trunks */
function egw(id, src, tgt, style, points) {
  const pts = points.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('');
  return `<mxCell id="${id}" style="${style}" edge="1" parent="1" source="${src}" target="${tgt}">` +
    `<mxGeometry relative="1" as="geometry"><Array as="points">${pts}</Array></mxGeometry></mxCell>`;
}
function fl(id, x1, y1, x2, y2, style) {
  return `<mxCell id="${id}" style="${style}" edge="1" parent="1"><mxGeometry relative="1" as="geometry">` +
    `<mxPoint as="sourcePoint" x="${x1}" y="${y1}"/><mxPoint as="targetPoint" x="${x2}" y="${y2}"/></mxGeometry></mxCell>`;
}
const TILE = (stroke, size = 12, fill = C.tile) =>
  `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};strokeWidth=2;` +
  `fontColor=${C.text};fontSize=${size};fontStyle=1;`;
const ZONE = (stroke) =>
  `rounded=1;whiteSpace=wrap;html=1;fillColor=none;dashed=1;strokeColor=${stroke};strokeWidth=1.5;` +
  `fontColor=${stroke};fontSize=11;fontStyle=2;verticalAlign=top;spacingTop=5;`;
/* solid comparison panel (hub vs switch, TCP vs UDP, ...) */
const BOX = (stroke, fill) =>
  `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};strokeWidth=2;` +
  `fontColor=${stroke};fontSize=15;fontStyle=1;verticalAlign=top;spacingTop=8;`;
/* plain device/device-ish tile with no forced weight, for dense icon rows */
const CHIP = (stroke, size = 11, fill = C.tile) =>
  `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};strokeWidth=1.5;` +
  `fontColor=${C.text};fontSize=${size};`;
const TXT = (col, size, weight = 0, align = 'center') =>
  `text;html=1;fontColor=${col};fontSize=${size};align=${align};verticalAlign=middle;` +
  `fontStyle=${weight};strokeColor=none;fillColor=none;whiteSpace=wrap;`;
const EDGE = (col = C.cyanLt, w = 2, extra = '') =>
  `edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=${col};strokeWidth=${w};` +
  `endArrow=block;endFill=1;${extra}`;
const ICON = (col = C.glow, w = 2) =>
  `endArrow=none;html=1;strokeColor=${col};strokeWidth=${w};`;
const ELL = (fill, stroke = 'none', sw = 1) =>
  `ellipse;html=1;fillColor=${fill};strokeColor=${stroke};strokeWidth=${sw};`;

function page(name, id, cells) {
  const model = `<mxGraphModel dx="800" dy="600" grid="0" gridSize="10" guides="1" tooltips="1" ` +
    `connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="800" pageHeight="460" ` +
    `math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells}</root></mxGraphModel>`;
  return `<diagram name="${esc(name)}" id="${id}">${model}</diagram>`;
}

/* ===================== Page 1: title / networkPathIntro ===================== */
function page1() {
  const c = [];
  c.push(vtx('p1_cloud', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 30, 183, 140, 90, 'INTERNET'));
  c.push(vtx('p1_router', TILE(C.green), 200, 206, 90, 50, 'Router'));
  c.push(vtx('p1_fw', TILE(C.red), 320, 206, 90, 50, 'Firewall'));
  c.push(vtx('p1_switch', TILE(C.amber), 430, 206, 90, 50, 'Switch'));
  c.push(vtx('p1_pc', TILE(C.primary, 11), 552, 149, 84, 48, 'PC'));
  c.push(vtx('p1_server', TILE(C.purple, 11), 552, 263, 84, 48, 'Server'));
  c.push(vtx('p1_ap', TILE(C.cyan, 11), 646, 206, 68, 50, 'AP'));
  c.push(vtx('p1_phone', TILE(C.cyanLt, 11), 724, 206, 60, 50, 'Phone'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('p1_e1', 'p1_cloud', 'p1_router', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p1_e2', 'p1_router', 'p1_fw', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p1_e3', 'p1_fw', 'p1_switch', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p1_e4', 'p1_switch', 'p1_pc', EDGE(C.primary, 2, 'exitX=1;exitY=0.25;entryX=0;entryY=0.5;')));
  c.push(eg('p1_e5', 'p1_switch', 'p1_server', EDGE(C.primary, 2, 'exitX=1;exitY=0.75;entryX=0;entryY=0.5;')));
  c.push(eg('p1_e6', 'p1_switch', 'p1_ap', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p1_e7', 'p1_ap', 'p1_phone', EDGE(C.cyanLt, 2, st)));
  return page('title', 'p1_title', c.join(''));
}
/* ===================== Page 2: why-networks / valueIcons ===================== */
function page2() {
  const c = [];
  const cy = 222;
  c.push(vtx('p2_title', TXT(C.white, 17, 1), 250, 36, 300, 26, 'What Networks Enable'));
  const cols = [100, 250, 400, 550, 700];
  const labels = ['Sharing', 'Internet', 'Files', 'Apps', 'Remote Work'];
  cols.forEach((cx, i) => {
    c.push(vtx(`p2_b${i}`, ELL(C.deep, C.glow, 1.5), cx - 32, cy - 32, 64, 64));
    c.push(vtx(`p2_l${i}`, TXT(C.dim, 13), cx - 75, 268, 150, 20, labels[i]));
  });
  const ico = `rounded=1;html=1;fillColor=${C.iconFill};strokeColor=${C.glow};strokeWidth=2;`;
  let cx = cols[0]; /* share: three linked nodes */
  c.push(vtx('p2_s1', ELL(C.glow), cx - 19, cy - 15, 12, 12));
  c.push(vtx('p2_s2', ELL(C.glow), cx - 19, cy + 3, 12, 12));
  c.push(vtx('p2_s3', ELL(C.glow), cx + 7, cy - 6, 12, 12));
  c.push(fl('p2_sl1', cx - 7, cy - 6, cx + 7, cy - 3, ICON()));
  c.push(fl('p2_sl2', cx - 7, cy + 6, cx + 7, cy + 3, ICON()));
  cx = cols[1]; /* globe */
  c.push(vtx('p2_g1', ELL('none', C.glow, 2), cx - 16, cy - 16, 32, 32));
  c.push(vtx('p2_g2', ELL('none', C.glow, 1.5), cx - 7, cy - 16, 14, 32));
  c.push(fl('p2_g3', cx - 14, cy - 6, cx + 14, cy - 6, ICON(C.glow, 1.5)));
  c.push(fl('p2_g4', cx - 14, cy + 6, cx + 14, cy + 6, ICON(C.glow, 1.5)));
  cx = cols[2]; /* folder */
  c.push(vtx('p2_f1', ico, cx - 17, cy - 10, 34, 26));
  c.push(vtx('p2_f2', ico, cx - 17, cy - 16, 16, 8));
  cx = cols[3]; /* apps: 2x2 grid */
  [[-17, -17], [2, -17], [-17, 2], [2, 2]].forEach((p, j) => {
    c.push(vtx(`p2_a${j}`, ico, cx + p[0], cy + p[1], 15, 15));
  });
  cx = cols[4]; /* laptop */
  c.push(vtx('p2_lp1', ico, cx - 15, cy - 14, 30, 22));
  c.push(vtx('p2_lp2', ico, cx - 19, cy + 8, 38, 6));
  c.push(vtx('p2_cap', TXT(C.dim, 13), 250, 386, 300, 20, 'One connection, many everyday jobs'));
  return page('why-networks', 'p2_why', c.join(''));
}

/* ===================== Page 3: osi / osiLayers ===================== */
function page3() {
  const c = [];
  const layers = [
    [7, 'Application', C.cyan, 'Web, email, FTP'],
    [6, 'Presentation', C.purple, 'Encryption, encoding'],
    [5, 'Session', C.primary, 'Session control'],
    [4, 'Transport', C.amber, 'TCP: reliable, UDP: fast'],
    [3, 'Network', C.green, 'IP: addressing, routing'],
    [2, 'Data Link', C.primary, 'Ethernet, switching'],
    [1, 'Physical', C.dim, 'Cables, signals']
  ];
  c.push(vtx('p3_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'OSI Model - 7 Layers'));
  layers.forEach(([num, name, color, desc], i) => {
    const y = 70 + i * 50;
    const label = `<b><font color="${color}">L${num}</font></b>&nbsp;&nbsp;&nbsp;${name}`;
    c.push(vtx(`p3_r${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${color};strokeWidth=2;` +
      `fontColor=${C.text};fontSize=13;align=left;spacingLeft=25;verticalAlign=middle;`,
      120, y, 560, 42, label));
    c.push(vtx(`p3_d${i}`, TXT(C.dim, 11, 0, 'left'), 400, y, 270, 42, desc));
  });
  return page('osi', 'p3_osi', c.join(''));
}
/* ===================== Page 4: dns / dnsResolution ===================== */
function page4() {
  const c = [];
  c.push(vtx('p4_title', TXT(C.white, 17, 1), 250, 44, 300, 28, 'DNS Resolution'));
  c.push(vtx('p4_url', TXT(C.cyan, 15), 25, 150, 150, 24, 'www.example.com'));
  c.push(fl('p4_dn', 100, 180, 100, 206, EDGE(C.cyan, 2)));
  const steps = [
    [100, 'Browser', C.cyan],
    [250, 'Recursive Resolver', C.primary],
    [400, '.Root Server (.)', C.violet],
    [550, 'TLD (.com)', C.purple],
    [700, 'Authoritative NS', C.green]
  ];
  const row = 208;
  steps.forEach(([cx, label, col], i) => {
    c.push(vtx(`p4_s${i}`, TILE(col, 13), cx - 60, row, 120, 64, label));
    if (i < steps.length - 1) {
      c.push(fl(`p4_e${i}`, cx + 60, row + 32, steps[i + 1][0] - 60, row + 32, EDGE(C.cyan, 2.5)));
    }
  });
  c.push(vtx('p4_note', TXT(C.dim, 10), 26, 284, 92, 16, 'DNS lookup'));
  /* return path: one L-shaped dashed route back into the browser */
  c.push(fl('p4_ret', 690, 340, 152, 340, `dashed=1;endArrow=none;html=1;strokeColor=${C.dim};strokeWidth=2;`));
  c.push(fl('p4_ret2', 152, 340, 152, 276, `dashed=1;endArrow=block;endFill=1;html=1;strokeColor=${C.dim};strokeWidth=2;`));
  c.push(vtx('p4_rett', TXT(C.cyan, 13), 250, 354, 300, 20, 'Returns: 93.184.216.34'));
  return page('dns', 'p4_dns', c.join(''));
}

/* ===================== Page 5: internet-path / internetPath ===================== */
function page5() {
  const c = [];
  c.push(vtx('p5_title', TXT(C.white, 17, 1), 250, 34, 300, 28, 'How the Internet Works'));
  const row = 190, rh = 52;
  c.push(vtx('p5_laptop', TILE(C.primary, 12), 36, row, 80, rh, 'Laptop'));
  c.push(vtx('p5_ap', TILE(C.cyan, 12), 148, row, 64, rh, 'AP'));
  c.push(vtx('p5_switch', TILE(C.amber, 12), 244, row, 80, rh, 'Switch'));
  c.push(vtx('p5_router', TILE(C.green, 12), 356, row, 80, rh, 'Router'));
  c.push(vtx('p5_isp', TILE(C.primary, 12, C.deep), 468, row - 2, 72, rh + 4, 'ISP'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('p5_e1', 'p5_laptop', 'p5_ap', EDGE(C.cyan, 2, st)));
  c.push(eg('p5_e2', 'p5_ap', 'p5_switch', EDGE(C.cyan, 2, st)));
  c.push(eg('p5_e3', 'p5_switch', 'p5_router', EDGE(C.cyan, 2, st)));
  c.push(eg('p5_e4', 'p5_router', 'p5_isp', EDGE(C.primary, 2.5, st)));
  /* internet backbone (row centre y = 216, the packet track) */
  const by = row + rh / 2;
  c.push(fl('p5_bb', 544, by, 648, by, `endArrow=none;html=1;strokeColor=${C.glow};strokeWidth=3;`));
  c.push(vtx('p5_n1', ELL(C.cyan), 540, by - 4, 8, 8));
  c.push(vtx('p5_n2', ELL(C.primary), 586, by - 6, 12, 12));
  c.push(vtx('p5_n3', ELL(C.cyan), 644, by - 4, 8, 8));
  c.push(vtx('p5_server', TILE(C.green, 12, C.deep), 648, row - 2, 80, rh + 4, 'Server'));
  /* lane captions + takeaway */
  c.push(vtx('p5_c1', TXT(C.dim, 10), 36, 266, 400, 16, 'Your devices and home network'));
  c.push(vtx('p5_c2', TXT(C.dim, 10), 544, 266, 104, 16, 'Internet backbone'));
  c.push(vtx('p5_c3', TXT(C.dim, 10), 648, 266, 80, 16, 'Destination'));
  c.push(vtx('p5_cap', TXT(C.dim, 12), 200, 380, 400, 20, 'Each hop forwards your data one step closer to the server'));
  return page('internet-path', 'p5_net', c.join(''));
}
/* ===================== Page 6: final-map / finalMap ===================== */
function page6() {
  const c = [];
  c.push(vtx('p6_title', TXT(C.white, 17, 1), 240, 20, 320, 28, 'Complete Network Architecture'));
  /* VPN marker */
  c.push(vtx('p6_vpnl', TXT(C.purple, 10), 12, 84, 48, 14, 'VPN'));
  c.push(fl('p6_vpn', 60, 102, 60, 120, `endArrow=block;endFill=1;dashed=1;html=1;strokeColor=${C.purple};strokeWidth=1.5;`));
  /* chain: INTERNET -> ISP -> FW -> Core (row centre y=150, the pkt_final track) */
  c.push(vtx('p6_cloud', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=11;fontStyle=1;`, 30, 122, 84, 56, 'INTERNET'));
  c.push(vtx('p6_isp', TILE(C.primary, 10, C.deep), 128, 130, 70, 40, 'ISP'));
  c.push(vtx('p6_fw', TILE(C.red, 11), 214, 127, 64, 46, 'FW'));
  c.push(vtx('p6_core', TILE(C.amber, 11), 296, 127, 80, 46, 'Core SW'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('p6_e1', 'p6_cloud', 'p6_isp', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p6_e2', 'p6_isp', 'p6_fw', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p6_e3', 'p6_fw', 'p6_core', EDGE(C.cyanLt, 2, st)));
  /* zones (labels sit inside the top edge - stays on-page) */
  c.push(vtx('p6_dmz', ZONE(C.amber), 410, 90, 150, 100, 'DMZ'));
  c.push(vtx('p6_v10', ZONE(C.primary), 410, 214, 150, 100, 'VLAN 10'));
  c.push(vtx('p6_v20', ZONE(C.purple), 410, 338, 150, 100, 'VLAN 20'));
  const small = (id, x, y, label) => vtx(id, TILE(C.dim, 10, C.deep), x, y, 62, 40, label);
  c.push(small('p6_web', 424, 130, 'Web'));
  c.push(small('p6_mail', 494, 130, 'Mail'));
  c.push(small('p6_db', 424, 254, 'DB'));
  c.push(small('p6_app', 494, 254, 'App'));
  c.push(small('p6_pc', 424, 378, 'PC'));
  c.push(small('p6_ph', 494, 378, 'Phone'));
  /* access switches + printers */
  c.push(vtx('p6_as1', TILE(C.amber, 10), 600, 236, 80, 56, 'Access SW'));
  c.push(vtx('p6_as2', TILE(C.amber, 10), 600, 360, 80, 56, 'Access SW'));
  c.push(vtx('p6_pr1', TILE(C.dim, 11), 700, 236, 78, 56, 'Printer'));
  c.push(vtx('p6_pr2', TILE(C.dim, 11), 700, 360, 78, 56, 'Printer'));
  /* core -> zones */
  c.push(eg('p6_e4', 'p6_core', 'p6_dmz', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p6_e5', 'p6_core', 'p6_v10', EDGE(C.primary, 2, 'exitX=0.5;exitY=1;entryX=0;entryY=0.5;')));
  c.push(eg('p6_e6', 'p6_core', 'p6_v20', EDGE(C.primary, 2, 'exitX=0.5;exitY=1;entryX=0;entryY=0.5;')));
  /* vlans -> access -> printers */
  c.push(eg('p6_e7', 'p6_v10', 'p6_as1', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p6_e8', 'p6_v20', 'p6_as2', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p6_e9', 'p6_as1', 'p6_pr1', EDGE(C.dim, 1.5, st)));
  c.push(eg('p6_e10', 'p6_as2', 'p6_pr2', EDGE(C.dim, 1.5, st)));
  return page('final-map', 'p6_final', c.join(''));
}

/* ============ Page: components / fullNetwork (slide: Network Components) ============ */
function pageComponents() {
  const c = [];
  c.push(vtx('p7_title', TXT(C.white, 17, 1), 200, 24, 400, 28, 'From the internet to your devices'));
  c.push(vtx('p7_pub', TXT(C.dim, 11, 1), 22, 142, 136, 18, 'PUBLIC INTERNET'));
  /* inbound chain (row centre y = 216) */
  c.push(vtx('p7_cloud', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 30, 180, 120, 72, 'INTERNET'));
  c.push(vtx('p7_router', TILE(C.green, 12), 192, 190, 86, 52, 'Router'));
  c.push(vtx('p7_fw', TILE(C.red, 12), 306, 190, 86, 52, 'Firewall'));
  c.push(vtx('p7_switch', TILE(C.amber, 12), 420, 190, 86, 52, 'Switch'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('p7_e1', 'p7_cloud', 'p7_router', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p7_e2', 'p7_router', 'p7_fw', EDGE(C.cyanLt, 2, st)));
  c.push(eg('p7_e3', 'p7_fw', 'p7_switch', EDGE(C.cyanLt, 2, st)));
  /* the local network: every drop shares one trunk (x=526), the phone is wireless.
     The zone starts at y=64 so its caption band (~18px) clears the Laptop tile. */
  c.push(vtx('p7_lan', ZONE(C.primary), 536, 64, 254, 386, 'Local network (LAN)'));
  c.push(vtx('p7_laptop', TILE(C.glow, 11), 556, 102, 92, 52, 'Laptop'));
  c.push(vtx('p7_server', TILE(C.purple, 11), 556, 196, 92, 52, 'Server'));
  c.push(vtx('p7_printer', TILE(C.dim, 11), 556, 290, 92, 52, 'Printer'));
  c.push(vtx('p7_ap', TILE(C.cyan, 11), 556, 384, 92, 52, 'AP'));
  c.push(vtx('p7_phone', TILE(C.cyanLt, 11), 676, 384, 92, 52, 'Phone'));
  c.push(egw('p7_l1', 'p7_switch', 'p7_laptop', EDGE(C.primary, 2, st), [[526, 216], [526, 128]]));
  c.push(eg('p7_l2', 'p7_switch', 'p7_server', EDGE(C.primary, 2, st)));
  c.push(egw('p7_l3', 'p7_switch', 'p7_printer', EDGE(C.primary, 2, st), [[526, 216], [526, 316]]));
  c.push(egw('p7_l4', 'p7_switch', 'p7_ap', EDGE(C.primary, 2, st), [[526, 216], [526, 410]]));
  c.push(eg('p7_wifi', 'p7_ap', 'p7_phone', EDGE(C.cyan, 2, `dashed=1;${st}`)));
  return page('components', 'p_components', c.join(''));
}

/* ===================== Additional pages (all remaining deck diagrams) ===================== */

/* networkScale: PAN -> Internet, widening circles of reach */
function pageNetworkScale() {
  const c = [];
  const rows = [
    ['PAN', 'Personal Area Network', 'Bluetooth, near you', C.cyan, 120],
    ['LAN', 'Local Area Network', 'Building or home', C.primary, 200],
    ['WLAN', 'Wireless LAN', 'Same, no cables', C.violet, 280],
    ['MAN', 'Metropolitan Area', 'One city', C.green, 360],
    ['WAN', 'Wide Area Network', 'Across countries', C.amber, 440],
    ['Internet', 'Global network of networks', 'The whole planet', C.purple, 520]
  ];
  c.push(vtx('nsc_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'Scale of Networks'));
  rows.forEach(([abbr, name, desc, col, w], i) => {
    const y = 62 + i * 62;
    c.push(vtx(`nsc_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=2;` +
      `align=left;spacingLeft=18;verticalAlign=middle;fontSize=12;`,
      400 - w / 2, y, w, 48,
      `<b><font color="${col}">${abbr}</font></b>&nbsp;&nbsp;&nbsp;${name}`));
    c.push(vtx(`nsc_d${i}`, TXT(C.dim, 10), 400 - w / 2, y, w, 48, desc));
    if (i < rows.length - 1) c.push(fl(`nsc_a${i}`, 400, y + 48, 400, y + 62, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  });
  c.push(vtx('nsc_cap', TXT(C.dim, 12), 110, 428, 580, 18, 'Each step connects more devices across larger distances'));
  return page('network-scale', 'nsc', c.join(''));
}

/* deviceIcons: one row of hardware with the job each performs */
function pageDeviceIcons() {
  const c = [];
  const devs = [
    ['Laptop', 'Layer 7 endpoint', C.primary],
    ['Phone', 'WLAN client', C.cyanLt],
    ['Access Point', 'Wireless bridge', C.cyan],
    ['Switch', 'L2 frame forwarder', C.amber],
    ['Router', 'L3 packet forwarder', C.green],
    ['Firewall', 'Traffic inspector', C.red],
    ['Server', 'L7 service provider', C.purple]
  ];
  c.push(vtx('di_title', TXT(C.white, 17, 1), 250, 26, 300, 26, 'Network Devices'));
  devs.forEach(([name, role, col], i) => {
    const x = 30 + i * 108;
    c.push(vtx(`di_b${i}`, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.deep};strokeColor=${col};strokeWidth=2;`, x, 96, 92, 92));
    c.push(vtx(`di_t${i}`, TXT(C.col, 11, 1), x, 96, 92, 92, name));
    c.push(vtx(`di_r${i}`, TXT(C.dim, 10), x - 4, 198, 100, 30, role));
  });
  c.push(vtx('di_cap', TXT(C.dim, 12), 200, 300, 400, 20, 'Same job, different layer of the stack'));
  return page('device-icons', 'di', c.join(''));
}

/* topologies: bus, star, ring, mesh */
function pageTopologies() {
  const c = [];
  c.push(vtx('tp_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'Network Topologies'));
  const cx = [110, 300, 490, 680];
  const names = ['Bus', 'Star', 'Ring', 'Mesh'];
  cx.forEach((x, i) => {
    c.push(vtx(`tp_h${i}`, TXT(C.primary, 14, 1), x - 90, 62, 180, 24, names[i]));
  });
  /* bus */
  c.push(fl('tp_bus', 40, 190, 180, 190, `endArrow=none;html=1;strokeColor=${C.amber};strokeWidth=4;`));
  [40, 90, 140].forEach((dx, j) => {
    c.push(fl(`tp_bd${j}`, dx, 190, dx, 220, `endArrow=none;html=1;strokeColor=${C.amber};strokeWidth=1.5;`));
    c.push(vtx(`tp_bb${j}`, CHIP(C.primary, 10), dx - 20, 220, 40, 34, 'PC'));
  });
  c.push(vtx('tp_bn', TXT(C.dim, 10), 20, 268, 180, 16, 'One shared cable'));
  /* star */
  c.push(vtx('tp_s', TILE(C.amber, 11), 270, 160, 60, 60, 'S'));
  [[270, 100], [330, 100], [270, 220], [330, 220]].forEach(([ex, ey], j) => {
    c.push(fl(`tp_sl${j}`, 300, 190, ex + 20, ey + 17, `endArrow=none;html=1;strokeColor=${C.amber};strokeWidth=1.5;`));
    c.push(vtx(`tp_sb${j}`, CHIP(C.primary, 10), ex, ey, 40, 34, 'PC'));
  });
  c.push(vtx('tp_sn', TXT(C.dim, 10), 210, 268, 180, 16, 'Central hub or switch'));
  /* ring */
  [[450, 110], [530, 110], [530, 210], [450, 210]].forEach(([ex, ey], j) => {
    c.push(vtx(`tp_rb${j}`, CHIP(C.primary, 10), ex, ey, 40, 34, 'PC'));
  });
  [[450, 127, 530, 127], [530, 127, 530, 227], [530, 227, 450, 227], [450, 227, 450, 127]]
    .forEach((p, j) => c.push(fl(`tp_re${j}`, ...p, `endArrow=block;endFill=1;html=1;strokeColor=${C.amber};strokeWidth=1.5;`)));
  c.push(vtx('tp_rn', TXT(C.dim, 10), 400, 268, 180, 16, 'Each node has two links'));
  /* mesh */
  [[620, 110], [700, 110], [620, 210], [700, 210], [660, 160]].forEach(([ex, ey], j) => {
    c.push(vtx(`tp_mb${j}`, CHIP(C.primary, 10), ex, ey, 40, 34, 'PC'));
  });
  [[620, 127, 700, 127], [620, 127, 700, 227], [700, 127, 700, 227], [620, 227, 700, 227],
   [660, 160, 620, 127], [660, 160, 700, 127], [660, 160, 700, 227], [660, 160, 620, 227]]
    .forEach((p, j) => c.push(fl(`tp_me${j}`, ...p, `endArrow=none;html=1;strokeColor=${C.amber};strokeWidth=1.2;`)));
  c.push(vtx('tp_mn', TXT(C.dim, 10), 590, 268, 180, 16, 'Redundant, no single point of failure'));
  return page('topologies', 'tp', c.join(''));
}

/* deviceToNetwork: device <-> network <-> device */
function pageDeviceToNetwork() {
  const c = [];
  c.push(vtx('dn_title', TXT(C.white, 17, 1), 250, 60, 300, 26, 'Device to Device via a Network'));
  c.push(vtx('dn_a', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 90, 190, 130, 84, 'DEVICE A'));
  c.push(vtx('dn_r', TILE(C.green, 12), 335, 208, 130, 48, 'Network'));
  c.push(vtx('dn_b', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 580, 190, 130, 84, 'DEVICE B'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('dn_e1', 'dn_a', 'dn_r', EDGE(C.cyanLt, 2, st)));
  c.push(eg('dn_e2', 'dn_r', 'dn_b', EDGE(C.cyanLt, 2, st)));
  c.push(vtx('dn_cap', TXT(C.dim, 12), 250, 340, 300, 20, 'Data leaves as bits and returns as bits'));
  return page('device-to-network', 'dn', c.join(''));
}
/* hubVsSwitch: broadcast vs selective forwarding */
function pageHubVsSwitch() {
  const c = [];
  c.push(vtx('hs_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'Hub vs Switch'));
  [['hs_l', 'Hub - Broadcast', C.amber, 24], ['hs_r', 'Switch - Selective', C.green, 424]]
    .forEach(([id, label, col, x]) => c.push(vtx(id, BOX(col, C.osiRow), x, 52, 352, 330, label)));
  c.push(vtx('hs_hub', TILE(C.amber, 12), 148, 90, 104, 44, 'HUB'));
  [60, 160, 260].forEach((x, i) => {
    c.push(vtx(`hs_hp${i}`, CHIP(C.primary, 10), x, 300, 64, 34, `PC${i + 1}`));
    c.push(fl(`hs_hc${i}`, 200, 134, x + 32, 300, `endArrow=none;html=1;strokeColor=${C.amber};strokeWidth=1.5;`));
  });
  /* captions sit BELOW the PC row: the fan lines occupy the whole band above it */
  c.push(vtx('hs_hl', TXT(C.dim, 11), 40, 340, 320, 20, 'Frame copied out of every port'));
  c.push(vtx('hs_hf', TXT(C.red, 10, 1), 40, 362, 320, 20, 'PC2 and PC3 get it too'));
  c.push(vtx('hs_sw', TILE(C.green, 12), 548, 90, 104, 44, 'SWITCH'));
  [460, 560, 660].forEach((x, i) => {
    c.push(vtx(`hs_sp${i}`, CHIP(C.primary, 10), x, 300, 64, 34, `PC${i + 1}`));
    c.push(fl(`hs_sc${i}`, 600, 134, x + 32, 300, `endArrow=none;html=1;strokeColor=${C.green};strokeWidth=1.5;`));
  });
  c.push(fl('hs_sel', 600, 134, 592, 300, `endArrow=block;endFill=1;html=1;strokeColor=${C.green};strokeWidth=3;`));
  /* these two captions also live BELOW the PC row: at y=220 the switch fan spans
     x~544-647, so any caption up there is crossed by two of the three lines */
  c.push(vtx('hs_sl', TXT(C.dim, 11), 440, 340, 320, 20, 'Frame sent only to the target port'));
  c.push(vtx('hs_sf', TXT(C.green, 10, 1), 440, 362, 320, 20, 'Looked up in the MAC table'));
  c.push(vtx('hs_cap', TXT(C.dim, 12), 200, 408, 400, 20, 'This is why modern networks use switches, not hubs'));
  return page('hub-vs-switch', 'hs', c.join(''));
}

/* switching: MAC table lookup */
function pageSwitching() {
  const c = [];
  c.push(vtx('sw_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'How a Switch Learns'));
  c.push(vtx('sw_zone', ZONE(C.primary), 24, 62, 300, 330, 'Clients'));
  [130, 210, 290].forEach((y, i) => {
    c.push(vtx(`sw_p${i}`, CHIP(C.primary, 11), 64, y, 96, 44, `PC${i + 1}`));
    c.push(fl(`sw_l${i}`, 160, y + 22, 250, y + 22, `endArrow=none;html=1;strokeColor=${C.primary};strokeWidth=1.5;`));
  });
  c.push(vtx('sw_s', TILE(C.amber, 12), 250, 190, 110, 60, 'Switch'));
  c.push(vtx('sw_szone', ZONE(C.green), 596, 62, 180, 330, 'Servers'));
  [130, 210, 290].forEach((y, i) => {
    c.push(fl(`sw_r${i}`, 360, 220, 636, y + 22, `endArrow=none;html=1;strokeColor=${C.green};strokeWidth=1.5;`));
    c.push(vtx(`sw_sv${i}`, CHIP(C.purple, 11), 636, y, 96, 44, 'Server'));
  });
  /* The MAC table sits BELOW the switch-to-server fan; those three lines sweep the
     whole band between the switch and the Servers zone, so the gap column is unusable.
     The lowest line (360,220 -> 636,312) is still ~20px above the box top at y=340. */
  c.push(vtx('sw_tbl', BOX(C.cyan, C.tile), 336, 340, 236, 84, 'MAC Address Table'));
  ['AA:BB:CC:00:01', 'AA:BB:CC:00:02', 'AA:BB:CC:00:03', 'AA:BB:CC:00:04'].forEach((m, i) => {
    const col = i % 2, row = (i / 2) | 0;
    c.push(vtx(`sw_m${i}`, TXT(C.cyan, 10), 344 + col * 114, 376 + row * 22, 110, 20, `${m}  p${i + 1}`));
  });
  c.push(vtx('sw_cap', TXT(C.dim, 12), 200, 434, 400, 20, 'The switch learns which port each MAC lives behind'));
  return page('switching', 'sw', c.join(''));
}

/* routing: moving traffic between two subnets */
function pageRouting() {
  const c = [];
  c.push(vtx('rt_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'Inter-Network Routing'));
  c.push(vtx('rt_a', ZONE(C.primary), 24, 74, 220, 220, '192.168.1.0/24'));
  c.push(vtx('rt_ap1', CHIP(C.primary, 11), 44, 126, 84, 44, 'PC1'));
  c.push(vtx('rt_ap2', CHIP(C.primary, 11), 140, 126, 84, 44, 'PC2'));
  c.push(vtx('rt_b', ZONE(C.primary), 556, 74, 220, 220, '192.168.2.0/24'));
  c.push(vtx('rt_bs1', CHIP(C.purple, 11), 576, 126, 84, 44, 'Server1'));
  c.push(vtx('rt_bs2', CHIP(C.purple, 11), 672, 126, 84, 44, 'Server2'));
  c.push(vtx('rt_r', TILE(C.green, 13), 340, 158, 120, 56, 'Router'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('rt_e1', 'rt_ap1', 'rt_r', EDGE(C.cyanLt, 2, st)));
  c.push(eg('rt_e2', 'rt_r', 'rt_bs1', EDGE(C.cyanLt, 2, st)));
  c.push(vtx('rt_t1', TXT(C.cyan, 11), 244, 150, 100, 20, 'Dest: 192.168.2.10'));
  c.push(vtx('rt_t2', TXT(C.cyan, 11), 456, 150, 100, 20, 'Deliver'));
  c.push(vtx('rt_note', TXT(C.dim, 13), 200, 330, 400, 44, 'The router reads the destination IP, then forwards on the next hop - it never delivers the packet itself'));
  return page('routing', 'rt', c.join(''));
}

/* routerVsSwitch: layer 2 vs layer 3 */
function pageRouterVsSwitch() {
  const c = [];
  c.push(vtx('rv_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'Switch vs Router'));
  [['rv_l', 'Switch', 'Layer 2', C.amber, ['MAC addresses', 'Frames', 'Same network'], 24],
   ['rv_r', 'Router', 'Layer 3', C.green, ['IP addresses', 'Packets', 'Different networks'], 424]]
    .forEach(([id, name, layer, col, facts, x]) => {
      c.push(vtx(id, BOX(col, C.osiRow), x, 52, 352, 340, name));
      c.push(vtx(`${id}_l`, TXT(col, 13, 1), x, 84, 352, 24, layer));
      facts.forEach((f, i) => {
        c.push(vtx(`${id}_f${i}`, TXT(C.text, 12), x + 20, 122 + i * 34, 312, 26, f));
        c.push(vtx(`${id}_b${i}`, ELL(col), x + 6, 132 + i * 34, 8, 8));
      });
      c.push(vtx(`${id}_d`, TILE(col, 12), x + 126, 262, 100, 52, name));
    });
  c.push(vtx('rv_cap', TXT(C.dim, 12), 200, 412, 400, 20, 'A router can do everything a switch does, and more'));
  return page('router-vs-switch', 'rv', c.join(''));
}

/* encapsulation: headers added at each layer going down */
function pageEncapsulation() {
  const c = [];
  const layers = [
    ['APPLICATION DATA', C.text, 300],
    ['TCP SEGMENT', C.violet, 260],
    ['IP PACKET', C.green, 220],
    ['ETHERNET FRAME', C.primary, 180],
    ['BITS', C.cyan, 140]
  ];
  c.push(vtx('en_title', TXT(C.white, 17, 1), 250, 20, 300, 26, 'Data Encapsulation (Sending)'));
  c.push(vtx('en_src', TXT(C.dim, 11), 20, 96, 120, 18, 'Sender'));
  c.push(vtx('en_dst', TXT(C.dim, 11), 660, 96, 120, 18, 'Receiver'));
  layers.forEach(([name, col, w], i) => {
    const y = 130 + i * 56;
    c.push(vtx(`en_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=2;fontColor=${col};fontSize=12;fontStyle=1;`,
      400 - w / 2, y, w, 42, name));
    if (i < layers.length - 1) {
      c.push(fl(`en_a${i}`, 400, y + 42, 400, y + 56, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
    }
  });
  c.push(vtx('en_cap', TXT(C.dim, 12), 200, 424, 400, 20, 'Headers are added at each layer going down, stripped going up'));
  return page('encapsulation', 'en', c.join(''));
}

/* osiInAction: the same stack on both ends of a link */
function pageOsiInAction() {
  const c = [];
  const labels = ['User', 'Application', 'Presentation', 'Session', 'Transport', 'Network', 'Data Link', 'Physical', 'Network', 'Server'];
  c.push(vtx('oa_title', TXT(C.white, 17, 1), 250, 10, 300, 26, 'OSI Model in Action'));
  c.push(vtx('oa_l', TXT(C.cyan, 12, 1), 40, 60, 90, 24, 'Sender'));
  c.push(vtx('oa_r', TXT(C.green, 12, 1), 660, 60, 90, 24, 'Receiver'));
  labels.forEach((label, i) => {
    const y = 92 + i * 34;
    const col = i <= 4 ? C.primary : C.cyan;
    c.push(vtx(`oa_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=1.5;` +
      `align=left;spacingLeft=14;verticalAlign=middle;fontSize=11;fontColor=${C.text};`,
      150, y, 500, 28, `L${9 - i}: ${label}`));
    if (i < labels.length - 1) {
      c.push(fl(`oa_a${i}`, 400, y + 28, 400, y + 34, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=1.5;`));
    }
  });
  c.push(vtx('oa_cap', TXT(C.dim, 12), 200, 440, 400, 18, 'Data goes down the sender stack and up the receiver stack'));
  return page('osi-in-action', 'oa', c.join(''));
}

/* tcpipModel: four layers */
function pageTcpipModel() {
  const c = [];
  const layers = [
    ['Application', C.cyan, 'HTTP, DNS, SSH, FTP'],
    ['Transport', C.violet, 'TCP: reliable | UDP: fast'],
    ['Internet', C.primary, 'IP, ICMP, ARP'],
    ['Link', C.green, 'Ethernet, Wi-Fi, cables']
  ];
  c.push(vtx('ti_title', TXT(C.white, 17, 1), 250, 20, 300, 26, 'TCP/IP Model (4 Layers)'));
  layers.forEach(([name, col, desc], i) => {
    const y = 74 + i * 86;
    c.push(vtx(`ti_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=2;` +
      `align=left;spacingLeft=24;verticalAlign=middle;fontSize=15;fontStyle=1;fontColor=${col};`,
      110, y, 580, 72, name));
    c.push(vtx(`ti_d${i}`, TXT(C.dim, 12), 110, y, 580, 72, desc));
  });
  c.push(vtx('ti_cap', TXT(C.dim, 12), 200, 424, 400, 20, 'The practical four-layer model the internet actually runs'));
  return page('tcpip-model', 'ti', c.join(''));
}

/* macVsIp: physical vs logical addressing */
function pageMacVsIp() {
  const c = [];
  c.push(vtx('mi_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'MAC vs IP Addresses'));
  c.push(vtx('mi_l', BOX(C.green, C.osiRow), 30, 60, 350, 320, 'MAC Address'));
  c.push(vtx('mi_r', BOX(C.primary, C.osiRow), 420, 60, 350, 320, 'IP Address'));
  c.push(vtx('mi_v1', TXT(C.cyan, 14), 30, 104, 350, 24, 'A4:34:0F:12:AB:91'));
  c.push(vtx('mi_v2', TXT(C.cyan, 13), 420, 104, 350, 22, 'IPv4: 192.168.1.25'));
  c.push(vtx('mi_v3', TXT(C.cyan, 13), 420, 128, 350, 22, 'IPv6: 2001:db8::25'));
  [['Physical, burned into hardware', 160], ['Never changes', 186],
   ['Only valid on the local segment', 212], ['Forwarded by switches', 238]].forEach(([t, y], i) =>
    c.push(vtx(`mi_lf${i}`, TXT(C.text, 11), 44, y, 322, 22, t)));
  [['Logical, assigned by DHCP or manually', 160], ['Changes with the network', 186],
   ['Routable across the internet', 212], ['Forwarded by routers', 238]].forEach(([t, y], i) =>
    c.push(vtx(`mi_rf${i}`, TXT(C.text, 11), 434, y, 322, 22, t)));
  c.push(vtx('mi_cap', TXT(C.dim, 12), 200, 404, 400, 20, 'ARP bridges a MAC address to an IP address on the local network'));
  return page('mac-vs-ip', 'mi', c.join(''));
}

/* ipv4Addressing: the 32-bit structure of an IPv4 address */
function pageIpv4() {
  const c = [];
  const octets = [['192', '11000000'], ['168', '10101000'], ['1', '00000001'], ['25', '00011001']];
  const octCol = [C.primary, C.cyan, C.violet, C.green];
  c.push(vtx('ip_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'IPv4 Addressing'));
  c.push(vtx('ip_sub', TXT(C.dim, 12), 200, 42, 400, 18, '32 bits, grouped into four octets of 8 bits, written in decimal'));
  octets.forEach(([dec, bin], i) => {
    const x = 50 + i * 180;
    c.push(vtx(`ip_d${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.iconFill};strokeColor=${octCol[i]};strokeWidth=2;` +
      `fontColor=${octCol[i]};fontSize=26;fontStyle=1;fontFamily=Courier New;`,
      x, 74, 160, 58, dec));
    c.push(vtx(`ip_b${i}`, TXT(C.text, 12), x, 136, 160, 18, bin));
    c.push(vtx(`ip_n${i}`, TXT(C.dim, 10), x, 154, 160, 16, `octet ${i + 1}  (0-255)`));
  });
  /* brackets: the subnet prefix decides where one group ends and the other starts */
  const solid = `endArrow=none;html=1;`;
  c.push(fl('ip_bl', 50, 182, 590, 182, solid + `strokeColor=${C.amber};strokeWidth=2;`));
  c.push(fl('ip_bt1', 50, 176, 50, 188, solid + `strokeColor=${C.amber};strokeWidth=2;`));
  c.push(fl('ip_bt2', 590, 176, 590, 188, solid + `strokeColor=${C.amber};strokeWidth=2;`));
  c.push(fl('ip_br', 610, 182, 770, 182, solid + `strokeColor=${C.green};strokeWidth=2;`));
  c.push(fl('ip_bt3', 610, 176, 610, 188, solid + `strokeColor=${C.green};strokeWidth=2;`));
  c.push(fl('ip_bt4', 770, 176, 770, 188, solid + `strokeColor=${C.green};strokeWidth=2;`));
  c.push(vtx('ip_lbl_n', TXT(C.amber, 11, 1), 210, 190, 220, 18, 'NETWORK bits - identify the subnet'));
  c.push(vtx('ip_lbl_h', TXT(C.green, 11, 1), 590, 190, 200, 18, 'HOST bits - the device'));
  const facts = [
    ['4 octets', 'Each octet is 8 bits, so it runs from 0 to 255', C.primary, 40],
    ['2^32 addresses', '4,294,967,296 in total - publicly exhausted', C.violet, 290],
    ['Prefix /n', 'CIDR splits network bits from host bits', C.green, 540]
  ];
  facts.forEach(([head, desc, col, x], i) => {
    c.push(vtx(`ip_f${i}`, BOX(col, C.osiRow), x, 232, 220, 100, head));
    c.push(vtx(`ip_fd${i}`, TXT(C.text, 11), x + 12, 264, 196, 60, desc));
  });
  c.push(vtx('ip_ex', TXT(C.cyan, 12, 1), 200, 348, 400, 20, '192.168.1.25 with a /24 mask = subnet 192.168.1.0, host 25'));
  c.push(vtx('ip_cap', TXT(C.dim, 12), 180, 394, 440, 20, 'Routers read the network part; switches only ever see the MAC address'));
  return page('ipv4-addressing', 'ip', c.join(''));
}

/* ipClasses: the historical classful view of IPv4 */
function pageIpClasses() {
  const c = [];
  c.push(vtx('ic_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'IP Address Classes'));
  c.push(vtx('ic_sub', TXT(C.dim, 12), 180, 40, 440, 18, 'The leading bits of the first octet once decided how big the network was'));
  /* 7 boundaries for 6 columns: Class | Starts | First octet | Mask | Hosts | Use.
     cols[6] must exist or the last column gets a NaN width and escapes the page. */
  const cols = [36, 112, 228, 356, 508, 616, 764];
  ['Class', 'Starts', 'First octet', 'Default mask', 'Usable hosts', 'Typical use']
    .forEach((h, i) => c.push(vtx(`ic_h${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.tile};strokeColor=${C.dim};strokeWidth=1;` +
      `fontColor=${C.white};fontSize=11;fontStyle=1;`, cols[i], 70, cols[i + 1] - cols[i] - 6, 28, h)));
  const rows = [
    ['A', '0', '1 - 126', '255.0.0.0  (/8)', '16,777,214', 'Very large networks', C.green],
    ['B', '10', '128 - 191', '255.255.0.0  (/16)', '65,534', 'Medium business networks', C.cyan],
    ['C', '110', '192 - 223', '255.255.255.0  (/24)', '254', 'Small networks, most homes', C.primary],
    ['D', '1110', '224 - 239', 'no subnet mask', 'n/a', 'Multicast group addresses', C.purple],
    ['E', '1111', '240 - 255', 'no subnet mask', 'n/a', 'Experimental, reserved', C.dim]
  ];
  rows.forEach((row, r) => {
    const y = 106 + r * 56;
    const fill = r % 2 ? C.osiRow : C.tile;
    row.slice(0, 6).forEach((text, i) => c.push(vtx(`ic_${r}_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${C.tile};strokeWidth=1;` +
      `fontColor=${i === 0 ? row[6] : C.text};fontSize=${i === 0 ? 17 : 11};fontStyle=${i === 0 ? 1 : 0};`,
      cols[i], y, cols[i + 1] - cols[i] - 6, 48, text)));
  });
  c.push(vtx('ic_cap', TXT(C.dim, 12), 120, 398, 560, 20,
    'Classes are obsolete - CIDR (/n) sizes networks today, but these ranges still explain why 10.x and 192.168.x are private'));
  return page('ip-classes', 'ic', c.join(''));
}

/* ipRanges: the reserved and special-purpose IPv4 blocks */
function pageIpRanges() {
  const c = [];
  c.push(vtx('ir_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'IPv4 Address Ranges'));
  c.push(vtx('ir_sub', TXT(C.dim, 12), 150, 40, 500, 18, 'Whole blocks of IPv4 are set aside - never assign these on a public network'));
  const rows = [
    ['0.0.0.0/8', 'This network', 'Refers to the local network itself', C.dim],
    ['10.0.0.0/8', 'Private (Class A)', 'Largest private block, 16.7M addresses', C.amber],
    ['127.0.0.0/8', 'Loopback', 'ping localhost always answers here', C.green],
    ['169.254.0.0/16', 'APIPA', 'Self-assigned when DHCP fails', C.violet],
    ['172.16.0.0/12', 'Private (Class B)', 'Covers 172.16 to 172.31', C.amber],
    ['192.168.0.0/16', 'Private (Class C)', 'Covers 192.168.0 to 192.168.255', C.amber],
    ['224.0.0.0/4', 'Multicast', 'One-to-many delivery, e.g. IPTV', C.purple],
    ['255.255.255.255', 'Broadcast', 'Every device on this subnet', C.red]
  ];
  /* BOX is verticalAlign=top, so the heading owns the top strip; the range sits
     beside it and the note below. Offsets must clear the heading's own height. */
  rows.forEach(([range, name, note, col], i) => {
    const x = i < 4 ? 30 : 410;
    const y = 74 + (i % 4) * 74;
    c.push(vtx(`ir_b${i}`, BOX(col, C.tile), x, y, 360, 66, name));
    c.push(vtx(`ir_r${i}`, TXT(col, 13, 1), x + 12, y + 34, 150, 22, range));
    c.push(vtx(`ir_n${i}`, TXT(C.dim, 10), x + 168, y + 36, 184, 24, note));
  });
  c.push(vtx('ir_cap', TXT(C.dim, 12), 140, 392, 520, 20,
    'Private ranges are reused in every home and office - the router translates them to one public IP'));
  return page('ip-ranges', 'ir', c.join(''));
}

/* subnetting: splitting one network into smaller ones */
function pageSubnetting() {
  const c = [];
  const block = (id, name, col, x, y, w, h, fill) => {
    c.push(vtx(id,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${col};strokeWidth=2;` +
      `fontColor=${col};fontSize=12;fontStyle=1;`, x, y, w, h, name));
  };
  c.push(vtx('sb_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'Subnetting'));
  c.push(vtx('sb_sub', TXT(C.dim, 12), 250, 42, 300, 18, '192.168.1.0/24 = 256 addresses'));
  block('sb_1', '192.168.1.0/24  -  254 usable hosts', C.primary, 100, 74, 600, 48, C.iconFill);
  c.push(fl('sb_a1', 400, 122, 400, 150, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  block('sb_2a', '192.168.1.0/25  -  126 hosts', C.cyan, 100, 150, 295, 44, C.osiRow);
  block('sb_2b', '192.168.1.128/25  -  126 hosts', C.cyan, 405, 150, 295, 44, C.osiRow);
  c.push(fl('sb_a2', 247, 194, 247, 222, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  c.push(fl('sb_a3', 552, 194, 552, 222, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  block('sb_3a', '.0/26 - 62', C.violet, 100, 222, 145, 40, C.osiRow);
  block('sb_3b', '.64/26 - 62', C.violet, 250, 222, 145, 40, C.osiRow);
  block('sb_3c', '.128/26 - 62', C.primary, 405, 222, 145, 40, C.osiRow);
  block('sb_3d', '.192/26 - 62', C.primary, 555, 222, 145, 40, C.osiRow);
  c.push(vtx('sb_cap', TXT(C.dim, 12), 200, 300, 400, 20, 'More subnets means better isolation and tighter security'));
  return page('subnetting', 'sb', c.join(''));
}

/* tcpVsUdp: reliable vs fast */
function pageTcpVsUdp() {
  const c = [];
  c.push(vtx('tu_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'TCP vs UDP'));
  [['tu_l', 'TCP', C.primary, ['Connection-oriented', 'Reliable delivery', 'Ordered data',
    'Acknowledgement', 'Flow control', 'Congestion control'], 'HTTPS, SSH, FTP', 24],
   ['tu_r', 'UDP', C.cyan, ['Connectionless', 'Best effort', 'No acknowledgement',
    'Low overhead', 'Fast delivery', 'No flow control'], 'DNS, Streaming, Gaming', 424]]
    .forEach(([id, name, col, feats, use, x]) => {
      c.push(vtx(id, BOX(col, C.osiRow), x, 56, 352, 330, name));
      feats.forEach((f, i) => {
        c.push(vtx(`${id}_f${i}`, TXT(C.text, 11), x + 22, 108 + i * 34, 310, 24, f));
        c.push(vtx(`${id}_b${i}`, ELL(col), x + 8, 116 + i * 34, 8, 8));
      });
      c.push(vtx(`${id}_u`, TXT(C.cyan, 12, 1), x + 22, 322, 310, 24, use));
    });
  c.push(vtx('tu_cap', TXT(C.dim, 12), 200, 404, 400, 20, 'Choose TCP when nothing may be lost, UDP when speed wins'));
  return page('tcp-vs-udp', 'tu', c.join(''));
}

/* protocolMap: protocol, port, purpose */
function pageProtocolMap() {
  const c = [];
  const rows = [
    ['HTTP', '80', 'Web (unencrypted)', C.primary],
    ['HTTPS', '443', 'Web (encrypted)', C.cyan],
    ['DNS', '53', 'Names to IPs', C.violet],
    ['DHCP', '67/68', 'Auto IP assignment', C.purple],
    ['TCP', '-', 'Reliable transport', C.primary],
    ['UDP', '-', 'Fast transport', C.cyan],
    ['IP', '-', 'Logical addressing', C.green],
    ['ICMP', '-', 'Diagnostics (ping)', C.amber]
  ];
  c.push(vtx('pm_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'Common Protocols'));
  ['Protocol', 'Port', 'Purpose'].forEach((h, i) =>
    c.push(vtx(`pm_h${i}`, TXT(C.dim, 11, 1), [90, 250, 460][i], 52, 160, 20, h)));
  rows.forEach(([proto, port, desc, col], i) => {
    const y = 82 + i * 42;
    c.push(vtx(`pm_${i}`, TXT(col, 13, 1), 90, y, 160, 30, proto));
    c.push(vtx(`pm_d${i}`, ELL(col), 66, y + 9, 12, 12));
    c.push(vtx(`pm_p${i}`, TXT(C.textDim, 12), 250, y, 160, 30, `:${port}`));
    c.push(vtx(`pm_u${i}`, TXT(C.textDim, 12), 460, y, 260, 30, desc));
  });
  return page('protocol-map', 'pm', c.join(''));
}

/* dhcpDora: the four-step lease handshake */
function pageDhcpDora() {
  const c = [];
  c.push(vtx('dd_title', TXT(C.white, 17, 1), 250, 16, 300, 26, 'DHCP - DORA Process'));
  c.push(vtx('dd_c', CHIP(C.primary, 12), 70, 190, 110, 52, 'Client'));
  c.push(vtx('dd_s', CHIP(C.purple, 12), 620, 190, 110, 52, 'DHCP Server'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('dd_1', 'dd_c', 'dd_s', EDGE(C.amber, 2, st)));
  c.push(eg('dd_2', 'dd_s', 'dd_c', EDGE(C.green, 2, st)));
  c.push(vtx('dd_l1', TXT(C.amber, 11, 1), 300, 118, 200, 20, '1. DISCOVER (broadcast)'));
  c.push(vtx('dd_l2', TXT(C.green, 11, 1), 300, 148, 200, 20, '2. OFFER'));
  c.push(vtx('dd_l3', TXT(C.amber, 11, 1), 300, 262, 200, 20, '3. REQUEST (broadcast)'));
  c.push(vtx('dd_l4', TXT(C.green, 11, 1), 300, 292, 200, 20, '4. ACK'));
  c.push(vtx('dd_cap', TXT(C.dim, 12), 200, 344, 400, 40, 'The client broadcasts, the server answers - then the lease is locked in'));
  return page('dhcp-dora', 'dd', c.join(''));
}

/* portsAndSockets: an IP address is a building, ports are doors */
function pagePortsAndSockets() {
  const c = [];
  c.push(vtx('pa_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'Ports & Sockets'));
  c.push(vtx('pa_sub', TXT(C.dim, 12), 200, 44, 400, 20, 'An IP address is a building; ports are doors'));
  c.push(vtx('pa_b', BOX(C.primary, C.osiRow), 250, 76, 300, 250, '192.168.1.20'));
  [[80, 'HTTP', C.primary], [443, 'HTTPS', C.cyan], [22, 'SSH', C.violet],
   [53, 'DNS', C.purple], [21, 'FTP', C.amber]].forEach(([port, proto, col], i) => {
    const y = 116 + i * 42;
    c.push(vtx(`pa_n${i}`, TXT(col, 12, 1), 268, y, 60, 26, `${port}`));
    c.push(vtx(`pa_p${i}`, TXT(C.dim, 12), 336, y, 120, 26, proto));
    c.push(vtx(`pa_d${i}`, ELL(col), 254, y + 9, 10, 10));
  });
  c.push(vtx('pa_cap', TXT(C.dim, 12), 200, 342, 400, 20, 'A socket is a source IP:port plus a destination IP:port'));
  c.push(vtx('pa_ex', TXT(C.cyan, 13, 1), 200, 368, 400, 22, '192.168.1.20:443'));
  return page('ports-and-sockets', 'pa', c.join(''));
}

/* websiteLoading: the seven steps to render a page */
function pageWebsiteLoading() {
  const c = [];
  c.push(vtx('wl_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'Loading a Website'));
  const steps = [['1. DNS Lookup', C.cyan], ['2. TCP Handshake', C.primary],
    ['3. TLS Handshake', C.violet], ['4. HTTP Request', C.purple],
    ['5. Server Processes', C.green], ['6. HTTP Response', C.amber]];
  steps.forEach(([label, col], i) => {
    const x = 30 + i * 124;
    c.push(vtx(`wl_${i}`, CHIP(col, 10), x, 90, 112, 62, label));
    if (i < steps.length - 1) {
      c.push(fl(`wl_a${i}`, x + 112, 121, x + 124, 121, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
    }
  });
  c.push(vtx('wl_end', CHIP(C.text, 12), 330, 250, 140, 56, '7. Browser Renders'));
  c.push(fl('wl_dn', 586, 152, 586, 240, `endArrow=none;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  c.push(fl('wl_dn2', 586, 240, 470, 240, `endArrow=none;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  c.push(fl('wl_dn3', 470, 240, 470, 250, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  c.push(vtx('wl_cap', TXT(C.dim, 12), 200, 350, 400, 20, 'Six round trips before the first pixel is painted'));
  return page('website-loading', 'wl', c.join(''));
}

/* firewall: allow and block at the perimeter */
function pageFirewall() {
  const c = [];
  c.push(vtx('fw_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'Firewall & Network Security'));
  c.push(vtx('fw_in', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 40, 170, 120, 72, 'INTERNET'));
  c.push(vtx('fw_f', TILE(C.red, 12), 240, 180, 100, 52, 'Firewall'));
  c.push(vtx('fw_sw', TILE(C.amber, 12), 420, 180, 100, 52, 'Switch'));
  c.push(vtx('fw_pc', CHIP(C.primary, 11), 600, 130, 90, 44, 'PC'));
  c.push(vtx('fw_sv', CHIP(C.purple, 11), 600, 230, 90, 44, 'Server'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('fw_e1', 'fw_in', 'fw_f', EDGE(C.cyanLt, 2, st)));
  c.push(eg('fw_e2', 'fw_f', 'fw_sw', EDGE(C.cyanLt, 2, st)));
  c.push(eg('fw_e3', 'fw_sw', 'fw_pc', EDGE(C.primary, 2, st)));
  c.push(eg('fw_e4', 'fw_sw', 'fw_sv', EDGE(C.primary, 2, st)));
  c.push(vtx('fw_a', TXT(C.green, 11, 1), 196, 118, 190, 20, 'Allow: 80, 443'));
  c.push(vtx('fw_b', TXT(C.red, 11, 1), 196, 244, 190, 20, 'Block: 22, 3389'));
  c.push(fl('fw_bl', 20, 140, 92, 140, `dashed=1;endArrow=block;endFill=1;html=1;strokeColor=${C.red};strokeWidth=3;`));
  c.push(vtx('fw_bt', TXT(C.red, 10, 1), 6, 116, 80, 20, 'Blocked'));
  c.push(vtx('fw_cap', TXT(C.dim, 12), 200, 330, 400, 20, 'Every packet is inspected against a rule set before it passes'));
  return page('firewall', 'fw', c.join(''));
}

/* nat: many private IPs behind one public IP */
function pageNat() {
  const c = [];
  c.push(vtx('nt_title', TXT(C.white, 17, 1), 250, 14, 300, 26, 'NAT - Network Address Translation'));
  c.push(vtx('nt_z', ZONE(C.green), 30, 76, 240, 260, 'Private Network'));
  ['192.168.1.10', '192.168.1.11', '192.168.1.12'].forEach((ip, i) =>
    c.push(vtx(`nt_i${i}`, TXT(C.cyan, 11), 50, 108 + i * 26, 200, 22, ip)));
  ['PC1', 'PC2', 'Phone'].forEach((n, i) =>
    c.push(vtx(`nt_p${i}`, CHIP(C.primary, 10), 50 + i * 74, 250, 64, 34, n)));
  c.push(vtx('nt_r', TILE(C.green, 12), 350, 180, 120, 56, 'NAT Router'));
  c.push(vtx('nt_pub', TXT(C.cyan, 11), 300, 250, 220, 22, 'Public IP: 203.0.113.5'));
  c.push(vtx('nt_in', `shape=cloud;html=1;fillColor=${C.deep};strokeColor=${C.glow};strokeWidth=2;fontColor=${C.text};fontSize=12;fontStyle=1;`, 570, 178, 130, 60, 'Internet'));
  const st = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
  c.push(eg('nt_e1', 'nt_p2', 'nt_r', EDGE(C.primary, 2.5, st)));
  c.push(eg('nt_e2', 'nt_r', 'nt_in', EDGE(C.primary, 2.5, st)));
  c.push(vtx('nt_t1', TXT(C.cyan, 10), 262, 150, 210, 20, '192.168.1.10:4567'));
  c.push(vtx('nt_t2', TXT(C.cyan, 10), 476, 150, 210, 20, '203.0.113.5:4567'));
  c.push(vtx('nt_cap', TXT(C.dim, 12), 200, 366, 400, 20, 'One public IP, many private devices - all reachable from outside'));
  return page('nat', 'nt', c.join(''));
}

/* securityLayers: layered defences */
function pageSecurityLayers() {
  const c = [];
  const layers = [
    ['Firewall', C.primary, 'Perimeter defence'],
    ['VPN', C.cyan, 'Encrypted tunnels'],
    ['IDS / IPS', C.violet, 'Monitor and block'],
    ['Segmentation', C.purple, 'VLAN isolation'],
    ['Authentication', C.amber, 'Verify identity'],
    ['Encryption', C.green, 'Protect the data']
  ];
  c.push(vtx('sl_title', TXT(C.white, 17, 1), 250, 12, 300, 26, 'Network Security Layers'));
  layers.forEach(([name, col, desc], i) => {
    const y = 60 + i * 58;
    c.push(vtx(`sl_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=2;` +
      `align=left;spacingLeft=26;verticalAlign=middle;fontSize=13;fontStyle=1;fontColor=${col};`,
      110, y, 580, 44, name));
    c.push(vtx(`sl_d${i}`, TXT(C.dim, 12), 110, y, 580, 44, desc));
    c.push(vtx(`sl_b${i}`, ELL(col), 86, y + 17, 10, 10));
  });
  c.push(vtx('sl_cap', TXT(C.dim, 12), 200, 412, 400, 20, 'Defence in depth: no single layer has to be perfect'));
  return page('security-layers', 'sl', c.join(''));
}

/* troubleshooting: an ordered checklist */
function pageTroubleshooting() {
  const c = [];
  c.push(vtx('ts_title', TXT(C.white, 17, 1), 250, 10, 300, 26, 'Troubleshooting Flow'));
  c.push(vtx('ts_q', CHIP(C.red, 12), 250, 52, 300, 40, 'No internet connection?'));
  c.push(fl('ts_qa', 400, 92, 400, 108, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
  const steps = ['1. Check cable & Wi-Fi', '2. ip addr / ifconfig', '3. ping 192.168.1.1',
                 '4. ping 8.8.8.8', '5. nslookup google.com', '6. traceroute 8.8.8.8'];
  steps.forEach((s, i) => {
    const y = 108 + i * 42;
    c.push(vtx(`ts_${i}`, CHIP(C.textDim, 11), 250, y, 300, 34, s));
    if (i < steps.length - 1) {
      c.push(fl(`ts_a${i}`, 400, y + 34, 400, y + 42, `endArrow=block;endFill=1;html=1;strokeColor=${C.cyan};strokeWidth=2;`));
    }
  });
  c.push(vtx('ts_cap', TXT(C.dim, 12), 200, 366, 400, 20, 'Work outward: link, local IP, gateway, internet, DNS'));
  return page('troubleshooting', 'ts', c.join(''));
}

/* cheatSheet: ten cards of what to remember */
function pageCheatSheet() {
  const c = [];
  const cards = [
    ['MAC', 'Physical ID', C.green, 'A4:34:0F:12:AB:91'],
    ['IP', 'Logical address', C.primary, '192.168.1.25'],
    ['Switch', 'L2 device', C.amber, 'MAC tables'],
    ['Router', 'L3 device', C.green, 'IP routing'],
    ['TCP', 'Reliable', C.primary, 'Port 80, 443'],
    ['UDP', 'Fast', C.cyan, 'Port 53'],
    ['DNS', 'Names to IPs', C.violet, 'Port 53'],
    ['DHCP', 'Auto IPs', C.purple, 'Port 67/68'],
    ['HTTPS', 'Encrypted web', C.amber, 'Port 443'],
    ['Firewall', 'Traffic filter', C.red, 'Allow / Block']
  ];
  c.push(vtx('cs_title', TXT(C.white, 17, 1), 250, 10, 300, 26, 'Networking Cheat Sheet'));
  cards.forEach(([name, desc, col, detail], i) => {
    const x = 30 + (i % 5) * 150;
    const y = 56 + Math.floor(i / 5) * 150;
    c.push(vtx(`cs_${i}`,
      `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.osiRow};strokeColor=${col};strokeWidth=2;` +
      `verticalAlign=top;spacingTop=12;fontColor=${col};fontSize=13;fontStyle=1;`,
      x, y, 132, 128, name));
    c.push(vtx(`cs_d${i}`, TXT(C.dim, 9), x, y + 36, 132, 34, desc));
    c.push(vtx(`cs_v${i}`, TXT(C.textDim, 8), x, y + 72, 132, 44, detail));
  });
  c.push(vtx('cs_cap', TXT(C.dim, 12), 200, 366, 400, 20, 'If you remember one thing per slide, remember these'));
  return page('cheat-sheet', 'cs', c.join(''));
}

/* questions: closing slide */
function pageQuestions() {
  const c = [];
  for (let i = 0; i < 11; i++) {
    const x = 60 + i * 66;
    const y = 150 + Math.round(Math.sin(i * 0.5) * 40);
    c.push(fl(`qu_l${i}`, x, y, x + 66, 150 + Math.round(Math.sin((i + 1) * 0.5) * 40),
      `endArrow=none;html=1;strokeColor=${C.primary};strokeWidth=1;opacity=40;`));
    c.push(vtx(`qu_d${i}`, ELL(C.primary), x - 4, y - 4, 8, 8));
  }
  c.push(vtx('qu_q', TXT(C.primary, 130, 1), 250, 240, 300, 150, '?'));
  c.push(vtx('qu_t', TXT(C.white, 30, 1), 250, 330, 300, 40, 'Questions'));
  c.push(vtx('qu_s', TXT(C.dim, 16), 250, 374, 300, 24, 'Thank you'));
  return page('questions', 'qu', c.join(''));
}

const PAGES = [page1, page2, pageComponents, page3, page4, page5, page6,
  pageNetworkScale, pageDeviceIcons, pageTopologies, pageDeviceToNetwork,
  pageHubVsSwitch, pageSwitching, pageRouting, pageRouterVsSwitch,
  pageEncapsulation, pageOsiInAction, pageTcpipModel, pageMacVsIp,
  pageIpv4, pageIpClasses, pageIpRanges,
  pageSubnetting, pageTcpVsUdp, pageProtocolMap, pageDhcpDora,
  pagePortsAndSockets, pageWebsiteLoading, pageFirewall, pageNat,
  pageSecurityLayers, pageTroubleshooting, pageCheatSheet, pageQuestions];
const mxfile = `<mxfile host="app.diagrams.net" modified="2026-09-30T00:00:00.000Z" agent="generate-drawio" ` +
  `version="31.5.3" type="device">\n` +
  PAGES.map((f) => f()).join('\n') +
  `\n</mxfile>\n`;

const out = path.join(__dirname, '..', 'networking-diagrams.drawio');
fs.writeFileSync(out, mxfile, 'utf8');
console.log('WROTE', out, mxfile.length, 'bytes');
PAGES.forEach((fn, i) => {
  const cells = (fn().match(/mxCell /g) || []).length;
  console.log(`page ${i + 1}: ~${cells} cells`);
});

if (OVERFLOW.length) {
  console.log(`\n${OVERFLOW.length} label(s) overflow the ${BOUNDS.w}x${BOUNDS.h} page:`);
  OVERFLOW.forEach((m) => console.log('  ! ' + m));
  console.log('each of these makes its page export as a two-page canvas\n');
}