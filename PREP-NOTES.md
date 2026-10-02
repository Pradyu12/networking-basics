# Networking Basics — Exam & Presentation Prep Notes

Written so you can **understand first, present second**. Read top to bottom
once tonight; each section ends with a line you can say out loud tomorrow.

> How to use this: the 🗣️ line is your "say it in the room" sentence. The
> rest is the understanding behind it. If you only remember the 🗣️ lines,
> you will still sound like you know the topic — because you will.

---

## 1. What a network actually is

Forget the textbook line for a second. A network is just **two or more
devices that agreed on rules for talking to each other**.

- The "devices" can be anything: your phone and earbuds, a laptop and a
  printer, or millions of servers across continents.
- The "rules" are called **protocols**. A protocol is like a language plus
  etiquette: who speaks first, how you say "I didn't hear you, repeat that",
  how you say goodbye. Without protocols, a printer from one company and a
  laptop from another would just stare at each other.
- The connection itself can be **cables** (fast, stable), **radio waves**
  (Wi-Fi, convenient, shared airspace), or both chained together.

The single most useful sentence in networking:

> 🗣️ "A network doesn't need the internet. Your laptop, a printer, and a
> home router talking to each other — that's already a network. The internet
> is just the biggest one."

**Why the deck starts here:** everything later (IP addresses, DNS, routers)
is just machinery that makes this simple idea work at planetary scale.

---

## 2. Why networks exist — the four reasons

People don't build networks because they love cables. Four motivations, in
the order your audience actually cares about:

1. **Share expensive things.** One printer, one internet connection, one file
   server — used by many people. This is the oldest reason and still the
   most convincing example: "one community photocopier instead of one per
   desk."
2. **Communicate.** Email, chat, calls, video meetings. Every message you
   sent today rode a network.
3. **Use services on other people's computers.** Websites, maps, streaming,
   cloud apps — your device is a window; the real computer is far away.
4. **Manage everything centrally.** One admin updates fifty office PCs from
   one desk instead of walking to each one.

> 🗣️ "Ask yourself what you did on your phone this morning — every single
> one of those things needed a network."

---

## 3. Types of networks — it's just about size

PAN → LAN → WLAN → MAN → WAN. The names sound intimidating; the idea is
trivially simple: **how big is the area?**

| Type | Full name | Think of it as… | Real example |
|---|---|---|---|
| PAN | Personal Area Network | Your personal bubble, arm's reach | Phone ↔ smartwatch, phone ↔ earbuds |
| LAN | Local Area Network | One building | Home Wi-Fi, office network |
| WLAN | Wireless LAN | The same LAN, minus cables | Home Wi-Fi over radio |
| MAN | Metropolitan Area Network | One city or campus | University linking its buildings |
| WAN | Wide Area Network | Countries and continents | ISP backbone; **the internet is the largest WAN** |

The trap question is "what's the difference between LAN and WLAN?" — answer:
**only the medium**. Same size, same job; one uses cables, the other uses
radio. A WLAN *is* a LAN.

> 🗣️ "PAN is your pockets, LAN is your building, MAN is your city, WAN is
> the world. WLAN is just a LAN without cables."

---

## 4. The cast of characters — network devices

Learn the **jobs**, not the boxes — a home router stuffs several jobs into
one plastic case, but the jobs stay distinct.

| Device | Works at | Job in one line | Analogy |
|---|---|---|---|
| **Hub** | Layer 1 | Shouts every message out of every port | Town crier yelling in the square |
| **Switch** | Layer 2 | Learns which device is on which port, delivers only there | Receptionist who knows every room |
| **Router** | Layer 3 | Connects *different* networks, picks the best path | Post office sorting mail by city |
| **Access Point** | Layer 1–2 | Lets wireless devices join the wired network | Translator between radio and cable |
| **Firewall** | Layers 3–7 | Blocks traffic that breaks the rules | Security guard checking IDs |
| **Modem** | Layer 1–2 | Translates the ISP line into digital for your router | Interpreter at a border crossing |
| **Repeater** | Layer 1 | Re-amplifies a dying signal | Relay runner carrying the baton onward |

Two confusions that cost marks:

- **Hub vs switch:** a hub *broadcasts* — every device hears everything
  (noisy, insecure, slow). A switch *learns* — it builds a table of "this
  MAC address lives on port 3" and sends each frame only there.
- **Switch vs router:** a switch connects devices **inside one network**
  (same street). A router connects **different networks together**
  (different cities).

> 🗣️ "A hub shouts to everyone, a switch delivers to the right room, a
> router carries mail between cities."

### How a switch learns (favourite viva question)

1. A frame arrives from device A on port 1 → the switch writes down
   "A lives on port 1" in its **MAC table**.
