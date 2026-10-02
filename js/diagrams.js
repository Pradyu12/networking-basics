/* ==================================================================
   DIAGRAM ENGINE
   ------------------------------------------------------------------
   Every diagram in this deck is authored in draw.io. The source is
   networking-diagrams.drawio (34 pages, 800x460); scripts/export-svgs.js
   turns each page into assets/diagrams/NN-name.svg and inlines the same
   markup into diagram-svgs.js. The markup travels with the page rather
   than being fetch()ed so the deck also works from file://, and the packet
   ids the animations drive stay present in the document.
   ================================================================== */
const DiagramEngine = {
  diagrams: {},
  animations: {},

  render(diagramName, element) {
    const fn = this.diagrams[diagramName];
    if (!fn) {
      element.innerHTML =
        `<div style="color:#94a3b8;text-align:center;padding:2em;">Diagram &quot;${diagramName}&quot; not found</div>`;
      return;
    }
    element.innerHTML = fn.call(this);
    const anim = this.animations[diagramName];
    if (anim) setTimeout(() => anim.call(this, element), 300);
  }
};

/* —  — draw.io diagrams —  —
   Every diagram is authored in networking-diagrams.drawio and exported by
   scripts/export-svgs.js into js/diagram-svgs.js (the same markup also sits in
   assets/diagrams/*.svg). They are the only diagrams in the deck.
   The markup is inlined rather than fetched so the deck also works when opened
   straight from disk, and the packet ids the animations drive stay in the document. */
const HERO_DIAGRAM_SVGS = [
  'networkPathIntro', 'deviceToNetwork', 'valueIcons', 'networkScale', 'fullNetwork',
  'deviceIcons', 'hubVsSwitch', 'switching', 'routing', 'routerVsSwitch', 'topologies',
  'encapsulation', 'osiLayers', 'osiInAction', 'tcpipModel', 'macVsIp', 'ipv4Addressing',
  'ipClasses', 'ipRanges', 'subnetting', 'tcpVsUdp', 'protocolMap', 'dnsResolution',
  'dhcpDora', 'portsAndSockets', 'internetPath', 'websiteLoading', 'firewall', 'nat',
  'securityLayers', 'troubleshooting', 'cheatSheet', 'finalMap', 'questions'
];
const MISSING_DIAGRAMS = [];
if (typeof DIAGRAM_SVGS === 'object' && DIAGRAM_SVGS) {
  HERO_DIAGRAM_SVGS.forEach((name) => {
    if (DIAGRAM_SVGS[name]) {
      DiagramEngine.diagrams[name] = function () { return DIAGRAM_SVGS[name]; };
    } else {
      /* the hand-drawn version is used instead - worth surfacing, it breaks the look */
      MISSING_DIAGRAMS.push(name);
    }
  });
}
if (MISSING_DIAGRAMS.length && typeof console !== 'undefined') {
  console.warn('diagrams: no draw.io export for', MISSING_DIAGRAMS.join(', '));
}

/* —  — Animation functions —  — */

DiagramEngine.animations.none = function(el) {};

DiagramEngine.animations.deviceToNetwork = function(el) {
  const pkt = el.querySelector('#pkt_device');
  if (pkt) {
    let pos = 0;
    setInterval(() => {
      pos = (pos + 1) % 300;
      pkt.setAttribute('cx', 150 + pos);
      pkt.style.opacity = pos < 150 ? '1' : '0';
    }, 20);
  }
};

DiagramEngine.animations.switching = function(el) {
  const pkt = el.querySelector('#pkt_switch');
  if (!pkt) return;
  let pos = 0;
  const startX = 285, endX = 365;
  setInterval(() => {
    pos = (pos + 1.5) % (endX - startX + 1);
    pkt.setAttribute('cx', startX + pos);
    pkt.style.opacity = '0.8';
  }, 30);
};

DiagramEngine.animations.routing = function(el) {
  const pkt = el.querySelector('#pkt_route');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 360;
    const rad = pos * Math.PI / 180;
    pkt.setAttribute('cx', 200 + Math.cos(rad) * 0);
    pkt.setAttribute('cy', 170);
    pkt.style.opacity = '0.8';
  }, 15);
};

DiagramEngine.animations.dnsResolution = function(el) {
  const pkt = el.querySelector('#pkt_dns');
  if (!pkt) return;
  let pos = 0;
  const startX = 100;
  /* stay on the row the packet was authored in (works for SVG + inline diagrams) */
  const trackY = parseFloat(pkt.getAttribute('cy')) || 160;
  setInterval(() => {
    pos = (pos + 1) % 600;
    pkt.setAttribute('cx', startX + pos);
    pkt.setAttribute('cy', trackY);
    pkt.style.opacity = pos < 500 ? '0.8' : '0';
  }, 25);
};

DiagramEngine.animations.dhcpDora = function(el) {
  const pkt = el.querySelector('#pkt_dhcp');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 510;
    pkt.setAttribute('cx', 140 + pos);
    pkt.style.opacity = pos < 450 ? '0.5' : '0';
  }, 20);
};

DiagramEngine.animations.internetPath = function(el) {
  const pkt = el.querySelector('#pkt_internet');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 510;
    pkt.setAttribute('cx', 100 + pos);
    pkt.style.opacity = pos < 480 ? '0.8' : '0';
  }, 20);
};

DiagramEngine.animations.websiteLoading = function(el) {
  const pkt = el.querySelector('#pkt_web');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 610;
    pkt.setAttribute('cx', 100 + pos);
    pkt.style.opacity = pos < 580 ? '0.8' : '0';
  }, 25);
};

DiagramEngine.animations.firewall = function(el) {
  const pkt = el.querySelector('#pkt_fw');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 310;
    pkt.setAttribute('cx', 140 + pos);
    pkt.style.opacity = pos < 280 ? '0.6' : '0';
  }, 30);
};

DiagramEngine.animations.nat = function(el) {
  const pkt = el.querySelector('#pkt_nat');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 1) % 230;
    pkt.setAttribute('cx', 430 + pos);
    pkt.style.opacity = pos < 210 ? '0.6' : '0';
  }, 25);
};

DiagramEngine.animations.tcpVsUdp = function(el) {
  const tcp = el.querySelector('#tcp_pkt');
  const udp = el.querySelector('#udp_pkt');
  if (tcp) setInterval(() => {
    tcp.style.opacity = Math.random() > 0.3 ? '1' : '0';
  }, 800);
  if (udp) setInterval(() => {
    udp.style.opacity = Math.random() > 0.1 ? '1' : '0';
  }, 400);
};

DiagramEngine.animations.finalMap = function(el) {
  const pkt = el.querySelector('#pkt_final');
  if (!pkt) return;
  let pos = 0;
  setInterval(() => {
    pos = (pos + 0.8) % 210;
    pkt.setAttribute('cx', 200 + pos);
        pkt.style.opacity = pos < 190 ? '0.7' : '0';
    }, 25);
};



