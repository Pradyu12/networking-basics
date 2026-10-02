# Networking Basics — Study Guide

Read this before you present. It explains **why** each slide says what it says, so
you can explain the material rather than read it off the screen. Slide numbers
match `js/slides.js` (34 slides, ids 0–33).

**The one-sentence story of the whole deck:**

> Two devices talk over a shared medium; the **MAC address** gets the frame to the
> right device on *this* link, the **IP address** gets the packet to the right
> *network*, the **layers** make both possible, and **DNS, DHCP, TCP and NAT**
> turn that machinery into something a person can use.

---

## Part 1 — The 20-second version

If a question comes and you need to answer it fast:

| Question | Answer |
|---|---|
| Hub vs switch? | Hub copies every frame to every port. Switch learns MAC→port and forwards only to the target. |
| Switch vs router? | Switch = Layer 2, MAC, inside one LAN. Router = Layer 3, IP, between networks. |
| MAC vs IP? | MAC is burned into hardware, changes never, only valid locally. IP is assigned, routable everywhere. |
| OSI vs TCP/IP? | OSI is 7 layers for teaching. TCP/IP is 4 layers and is what actually runs. |
| TCP vs UDP? | TCP = reliable, ordered, acknowledged (web, files). UDP = fast, no guarantee (video, gaming, DNS). |
| What is a port? | A number identifying *which door* on a machine. IP finds the building, port finds the door. |
| DNS / DHCP? | DNS = name → IP. DHCP = automatically hands out IPs (DORA). |
| Why NAT? | IPv4 ran out. NAT lets many private devices share one public IP. |
| What is a subnet mask? | It marks which bits are network and which are host: `/24` = 24 network bits + 8 host bits. |

---

## Part 2 — Slide by slide

### 1. Title — Networking Basics (slide 1)
**Point at the diagram:** Internet → Router → Firewall → Switch → PC/Server → AP → Phone.
Say: *"This is the whole journey in one picture. Every device we meet today sits on this path."*

### 2. What Is Networking? (slide 2)
- A network is **two or more devices agreeing to exchange data under shared rules**.
- The rules are **protocols**. Without protocols, a printer and a laptop cannot understand each other.
- Key nuance: **a network does not need the internet.** A laptop + printer + home router is already a network.
- Today's journey: `YOUR DEVICE → LOCAL NETWORK → INTERNET → SERVICE`

### 3. Why Networks? (slide 3)
Four reasons, in the order people care about: **share resources → communicate → use remote services → manage centrally.**
Ask the audience which networked service they used today. It always lands better than a definition.

### 4. Types of Networks (slide 4)
Scale from smallest to largest — this ordering is the whole point of the slide:

| Type | Stands for | Example |
|---|---|---|
| PAN | Personal Area Network | Phone ↔ smartwatch, phone ↔ earbuds |
| LAN | Local Area Network | Home or office wifi, one building |
| WLAN | Wireless LAN | The same LAN but over radio |
| MAN | Metropolitan Area Network | A city-wide network, a university campus |
| WAN | Wide Area Network | Across countries/continents; **the internet is the largest WAN** |

### 5. Network Components (slide 5)
End-to-end: **Internet → Router → Firewall → Switch → endpoints (PC, server, AP, phone).**
Home routers combine several of these boxes into one device; the *jobs* are still separate.

### 6. Network Devices (slide 6)

| Device | Layer | Job | Analogy |
|---|---|---|---|
| Hub | 1 | Repeats to every port | Town crier shouting |
| Switch | 2 | Forwards frames to the target port | Receptionist |
| Router | 3 | Joins different networks | Border guard |
| Access Point | 2 | Bridges wired ↔ wireless | Translator |
| Modem | 1 | Digital ↔ analog signal | Phone line adapter |
| Firewall | 3–7 | Filters traffic by rules | Security guard |

### 7. Hub vs Switch (slide 7) — the single most important comparison
- **Hub:** PC1 sends to PC2 → the hub copies the frame out **every** port. PC2 *and* PC3 receive it. Wasteful and a security leak.
- **Switch:** PC1 sends to PC2 → the switch looks up the MAC table, finds PC2's port, and delivers **only** there.
- **Why it matters:** hubs waste bandwidth and leak traffic; switches do not. Every modern LAN is switches.