2. The destination is unknown → the switch **floods** the frame out of every
   port except the one it came in on.
3. The real destination replies → the switch learns *its* port too.
4. Next time, no flooding — direct delivery. Entries **age out** after a few
   minutes so moved devices don't get lost.

## 5. LAN, MAN, WAN and how they connect

- **LAN** is yours: one building, you own everything, fast and free.
- **WAN** belongs to telecom companies: they spent billions laying fibre
  across countries, and you **rent** a slice of it. Your ISP is literally a
  company selling you a doorway onto their WAN.
- Between them sits the **router** — the device whose entire job is standing
  on the border of two networks and forwarding between them.

> 🗣️ "Your LAN is your house. A WAN is the highway system. Your router is
> your front door — and your ISP owns the highway."

---

## 6. Topologies — who is wired to whom

Topology = the **shape** of connections.

| Topology | Shape | Verdict |
|---|---|---|
| **Bus** | One shared cable, all tap in | Dead — one cut kills everything |
| **Star** | Everything plugs into one central switch | ✅ What everyone builds: one failure hurts one device |
| **Ring** | Circle, each device relays onward | Rare — one break breaks the ring |
| **Mesh** | Everyone connects to everyone | Only where downtime is unthinkable; needs n·(n−1)/2 cables |
| **Hybrid** | Mix, e.g. star of stars | ✅ Real campuses and enterprises |

Why star won: failure is **isolated** (one cable dies, one PC goes dark, the
rest never notice), and adding a device means one cable, not rewiring the
building. Mesh math impresses examiners: 10 devices fully meshed need 45
cables — that's *why* nobody fully meshes.

> 🗣️ "Bus is one road everyone shares — one crash blocks all. Star is every
> house with its own driveway to one roundabout. That's why every office uses
> star."

---

## 7. Transmission media — the actual wires (and air)

| Medium | Feel | Weakness |
|---|---|---|
| **Twisted pair** (Cat5e/6/6a) | Up to 10 Gbps over ~100 m | Distance-limited |
| **Coaxial** | Decent, noise-resistant | Bulky, mostly legacy |
| **Fibre optic** | Enormous speed × distance, immune to noise | Pricey ends, hates sharp bends |
| **Radio / Wi-Fi** | Convenient, mobile | Shared airspace, interference-prone |
| **Satellite** | Reaches anywhere | Latency — light needs ~0.5 s for the round trip |
| **Bluetooth / NFC** | Tiny data, tiny power | Metres of range by design |

**Guided vs unguided** is just "signal confined in something" (cables) vs
"signal let loose" (air and space).

> 🗣️ "Copper is a country road, fibre is a bullet train made of light, Wi-Fi
> is shouting across a crowded room, satellite is shouting at the sky and
> waiting half a second for the echo."

---

## 8. The OSI model — the 7-layer cake 🎂

Hardest-looking, easiest-mark slide. The trick: **each layer only talks to
the layer directly above and below it**, and each layer wraps the parcel a
little more. Mnemonic, bottom-up:

**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way →
**Physical, Data Link, Network, Transport, Session, Presentation,
Application.**

| # | Layer | Does what | Examples |
|---|---|---|---|
| 7 | Application | What the *user* sees | HTTP, DNS, browsers |
| 6 | Presentation | Translates, encrypts, compresses | TLS/SSL, JPEG, MP4 |
| 5 | Session | Opens and manages conversations | Logins, video-call sessions |
| 4 | Transport | End-to-end delivery, chopped and numbered | **TCP** (reliable) vs **UDP** (fast) |
| 3 | Network | Addressing + best path across networks | **IP, routers** |
| 2 | Data Link | Hop-to-hop delivery on one link | **MAC, switches** |
| 1 | Physical | Raw bits as electricity, light, radio | Cables, hubs, Wi-Fi radios |

The word examiners want: **encapsulation**. Going down, each layer wraps the
previous parcel with its own header (data → segment → packet → frame →
bits). Coming up, each layer unwraps its own header. Nested envelopes.

> 🗣️ "OSI is a 7-layer cake where every layer only talks to its neighbours.
> Going down, each layer puts the parcel in a bigger envelope. Coming up,
> each layer opens its own envelope."

## 9. TCP/IP — the model that actually runs the world

OSI is the textbook; **TCP/IP is the reality**. Four layers, and everything
on the internet uses it: **Link → Internet → Transport → Application.**

Mapping to OSI, since exams love this: Link ≈ layers 1+2, Internet =
layer 3, Transport = layer 4, Application ≈ layers 5+6+7 merged.

> 🗣️ "OSI is the 7-layer classroom diagram. TCP/IP is the 4-layer machine
> that actually delivers your WhatsApp message."

---

