// Slide data for Networking Basics presentation
//
// One entry per slide. app.js renders them in array order and uses `id` as the
// index, so the ids must stay sequential from 0. `diagram` must match a page
// name in scripts/generate-drawio.js (PAGES) and scripts/export-svgs.js.
// Every diagram in this deck is authored in draw.io.
const slides = [
  {
    id: 0,
    layout: "title",
    title: "Networking Basics",
    subtitle: "Understanding How Devices Communicate",
    diagram: "networkPathIntro",
    notes: "Welcome to Networking Basics. Today we will explore how devices communicate, starting with the fundamental concepts and building up to a complete picture of how the internet works.",
    analogy: "Think of this as learning the postal system before tracing one letter."
  },
  {
    id: 1,
    title: "What Is Networking?",
    eyebrow: "Foundation",
    bulletItems: [
      "Two or more devices connected to exchange data",
      "Devices follow shared rules called protocols",
      "Connections use cables, radio waves, or both",
      "Networks range from two laptops to global scales"
    ],
    diagram: "deviceToNetwork",
    notes: "Explain that networking underpins everything digital. A printer and laptop sharing a home router form a network even without the internet. Protocols are the agreed rules that make unlike devices work together. Ask: what does your phone do when it finds a printer?",
    analogy: "A network is like a road system: connections are roads, devices are destinations, protocols are traffic rules.",
    visual: "YOUR DEVICE -> LOCAL NETWORK -> INTERNET -> SERVICE",
    visualLabel: "Today's journey"
  },
  {
    id: 2,
    title: "Why Do We Need Networks?",
    eyebrow: "Purpose",
    bulletItems: [
      "Share resources: printers, files, storage, internet access",
      "Communicate: email, chat, calls, video meetings",
      "Use services: websites, cloud apps, maps, streaming",
      "Manage devices centrally across homes and organizations"
    ],
    diagram: "valueIcons",
    notes: "Ask the room which networked service they used today. Point out that networks reduce duplicated equipment, enable immediate communication, and let applications run on remote servers.",
    analogy: "A shared network printer is like a community photocopier: one useful resource serves many people."
  },
  {
    id: 3,
    title: "Types of Networks",
    eyebrow: "Classification",
    diagram: "networkScale",
    notes: "Explain each scale with a relatable example. PAN is your watch syncing to your phone. LAN is your home wifi. WLAN is the same but wireless. MAN covers a city. WAN crosses countries. The internet is the ultimate WAN.",
    analogy: "Each network type is like a circle of communication: your circle of friends (PAN), your neighborhood (LAN), your city (MAN), the whole country (WAN)."
  },
  {
    id: 4,
    title: "Network Components",
    eyebrow: "Anatomy",
    diagram: "fullNetwork",
    notes: "Introduce the end-to-end path. Every box at home may combine multiple functions, but the jobs are distinct. Emphasize endpoints: servers are endpoints too; they provide services to clients.",
    analogy: "A delivery needs a sender, a route, a carrier, rules, and a destination."
  },
  {
    id: 5,
    title: "Network Devices",
    eyebrow: "Hardware",
    bulletItems: [
      "Hub: broadcasts all traffic to every port",
      "Switch: forwards frames only to the destination port",
      "Router: connects different networks and routes packets",
      "Access Point: bridges wired and wireless networks",
      "Modem: converts digital signals to analog and vice versa",
      "Firewall: inspects and filters traffic for security"
    ],
    diagram: "deviceIcons",
    notes: "Explain each device's role. A hub is like a megaphone - everything it hears, it shouts to everyone. A switch is like a smart receptionist - it knows where each device is and delivers only to the right recipient. A router is like a border guard - it knows the way to other networks."
  },
  {
    id: 6,
    title: "Hub vs Switch",
    eyebrow: "Comparison",
    diagram: "hubVsSwitch",
    notes: "Demonstrate the broadcast vs selective forwarding. When PC1 sends to PC2, a hub sends to ALL ports. A switch learns MAC addresses and sends only to PC2. This is why modern networks use switches, not hubs.",
    analogy: "A hub is a town crier announcing to everyone. A switch is a receptionist delivering messages to specific offices."
  },
  {
    id: 7,
    title: "Switching",
    eyebrow: "Layer 2",
    diagram: "switching",
    notes: "Explain MAC address learning. When a switch receives a frame, it records the source MAC and the port. Then when it needs to send to a destination MAC, it looks up its table. If unknown, it floods (like a hub) until it learns. Explain the CAM table concept.",
    analogy: "A switch learns like a doorman who remembers which badge belongs to which employee."
  },
  {
    id: 8,
    title: "Routing",
    eyebrow: "Layer 3",
    bulletItems: [
      "Routers connect different IP networks",
      "They examine destination IP addresses",
      "They consult routing tables to make forwarding decisions",
      "Each hop moves the packet closer to its destination"
    ],
    diagram: "routing",
    notes: "Explain that routers strip the Layer 2 frame and make decisions based on IP headers. Each router in the path chooses the next hop. The default route catches unknown destinations. Routers on the same LAN exchange ARP to find each other's MAC addresses.",
    analogy: "A router is like a city border guard: it checks the address on every packet and points it toward the right direction."
  },
  {
    id: 9,
    title: "Router vs Switch",
    eyebrow: "Comparison",
    bulletItems: [
      "Switch: LAN device, uses MAC addresses, operates at Layer 2",
      "Router: Network device, uses IP addresses, operates at Layer 3",
      "Switch: Forwards frames within the same network segment",
      "Router: Routes packets between different networks"
    ],
    diagram: "routerVsSwitch",
    notes: "Emphasize the fundamental difference: switches connect devices within a network, routers connect networks themselves. In home routers, both functions are combined. Enterprise networks separate these roles for better control.",
    analogy: "A switch is a building concierge. A router is a postal sorting office."
  },
  {
    id: 10,
    title: "Network Topologies",
    eyebrow: "Layout",
    diagram: "topologies",
    notes: "Each topology has tradeoffs. Bus is simple but a break kills the segment. Star is reliable but the switch is a single point of failure. Ring has predictable latency. Mesh offers redundancy. Tree scales well. Modern networks are usually star-of-stars (hierarchical) with redundant links.",
    analogy: "Network topologies are like city planning: grid streets, ring roads, star-shaped suburbs."
  },
  {
    id: 11,
    title: "Data Encapsulation",
    eyebrow: "Process",
    diagram: "encapsulation",
    bulletItems: [
      "Data is wrapped in layers of headers as it descends",
      "Each layer adds its own control information",
      "On the receiving side, each layer strips its header",
      "This enables modularity and interoperability"
    ],
    visual: "Application Data\n   -> TCP Segment (L4)\n   -> IP Packet (L3)\n   -> Ethernet Frame (L2)\n   -> Bits (L1)",
    visualLabel: "Encapsulate, carry, unwrap",
    notes: "Walk down from the browser and then up at the server. The local Wi-Fi frame is addressed to the gateway's MAC when the server is remote. Routers unwrap the incoming link frame and create another frame for the next link. HTTPS/TLS crosses the simple OSI boundaries.",
    analogy: "A letter is written, protected in an envelope, routed by city and street, carried over successive roads, then unwrapped at each level."
  },
  {
    id: 12,
    title: "OSI Model",
    eyebrow: "Framework",
    diagram: "osiLayers",
    notes: "The OSI model is a teaching tool. It maps functions to seven layers. In practice, TCP/IP does not follow it exactly, but the concepts are still useful. Layers 1-2 are physical media, layer 3 is logical addressing, layers 4-7 handle end-to-end communication.",
    analogy: "The OSI layers are like a shipping manifest: each layer adds or checks information as the package moves through the system."
  },
  {
    id: 13,
    title: "OSI Model In Action",
    eyebrow: "Layers",
    diagram: "osiInAction",
    bulletItems: [
      "Application: browser creates HTTPS request; DNS may resolve the address",
      "Presentation/Session: data is encoded and TLS protects the conversation",
      "Transport/Network: TCP uses port 443; IP addresses the server",
      "Data Link/Physical: Wi-Fi or Ethernet frames reach the next hop"
    ],
    visual: "Browser data -> TLS + TCP 443 -> IP packet to server -> Wi-Fi frame to gateway -> radio bits",
    visualLabel: "The delivery layers",
    notes: "Devices can operate at multiple layers. A modern Layer 3 switch routes as well as switches. A firewall may inspect IPs, ports, connection state, and application data. The simple layer associations are a first map, not a rule that every product fits one box.",
    analogy: "These are the carrier, city address, local delivery label, and the physical road or signal."
  },
  {
    id: 14,
    title: "TCP/IP Model",
    eyebrow: "Practical",
    diagram: "tcpipModel",
    bulletItems: [
      "Application: user and service protocols such as HTTP, DNS, and SSH",
      "Transport: TCP or UDP moves data between applications using ports",
      "Internet: IP addressing and routing move packets between networks",
      "Link: Ethernet, Wi-Fi, and physical signaling carry data on the next local link"
    ],
    visual: "OSI 7-5 -> TCP/IP Application\nOSI 4    -> TCP/IP Transport\nOSI 3    -> TCP/IP Internet\nOSI 2-1  -> TCP/IP Link",
    visualLabel: "The Internet's real model",
    notes: "The TCP/IP model is what the internet actually runs. Unlike OSI's seven layers, it has four. Application combines OSI layers 5-7. Transport and Internet map directly. Link covers OSI layers 1-2. This is the model developers and engineers work with daily.",
    analogy: "TCP/IP is the practical toolkit; OSI is the textbook map. Both describe the same territory in different ways."
  },
  {
    id: 15,
    title: "MAC vs IP Addresses",
    eyebrow: "Addressing",
    diagram: "macVsIp",
    notes: "MAC addresses are burned into hardware or randomly generated for privacy. They are only meaningful on the local network segment. IP addresses are assigned by DHCP or manually and are meaningful across the entire routing path. ARP bridges the two by discovering MAC addresses for local IPs.",
    analogy: "A MAC address is like a device serial number. An IP address is like a temporary desk assignment that can change."
  },
  {
    id: 16,
    title: "IPv4 Addressing",
    eyebrow: "Addressing",
    diagram: "ipv4Addressing",
    bulletItems: [
      "IPv4 uses 32-bit addresses, written as four octets (e.g., 192.168.1.25)",
      "Each octet is 8 bits, so it ranges from 0 to 255",
      "The whole pool is 2^32 = 4,294,967,296 addresses",
      "A /24 mask means the first 24 bits name the network, the last 8 name the host"
    ],
    notes: "Walk the diagram left to right: 192.168.1.25 is four octets, and under each one is its 8-bit binary form. Point at the two brackets - the amber one covers the network bits and the green one the host bits, and the /24 mask is what decides where the split happens. Contrast with the MAC slide: the IP address is logical and can change, the MAC is fixed to the hardware and only works locally.",
    analogy: "An IP address is like a seat number on a train: the carriage part tells you the train, the seat part tells you exactly where to sit."
  },
  {
    id: 17,
    title: "IP Address Classes",
    eyebrow: "Addressing",
    diagram: "ipClasses",
    bulletItems: [
      "Class A: first octet 1-126, default mask /8, about 16.7 million hosts",
      "Class B: first octet 128-191, default mask /16, about 65,534 hosts",
      "Class C: first octet 192-223, default mask /24, 254 hosts - most home networks",
      "Class D: 224-239, multicast group addresses; Class E: 240-255, reserved",
      "Today we use CIDR (/n) instead, but these ranges still decide what is private"
    ],
    notes: "Teach the rule first, then the history. Read the first octet in binary: a leading 0 means Class A, 10 means Class B, 110 means Class C, 1110 is Class D (multicast) and 1111 is Class E (reserved). 192 starts with 110, so every 192.x address is Class C. Stress that classes were retired in the 1990s because they wasted addresses - that is exactly why CIDR exists - but the numbering is why 10.0.0.0/8 and 192.168.0.0/16 are the private blocks.",
    analogy: "Classes are like vehicle sizes: a bus seats many, a car seats a few, and the number plate's first digit told you which one you were looking at before the label was written on the window."
  },
  {
    id: 18,
    title: "IP Address Ranges",
    eyebrow: "Addressing",
    diagram: "ipRanges",
    bulletItems: [
      "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 - reusable anywhere",
      "Loopback 127.0.0.0/8 - every device answers for itself here",
      "APIPA 169.254.0.0/16 - the device picked it itself because DHCP failed",
      "Multicast 224.0.0.0/4 and broadcast 255.255.255.255 - not for normal hosts",
      "Because private IPs repeat everywhere, NAT translates them to one public IP"
    ],
    notes: "These eight blocks are the ones worth memorising. Loopback explains why ping localhost always works even with no cable plugged in. APIPA is the 169.254.x.x address students see when a DHCP server is unreachable - it is the classic symptom of a DHCP failure. The three private blocks answer the question 'why can my laptop be 192.168.1.5 and so can my neighbour's?' because those addresses are never routed on the public internet; NAT translates them at the router.",
    analogy: "Private addresses are extension numbers inside a building: everyone can have extension 101, but only the building's main street address is unique in the city."
  },
  {
    id: 19,
    title: "Subnetting",
    eyebrow: "Segmentation",
    diagram: "subnetting",
    bulletItems: [
      "A subnet divides a network into smaller sub-networks",
      "The subnet mask determines the network vs host portion",
      "/24 means 256 addresses (254 usable)",
      "/25 splits a /24 into two halves"
    ],
    notes: "Start with 192.168.1.0/24 and split into 192.168.1.0/25 and 192.168.1.128/25. Each subnet has its own broadcast domain. Subnetting improves security and reduces broadcast traffic.",
    analogy: "Subnetting is like dividing a big parking lot into sections so traffic flows better and you know which section each car belongs to."
  },
  {
    id: 20,
    title: "TCP vs UDP",
    eyebrow: "Transport",
    diagram: "tcpVsUdp",
    bulletItems: [
      "TCP: connection-oriented, reliable, ordered, acknowledged",
      "UDP: connectionless, fast, no delivery guarantee",
      "TCP handles flow control and congestion control",
      "UDP is used for video calls and online gaming"
    ],
    notes: "TCP is like certified mail with a signature. It ensures every packet arrives in order. UDP is like a postcard - fast but no guarantee. Use TCP for web pages and file transfers. Use UDP for streaming.",
    analogy: "TCP is a phone call where you wait for the answer. UDP is shouting across a crowd. Fast, but not guaranteed."
  },
  {
    id: 21,
    title: "Common Protocols",
    eyebrow: "Protocols",
    diagram: "protocolMap",
    bulletItems: [
      "HTTP (80) / HTTPS (443): Web browsing",
      "DNS (53): Domain name to IP resolution",
      "DHCP (67/68): Automatic IP address assignment",
      "TCP: Reliable connection-oriented transport",
      "UDP: Fast connectionless transport",
      "IP: Addressing and routing between networks"
    ],
    notes: "Show the protocol stack as a layered diagram. HTTP and HTTPS are application layer. TCP and UDP are transport. IP is network layer.",
    analogy: "Protocols are like languages: each layer speaks its own language, using the one below it as a carrier."
  },
  {
    id: 22,
    title: "DNS",
    eyebrow: "Names",
    diagram: "dnsResolution",
    bulletItems: [
      "DNS translates names to IP addresses",
      "Recursive resolver queries multiple servers",
      "Root servers direct to TLD servers",
      "TLD servers direct to authoritative servers",
      "Results are cached for performance"
    ],
    notes: "Animate the resolution: User enters www.example.com -> local DNS resolver -> root server -> .com TLD server -> authoritative NS -> final IP. DNS typically uses UDP port 53, but TCP for large responses.",
    analogy: "DNS is like calling directory assistance: you ask for a name, they look up the phone number."
  },
  {
    id: 23,
    title: "DHCP",
    eyebrow: "Addressing",
    diagram: "dhcpDora",
    bulletItems: [
      "DORA: Discover, Offer, Request, Acknowledge",
      "Devices automatically get IPs from a DHCP server",
      "Leases are time-limited and must be renewed",
      "DHCP relay helps across subnets"
    ],
    notes: "Animate the four-step DORA process with message arrows between client and server. Mention that DHCP also provides DNS server addresses, default gateway, and subnet mask. If no offer arrives the client falls back to APIPA, which links back to the IP ranges slide.",
    analogy: "DHCP is like a hotel front desk: a guest arrives, asks for a room, gets an offer, confirms, and receives a key with an expiration date."
  },
  {
    id: 24,
    title: "Ports & Sockets",
    eyebrow: "Endpoints",
    diagram: "portsAndSockets",
    notes: "Think of an IP address as a building address. Ports are individual apartment doors. A server can have HTTP on port 80, HTTPS on 443, SSH on 22. The combination of source and destination IP+port uniquely identifies a connection.",
    analogy: "An IP is a building address. A port is a door number. A socket pair is the full mailing label."
  },
  {
    id: 25,
    title: "How the Internet Works",
    eyebrow: "End-to-End",
    diagram: "internetPath",
    bulletItems: [
      "Devices get IPs via DHCP when joining a network",
      "Default gateway routes traffic to other networks",
      "Each router reads the destination IP and picks a next hop",
      "Autonomous Systems coordinate routing across the internet",
      "BGP tells the internet how to route between ASes"
    ],
    notes: "Trace: Laptop -> Wi-Fi -> AP -> Switch -> Router -> ISP -> Internet Backbone -> Destination ISP -> Destination Server. Each hop is a routing decision based on the destination IP.",
    analogy: "The internet is like a global postal system: each post office only knows the next stop, but the system delivers anywhere."
  },
  {
    id: 26,
    title: "Opening a Website",
    eyebrow: "Deep Dive",
    diagram: "websiteLoading",
    bulletItems: [
      "DNS lookup resolves the domain to an IP address",
      "TCP three-way handshake establishes a connection",
      "TLS handshake negotiates encryption keys",
      "HTTP request carries the browser's question",
      "Server returns HTTP response with page content",
      "Browser renders HTML, loads CSS/JS, displays the page"
    ],
    notes: "Start with typing https://example.com. DNS resolves to IP. TCP SYN/SYN-ACK/ACK handshake. TLS negotiates cipher suites. HTTP GET request. Server responds. Browser renders.",
    analogy: "Opening a website is like ordering at a restaurant: look up the menu (DNS), signal readiness (TCP), verify authenticity (TLS), place order (GET), receive food (response), enjoy (render)."
  },
  {
    id: 27,
    title: "Firewall & Security",
    eyebrow: "Protection",
    diagram: "firewall",
    notes: "Firewalls inspect packets against rules. They can allow port 443 but block port 22. Packet filtering at L3, stateful inspection at L4, deep packet inspection at L7. Next-gen firewalls add application awareness.",
    analogy: "A firewall is like a security guard: checking IDs, admitting invited guests, turning away suspicious visitors."
  },
  {
    id: 28,
    title: "NAT",
    eyebrow: "Translation",
    diagram: "nat",
    bulletItems: [
      "NAT maps private IPs to a public IP",
      "Many devices share one public address",
      "The router keeps a NAT table for connections",
      "Inbound needs port forwarding rules"
    ],
    notes: "NAT extends the life of IPv4. Home router has one public IP, many private. Router replaces source IP with public IP outbound, and translates back on return. Inbound connections require port forwarding. This is the slide that closes the loop on the private ranges we saw earlier.",
    analogy: "NAT is like a building with one street address but many apartments. The doorman knows which apartment each letter belongs to."
  },
  {
    id: 29,
    title: "Network Security",
    eyebrow: "Protection",
    diagram: "securityLayers",
    bulletItems: [
      "Firewall: Controls access at network boundaries",
      "VPN: Encrypts traffic over untrusted networks",
      "IDS/IPS: Detects and prevents intrusions",
      "Segmentation: Isolates network zones (VLANs)",
      "Encryption: Protects data confidentiality"
    ],
    notes: "Security is layered - defense in depth. Firewall is perimeter. VPN extends private network. IDS monitors; IPS blocks. Segmentation limits blast radius. Encryption protects data in transit.",
    analogy: "Network security is like securing a house: fence (firewall), safe (encryption), separate rooms (segmentation), alarm system (IDS/IPS)."
  },
  {
    id: 30,
    title: "Troubleshooting",
    eyebrow: "Diagnostics",
    diagram: "troubleshooting",
    bulletItems: [
      "Check physical connections and Wi-Fi signal",
      "Verify IP configuration (ip addr / ifconfig)",
      "Ping the gateway, then an external IP",
      "Test DNS resolution (nslookup, dig)",
      "Trace the path (traceroute)"
    ],
    notes: "If no internet: 1) Is cable plugged in? Check Wi-Fi. 2) ip addr - has IP? 3) ping 192.168.1.1 - if fails, local issue. 4) ping 8.8.8.8 - if fails, ISP issue. 5) nslookup google.com - if fails, DNS issue.",
    analogy: "Troubleshooting is like diagnosing a car: check power (cable), fuel (IP), engine (gateway), road (internet path)."
  },
  {
    id: 31,
    title: "Networking Cheat Sheet",
    eyebrow: "Summary",
    diagram: "cheatSheet",
    notes: "Review: MAC is local. IP routes across networks. Switch = Layer 2. Router = Layer 3. TCP reliable, UDP fast. DNS names to IPs. DHCP assigns IPs. Firewalls protect boundaries."
  },
  {
    id: 32,
    title: "Final Network Map",
    eyebrow: "Architecture",
    diagram: "finalMap",
    notes: "Complete enterprise architecture: Internet -> ISP (BGP) -> Firewall -> DMZ (servers) -> Core Switch -> VLANs -> Access Switches -> End devices. VPN connects remote users. This ties together everything we learned."
  },
  {
    id: 33,
    title: "Questions",
    eyebrow: "Discussion",
    diagram: "questions",
    notes: "Open floor for questions. Encourage students to ask about anything confusing. These fundamentals form the foundation for all digital communication.",
    analogy: "The best network engineers never stop asking questions. Each answer leads to deeper understanding."
  }
];