### 8. Switching (slide 8) — how the switch learns
The mechanism is a *source-address learning loop*:
1. A frame arrives on port 3 from MAC `AA:BB:CC:00:01`.
2. The switch writes `AA:BB:CC:00:01 → port 3` into its **CAM/MAC table**.
3. For the destination it looks up the table.
4. **If the MAC is unknown**, it floods the frame (like a hub) *until* someone answers — **unknown unicast flooding**.

Say the punchline: *"The switch learns from the source, and forwards using the destination."*

### 9. Routing (slide 9)
- A router **strips the Layer 2 frame**, reads the **destination IP**, and consults its **routing table** to pick the next hop.
- Every router repeats that decision. The packet walks hop by hop toward the destination.
- If no route matches, the **default route (0.0.0.0/0)** sends it onward.
- On the same LAN, routers find each other's MAC addresses using **ARP**.

### 10. Router vs Switch (slide 10)
The clean rule: **a switch connects devices; a router connects networks.**
A switch that sees a destination on another network forwards the frame to its gateway — it does not route.

### 11. Topologies (slide 11)

| Topology | Advantage | Disadvantage |
|---|---|---|
| Bus | Cheapest, least cable | One break kills the whole segment |
| Star | Easy to add/remove a device | The central switch is a single point of failure |
| Ring | Predictable timing, can be dual-ring | A break affects the whole ring unless redundant |
| Mesh | Very resilient, no single point of failure | Expensive — lots of cabling |
| Tree/Hierarchical | Scales well | Depends on the core it grows from |

Real networks are **star-of-stars**: a hierarchical tree of stars with redundant uplinks.

### 12. Encapsulation (slide 12) — why layering works
Sending:
```
Application Data → TCP Segment (adds ports) → IP Packet (adds IPs)
                → Ethernet Frame (adds MACs) → Bits on the medium
```
Receiving reverses it — each layer strips *its own* header and passes the rest up.
**This is what makes the internet possible:** a Wi-Fi device and a fibre device can share the same IP packet because they only have to understand IP.

### 13. OSI Model (slide 13)

| # | Layer | Unit | Example |
|---|---|---|---|
| 7 | Application | Data | HTTP, DNS, SSH |
| 6 | Presentation | Data | TLS, encoding, compression |
| 5 | Session | Data | Session setup/teardown |
| 4 | Transport | Segment | TCP, UDP — **ports** |
| 3 | Network | Packet | IP, ICMP, ARP — **logical addressing** |
| 2 | Data Link | Frame | Ethernet, Wi-Fi — **MAC addressing** |
| 1 | Physical | Bits | Cable, radio, fibre |

Mnemonic: **"All People Seem To Need Data Processing."**

### 14. OSI in Action (slide 14)
Trace one HTTPS request down the sender's stack and up the receiver's:
```
Browser data → TLS + TCP 443 → IP packet to the server → Wi-Fi frame to the gateway → radio bits
```
Note honestly: real products straddle layers (a Layer 3 switch routes *and* switches; a firewall may inspect IP, port, state and application data).

### 15. TCP/IP Model (slide 15) — the real one
```
OSI 7,6,5 → TCP/IP Application   (HTTP, DNS, SSH, TLS)
OSI 4     → TCP/IP Transport     (TCP, UDP)
OSI 3     → TCP/IP Internet      (IP, ICMP, ARP)
OSI 2,1   → TCP/IP Link          (Ethernet, Wi-Fi, physical)
```
Four layers instead of seven. **Say this plainly: OSI is the teaching map, TCP/IP is the road.**

### 16. MAC vs IP (slide 16) — memorize this contrast

| | MAC | IP |
|---|---|---|
| Nature | Physical (hardware) | Logical (assigned) |
| Example | `A4:34:0F:12:AB:91` | `192.168.1.25` / `2001:db8::25` |
| Changes? | Never (unless spoofed) | Changes with the network |
| Scope | **Local segment only** | **Routable across the internet** |
| Forwarded by | Switches | Routers |

**ARP is the bridge:** "which MAC sits behind this IP?" — answered on the local segment only.