## 10. MAC addresses — the permanent name tag

- A MAC address is **burned into the network card at the factory**. 48 bits,
  written as 6 pairs of hex: `3C:22:FB:12:9A:01`.
- First 3 bytes say **who made it** (the manufacturer block), last 3 bytes
  are that card's **serial number**.
- MACs work **only inside one local network**. Routers strip them off at
  every hop — a MAC never crosses the internet.

> 🗣️ "A MAC address is a factory serial number etched on your phone —
> permanent, unique, but only useful to the people in this room."

---

## 11. IP addresses — the postal address of the internet

If MAC is the permanent serial number, IP is the **delivery address** —
assigned by the network, changeable, and the thing routers actually read.

- **IPv4:** 32 bits, 4 "octets": `192.168.1.10`, each 0–255. Total space:
  ~4.3 billion — which the world **ran out of**, hence NAT and IPv6.
- **IPv6:** 128 bits in hex (`2001:db8::1`). Space so vast every grain of
  sand could have addresses. `::` compresses the zeros.
- **Classes:** A = `1–126` (huge), B = `128–191` (medium), C = `192–223`
  (small, 254 hosts — your home LAN). D = multicast, E = experimental.
  `127.x.x.x` is **loopback** — "myself" (`127.0.0.1` = localhost).
- **Private ranges (memorise these three):** `10.x.x.x`, `172.16–31.x.x`,
  `192.168.x.x`. Never appear on the public internet — they're the
  "extension numbers" used inside buildings.

> 🗣️ "MAC is the serial number etched at the factory; IP is the desk you get
> assigned when you walk into the office — it changes when you move."

---

## 12. Subnetting — dividing one parking lot into sections 🅿️

A subnet mask tells you **which part of the IP is the street name and which
part is the house number**. `/24` means "first 24 bits are network, last 8
are hosts" — same as writing `255.255.255.0`.

- `/24` → 256 addresses, 254 usable (first = network ID, last = broadcast).
  That's your home network.
- `/16` → 65,536 addresses (a university). `/8` → 16.7 million.
- **CIDR** (`/24` style) replaced classes because classes were wasteful — why
  give a company needing 300 addresses a whole Class B of 65,000?

Exam formula: usable hosts = 2^(host bits) − 2. For `/26`: 32−26 = 6 host
bits → 2^6 − 2 = **62 usable**.

> 🗣️ "Subnetting is splitting one big parking lot into marked sections so
> one fender-bender doesn't block the whole lot."

## 13. TCP vs UDP — certified mail vs postcard 📬

| | **TCP** (certified mail ✉️) | **UDP** (postcard) |
|---|---|---|
| Guarantee | Delivered, in order, no duplicates | Best effort — may vanish or reorder |
| How | Handshake + sequence numbers + ACKs + retransmission | Fire and forget |
| Speed | Slower (all that checking) | Fast (no checking) |
| Used by | Web, email, files — where loss is unacceptable | Video calls, gaming, streams, DNS — where speed beats perfection |