### 17. IPv4 Addressing (slide 17)
- IPv4 = **32 bits**, written as **four octets** in dotted-decimal: `192.168.1.25`.
- Each octet = 8 bits → **0 to 255**. Under each octet on the diagram is its binary form.
- Total space: 2³² = **4,294,967,296** addresses.
- The **two brackets** on the diagram are the key visual: amber = **network bits**, green = **host bits**. The **subnet mask (/n) decides where the split happens**.
- Worked example: `192.168.1.25/24` → network `192.168.1.0`, host `25`.
- Rule of thumb: a /24 gives 256 total, **254 usable** (first = network, last = broadcast).

### 18. IP Address Classes (slide 18)
**Teach the rule with binary.** Read the first octet:

| Class | Leading bits | First octet | Default mask | Usable hosts | Use |
|---|---|---|---|---|---|
| A | `0` | 1–126 | 255.0.0.0 (/8) | 16,777,214 | Very large networks |
| B | `10` | 128–191 | 255.255.0.0 (/16) | 65,534 | Medium business |
| C | `110` | 192–223 | 255.255.255.0 (/24) | 254 | Small networks, most homes |
| D | `1110` | 224–239 | — | — | Multicast |
| E | `1111` | 240–255 | — | — | Experimental/reserved |

Worked check: **192 = 11000000**, which starts `110` → **Class C**. Every `192.168.x.x` address is Class C.

**The history matters:** classes were retired in the 1990s because a Class C always gave you 254 addresses whether you needed 3 or 250 — hugely wasteful. **CIDR (/n) replaced them** so networks can be any size. But the class numbering is exactly *why* `10.0.0.0/8` and `192.168.0.0/16` are the private blocks.

### 19. IP Address Ranges (slide 19)
The eight blocks worth memorising:

| Range | Name | Meaning |
|---|---|---|
| `0.0.0.0/8` | This network | Refers to the local network |
| `10.0.0.0/8` | **Private (Class A)** | Largest private block, ~16.7M addresses |
| `127.0.0.0/8` | **Loopback** | Every device answers for itself — why `ping localhost` always works, even unplugged |
| `169.254.0.0/16` | **APIPA** | Self-assigned because **DHCP failed** |
| `172.16.0.0/12` | **Private (Class B)** | 172.16 → 172.31 |
| `192.168.0.0/16` | **Private (Class C)** | 192.168.0 → 192.168.255 |
| `224.0.0.0/4` | Multicast | One-to-many delivery (IPTV) |
| `255.255.255.255` | Broadcast | Every device on this subnet |

**The three private ranges are the ones that matter most.** They are reused in *every* home and office on earth — they are never routed on the public internet. That answers *"why can my laptop be 192.168.1.5 and so can my neighbour's?"* NAT (slide 29) translates them to one public IP.

**APIPA is the practical one:** see a `169.254.x.x` address on a PC → the DHCP server could not be reached. Link it forward to the DHCP slide.

### 20. Subnetting (slide 20)
- A subnet splits one network into smaller ones. The **mask decides the split**: `/24` = 24 network bits + 8 host bits.
- Worked example: `192.168.1.0/24` → two `/25`s: `192.168.1.0/25` and `192.168.1.128/25`. Each becomes its own **broadcast domain**.
- Why do it: **smaller broadcast domains** (less wasted traffic) and **better isolation** (security).

### 21. TCP vs UDP (slide 21)

| | TCP | UDP |
|---|---|---|
| Connection | Oriented (handshake) | Connectionless |
| Delivery | Reliable, ordered, acknowledged | Best-effort |
| Speed | Slower overhead | Fast |
| Control | Flow + congestion control | None |
| Use | Web pages, email, file transfer | Video calls, gaming, DNS |

Analogy: **TCP is certified mail with a signature; UDP is a postcard.**

### 22. Common Protocols (slide 22)

| Protocol | Port | Transport | Purpose |
|---|---|---|---|
| HTTP | 80 | TCP | Web browsing |
| HTTPS | 443 | TCP | Encrypted web |
| DNS | 53 | UDP (TCP for large) | Name → IP |
| DHCP | 67/68 | UDP | Automatic IP assignment |
| SSH | 22 | TCP | Encrypted remote shell |
| FTP | 20/21 | TCP | File transfer |
| SMTP | 25 | TCP | Sending email |
| IP | — | — | Addressing + routing |
| ICMP | — | — | ping, traceroute |

### 23. DNS (slide 23)
Name → IP, done as a chain of referrals:
```
you → local resolver → root server → .com TLD server → authoritative nameserver → IP
```
Results are **cached**, which is why the second visit is instant.

### 24. DHCP (slide 24) — DORA
```
1. Discover     "Is there a DHCP server out there?"   (broadcast)
2. Offer        "I can give you 192.168.1.42"          (broadcast)
3. Request      "I'll take 192.168.1.42"               (broadcast)
4. Acknowledge  "It's yours"                          (unicast)
```
DHCP also delivers the **subnet mask, default gateway and DNS servers** — not just the IP. Leases expire and must be renewed. If no server answers → **APIPA** (slide 19).

### 25. Ports & Sockets (slide 25)
- **IP = building address. Port = door number. Socket pair = full mailing label.**
- One server can offer many services by listening on many ports (80, 443, 22…).
- A connection is uniquely identified by **source IP + source port + destination IP + destination port**.

### 26. How the Internet Works (slide 26)
`Laptop → Wi-Fi → AP → Switch → Router → ISP → Backbone → Destination ISP → Server`
- The **default gateway** is the router that everything not-local is sent to.
- Each router independently reads the destination IP and picks a next hop.
- **Autonomous Systems (ASes)** are run by the same organisation; **BGP** is the protocol that exchanges routes between them.

### 27. Opening a Website (slide 27) — put it all together
```
1. DNS lookup      example.com → 93.184.x.x
2. TCP handshake   SYN → SYN-ACK → ACK
3. TLS handshake   agree encryption keys, verify the certificate
4. HTTP request    GET / HTTP/1.1
5. Response        200 OK + HTML
6. Render          browser draws HTML, then loads CSS/JS/images
```
Every earlier slide appears here. This is the payoff slide for the whole deck.

### 28. Firewall (slide 28)
Rules decide allow/block — e.g. **allow 443, block 22**. Escalating depth:
packet filtering (L3) → stateful inspection (L4) → deep packet inspection (L7).

### 29. NAT (slide 29) — the payback for slide 19
```
Outbound:  192.168.1.25 : 51000  →  203.0.113.9 : 51000   (source rewritten, port kept)
Return:    203.0.113.9 : 51000   →  192.168.1.25 : 51000 (the NAT table remembers the mapping)
```
- Many private devices share **one** public IP. That is how IPv4 survives.
- **Inbound** connections have no existing mapping, so they need **port forwarding**.

### 30. Network Security (slide 30)
Defence in depth — no single control is enough:
**Firewall** (perimeter) · **VPN** (encrypted tunnel over untrusted networks) · **IDS/IPS** (detect / block) · **Segmentation** (VLANs limit the blast radius) · **Encryption** (protects data in transit).

### 31. Troubleshooting (slide 31) — work outward
```
1. Physical   Is the cable in? Is Wi-Fi on?
2. IP config  Do I have an address? (ip addr / ifconfig)
3. Gateway    ping 192.168.1.1   → fails = local problem
4. Internet   ping 8.8.8.8       → fails = ISP / routing problem
5. DNS        nslookup google.com → fails = DNS problem
6. Path       traceroute          → shows where it stops
```
Each step eliminates a layer, so you always know *where* the problem is.

### 32. Cheat Sheet (slide 32)
Rapid recall of the whole deck — use this slide as your revision sheet.

### 33. Final Network Map (slide 33)
Ties everything together:
`Internet → ISP (BGP) → Firewall → DMZ servers → Core switch → VLANs → Access switches → End devices`, with **VPN** for remote users.

### 34. Questions (slide 34)

---

## Part 3 — How to explain it (delivery notes)

**The narrative arc.** Don't present 34 disconnected facts. The deck has a spine:
> *Devices need to talk (2–6) → so we build addressing (7–10, 16–19) → the
> addressing works because we layer it (11–15) → the protocols make it useful
> (20–27) → then we protect it (28–30) → and finally we debug it (31).*

**The three comparisons are the heart of it.** Hub vs switch, switch vs router,
TCP vs UDP. If the audience remembers only three slides, make it these.

**Every analogy in the deck, in one list:**