The famous **3-way handshake**: SYN → SYN-ACK → ACK. ("Can we talk?" "Yes,
can you?" "Yes.") Only *then* does data flow. Tearing down uses FIN.

Why video calls use UDP: losing 1 frame in 60 is invisible; *waiting* for a
retransmitted frame freezes the whole call. For email, one lost byte corrupts
everything — so TCP.

> 🗣️ "TCP is certified mail with tracking and signature. UDP is a postcard —
> faster, cheaper, and if it gets lost, nobody sends a search party."

---

## 14. Protocols and ports — languages and doors

A protocol is an **agreed way of speaking at one layer**. Greatest hits:
**HTTP/HTTPS** (web), **FTP** (files), **SMTP** (sending mail),
**POP3/IMAP** (receiving mail), **DNS** (names → addresses), **DHCP**
(auto-addressing).

**Ports** are door numbers on a machine: HTTP = 80, HTTPS = 443, FTP = 21,
SSH = 22, DNS = 53, SMTP = 25. **IP finds the building; the port finds the
right door.** Ranges: 0–1023 = well-known standards, 1024–49151 =
registered, 49152–65535 = temporary per-connection picks.

> 🗣️ "Protocols are layered languages. The port number is which door to
> knock on."

---

## 15. DNS — the phonebook of the internet 📞

You type `google.com`; computers need `142.250.x.x`. **DNS translates names
to numbers**, and the lookup is a chain:

Your cache → hosts file → ISP resolver → root ("who handles .com?") → TLD
("who handles google.com?") → authoritative server ("it's 142.250.x.x").

Each level caches the answer, so the full chain runs rarely. `nslookup` and
`dig` let you watch it happen.

> 🗣️ "DNS is directory assistance: you say a name, it gives you the number
> — and it remembers answers so it doesn't ask twice."

---

## 16. DHCP — the hotel front desk 🏨

Your phone joins Wi-Fi owning nothing — no address, no gateway, no DNS.
**DHCP hands it everything** in four steps, **DORA**: Discover ("any hotel
here?") → Offer ("room 192.168.1.20 free") → Request ("I'll take it") → ACK
("confirmed — here's your key and checkout time"). The "checkout time" is the
**lease**: addresses are borrowed, recycled when devices leave.

> 🗣️ "DHCP is a hotel front desk: your phone walks in with no room, and four
> messages later it has a key, a checkout time, and directions to the lobby."

---

## 17. Opening a website — the grand tour 🌍

The slide that ties the *entire deck* together. Walk it slowly — it's the
best 3 minutes of your presentation. Opening `https://example.com`:

1. **DNS** turns the name into an IP.
2. Your PC checks: same network? (mask comparison). No → send to the
   **gateway router**; the **switch** delivers the frame there by **MAC**
   (ARP resolved the gateway's MAC earlier).
3. The router **NATs** your private IP to its public one and forwards across
   ISP routers, each picking the best path by IP.
4. **TCP handshakes** with the server (SYN → SYN-ACK → ACK), then **TLS**
   encrypts everything (the 🔒 and the S in HTTPS).
5. **HTTP** requests the page; the server answers with the files. The
   **firewall** waved port 443 through at each boundary.

Every earlier slide appears here: MAC, IP, switch, router, DNS, ports, TCP,
NAT, firewall. Say that out loud — audiences love the callback.

> 🗣️ "Opening one website uses everything we learned: DNS finds it, MAC
> crosses the room, IP crosses the world, TCP guarantees it, TLS locks it,
> and the firewall waves port 443 through."

## 18. Firewall, NAT, security, troubleshooting — the closing act

**Firewall = the security guard with a guest list.** Packet filtering
(Layer 3) blocks by IP/port — cheap and fast. Stateful inspection (Layer 4)
remembers live connections — the standard office firewall. Deep inspection
(Layer 7) reads inside the parcel — knows YouTube from malware on the same
port.

**NAT = one street address, many apartments.** IPv4 ran out (~4.3 billion
addresses, far more devices), so your router stamps its one public IP on
every outbound packet and keeps a table to route replies back to the right
private device. That's why your laptop is `192.168.x.x` yet reaches the whole
internet — and why hosting a server at home needs **port forwarding**
(explicit inbound rules).

**Security = layers, not one magic box** (defence in depth): firewall at the
border, VPN over hostile networks, IDS watching / IPS blocking inside, VLANs
isolating zones so one breach doesn't spread, encryption so stolen data is
unreadable. Fence, guard dog, locked rooms, safe — all at once.

**Troubleshooting = elimination, inside → out:** cables/Wi-Fi → got an IP?
(`ip addr`) → ping the gateway → ping `8.8.8.8` → resolve names? (`nslookup`)
→ where does it die? (`traceroute`). The killer split: if numbers work but
names don't, it's **always DNS**.

> 🗣️ "Security is layers — fence, guard, locked rooms, safe. Troubleshooting
> is a funnel: your room, your building, the street, the city. The fault is
> wherever the signal stops."

---

## 19. Tomorrow's cheat sheet (read this last)

| Asked… | Answer in one breath |
|---|---|
| Hub vs switch? | Hub repeats to all; switch learns MAC→port, delivers to one |
| Switch vs router? | Switch = Layer 2, MAC, one LAN. Router = Layer 3, IP, between networks |
| MAC vs IP? | MAC = factory serial, local only. IP = assigned address, routed globally |
| OSI vs TCP/IP? | OSI = 7 teaching layers. TCP/IP = 4 working layers |
| TCP vs UDP? | TCP = certified mail, guaranteed. UDP = postcard, fast |
| DNS / DHCP? | DNS = name→IP phonebook. DHCP = auto-addressing via DORA |
| Port / socket? | Port = door number. Socket = IP + port + protocol |
| NAT? | Many private devices share one public IP via the router's table |
| Subnet mask? | Marks network bits vs host bits; `/24` = 24 + 8 |
| Private ranges? | `10/8`, `172.16/12`, `192.168/16` |
| Star topology? | Every device to one switch — isolated failures, easy growth |
| Fibre advantage? | Light in glass: huge speed × distance, noise-immune |
| 3-way handshake? | SYN → SYN-ACK → ACK, then data flows |
| No internet — first checks? | Cable/Wi-Fi → got an IP? → ping the gateway? |

**You've got this. Tell the postal story, walk the website journey, and let
the diagrams do the heavy lifting. Good luck tomorrow. 🍀**