| Slide | Analogy |
|---|---|
| What is networking | Roads, destinations, traffic rules |
| Why networks | Community photocopier |
| Network types | Circles of friends → neighbourhood → city → country |
| Network components | Sender, route, carrier, rules, destination |
| Hub vs switch | Town crier vs receptionist |
| Switching | Doorman remembering badges |
| Routing | Border guard checking addresses |
| Router vs switch | Building concierge vs postal sorting office |
| Topologies | City planning |
| Encapsulation | Letter in envelope, via city and street |
| OSI | Shipping manifest |
| TCP/IP | Practical toolkit vs textbook map |
| MAC vs IP | Serial number vs desk assignment |
| IPv4 addressing | Train seat number |
| IP classes | Bus vs car, read from the number plate |
| IP ranges | Extension numbers inside a building |
| Subnetting | Sections of a parking lot |
| TCP vs UDP | Certified mail vs a postcard |
| Protocols | Layered languages |
| DNS | Directory assistance |
| DHCP | Hotel front desk |
| Ports/sockets | Building, door number, mailing label |
| Internet path | Global postal system |
| Opening a website | Ordering at a restaurant |
| Firewall | Security guard |
| NAT | One street address, many apartments |
| Security | Fence, safe, separate rooms, alarm |
| Troubleshooting | Diagnosing a car |

**Anticipated questions, with short answers.**

| Question | Short answer |
|---|---|
| Why is the MAC 6 groups of 2 hex digits? | 6 × 8 bits = 48 bits, the Ethernet hardware address size. |
| What exactly is an octet? | One group of 8 bits. "Octet" = eight. In IPv4 there are four. |
| Is 127.0.0.1 the same as localhost? | Yes — localhost is resolved to 127.0.0.1 via the hosts file. |
| What is the difference between /24 and 255.255.255.0? | Nothing. 255.255.255.0 is the dotted mask, /24 is its shorthand. |
| Why is the first and last host address unusable? | First = network ID, last = broadcast address. |
| Can two devices have the same IP? | Not on the same subnet — that is an IP conflict and breaks both. |
| What is ARP? | "Which MAC is behind this IP?" Asked locally, answered by whoever owns it. |
| Is HTTPS TCP or UDP? | TCP (HTTP/3 is the exception — it runs on QUIC/UDP). |
| Why does a switch need a MAC table? | Without it a switch would flood like a hub and waste every port. |
| Does a router use MAC addresses? | Only to reach the next hop on its own local segment. It routes on IP. |

**Pacing.** Roughly 45–60 minutes for 34 slides. The heavy slides are 7 (hub vs
switch), 8 (switching), 17–19 (the addressing block), 21 (TCP vs UDP) and 27
(opening a website). If you are short on time, expand those and skim the rest —
they are the ones people remember.

**If someone asks about IPv6**, the short version: IPv6 uses **128 bits**, written
in hex, and the space is so large that **private ranges are no longer needed** —
every device can have a globally unique address, which is exactly what NAT was
working around.

---

## Part 4 — Working on the deck

```bash
cd networking-presentation

node scripts/generate-drawio.js   # rebuild networking-diagrams.drawio (34 pages)
node scripts/export-svgs.js       # export pages -> assets/diagrams/*.svg + diagram-svgs.js
```

Every diagram is authored in **draw.io** — there are no hand-drawn SVGs left.
Open `networking-diagrams.drawio` in draw.io to edit any diagram; the page order
matches the slide order, and each page is a fixed 800×460 canvas.

| Where | What |
|---|---|
| `js/slides.js` | Slide titles, bullets and speaker notes (ids must stay 0–33) |
| `scripts/generate-drawio.js` | Builds the `.drawio` source; `PAGES` at the bottom sets page order |
| `scripts/export-svgs.js` | `PAGES` maps page number → diagram name → SVG file |
| `css/animations.css` | Diagram motion (connector dash flow, breathing glow) |

Controls: **← →** or **Space** to move, **F** for fullscreen, **Home/End** to
jump, the notes button (bottom right) shows the speaker notes for the current slide.

> If you add a slide, add its `id` in sequence, add a diagram page in
> `generate-drawio.js`, and add the matching row in **both** `PAGES` tables —
> `export-svgs.js` fails loudly if a page is missing.
