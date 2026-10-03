// Slide data for Networking Basics presentation (beginner edition: 13 slides).
//
// One entry per slide. app.js renders them in array order and uses `id` as the
// index, so the ids must stay sequential from 0. `diagram` must match a key in
// js/diagram-svgs.js (every diagram in this deck is authored in draw.io).
// Words are plain beginner language; notes are a spoken script.
const slides = [
  {
    id: 0,
    layout: "title",
    title: "Networking Basics",
    subtitle: "Understanding How Devices Communicate",
    diagram: "networkPathIntro",
    notes: "Say this: Welcome! By the end of this talk you will be able to explain how a message gets from your phone to Google and back. No background needed. We start with two devices talking, and end with the whole internet.",
    analogy: "Think of this as learning the postal system before tracing one letter."
  },
  {
    id: 1,
    title: "What Is a Network?",
    eyebrow: "Start Here",
    bulletItems: [
      "Two or more devices linked together",
      "They swap messages using agreed rules",
      "Cables or Wi-Fi carry the messages",
      "Even two laptops make a network",
    ],
    diagram: "deviceToNetwork",
    notes: "Say this: A network is just devices that can reach each other. The agreed rules are called protocols. Your laptop and a printer on home Wi-Fi are already a network, even with no internet. Ask the room: what did your phone talk to this morning?",
    analogy: "A network is like a road system: connections are roads, devices are houses, protocols are traffic rules."
  },
  {
    id: 2,
    title: "Types of Networks",
    eyebrow: "Sizes",
    bulletItems: [
      "PAN: your pockets, watch to phone",
      "LAN: your home or office",
      "MAN: a whole city",
      "WAN and Internet: the whole world",
    ],
    diagram: "networkScale",
    notes: "Say this: Networks are named by size. PAN is your pockets, Bluetooth watch to phone. LAN is your building. A Wi-Fi LAN is the same idea without cables. MAN covers a city. WAN crosses countries, and the Internet is the biggest WAN of all.",
    analogy: "Circles of friendship: your pockets, your street, your city, the planet."
  },
  {
    id: 3,
    title: "Devices You Will Meet",
    eyebrow: "Hardware",
    bulletItems: [
      "Switch: delivers inside one building",
      "Router: connects different networks",
      "Access point: adds Wi-Fi to the room",
      "Firewall: the guard at the door",
    ],
    diagram: "deviceIcons",
    notes: "Say this: Four jobs to remember. The switch delivers inside one building. The router connects buildings together. The access point gives out Wi-Fi. The firewall stands at the door and checks visitors. One home box often does all four jobs, but the jobs are different.",
    analogy: "An office building: mailroom, courier vans, reception desk, security guard."
  },
  {
    id: 4,
    title: "How Messages Travel",
    eyebrow: "Switch vs Router",
    bulletItems: [
      "Switch: delivers inside one room",
      "It learns each device's name tag",
      "Router: carries between cities",
      "Your message uses both to reach Google",
    ],
    diagram: "routerVsSwitch",
    notes: "Say this: Inside one room, the switch reads name tags and hands each message to the right device. Old hubs just shouted to everyone, switches deliver. Between cities, the router reads addresses and passes the message closer each hop. Experts describe seven layers, but you only need three ideas: packing the box, writing the address, carrying it there.",
    analogy: "Mailroom clerk for your floor, courier vans between cities."
  },
  {
    id: 5,
    title: "Addresses: MAC vs IP",
    eyebrow: "Names",
    bulletItems: [
      "MAC: name tag sewn in, never changes",
      "IP: room number, changes each network",
      "Switch reads the name tag",
      "Router reads the room number",
    ],
    diagram: "macVsIp",
    notes: "Say this: Every device has two addresses. MAC is the permanent name tag from the factory, like A4 colon 5E. IP is the room number it gets on each network, like 192.168.1.25. Change hotels, your name tag stays, your room number changes. That is the whole difference.",
    analogy: "Name tag sewn into your shirt versus the hotel room you sleep in tonight."
  },
  {
    id: 6,
    title: "IP Addresses, Classes and Ranges",
    eyebrow: "Numbers",
    bulletItems: [
      "Four numbers, like 192.168.1.10",
      "Big firms got big blocks, Class A",
      "Small offices got small blocks, Class C",
      "Some ranges are saved for homes",
    ],
    diagram: "ipv4Addressing",
    notes: "Say this: An IP address is four numbers. Long ago the blocks were handed out by size: huge Class A for giants, tiny Class C for small offices. That wasted millions, so today we slice flexibly instead. And addresses starting 192.168 or 10 are reserved for homes and offices, they never travel the open internet.",
    analogy: "Phone number blocks: whole area codes for big cities, small exchanges for villages."
  },
  {
    id: 7,
    title: "Subnetting: Floors in One Building",
    eyebrow: "Splitting",
    bulletItems: [
      "One big network, split into floors",
      "Each floor is called a subnet",
      "A mask draws the floor lines",
      "/24 means 254 rooms on a floor",
    ],
    diagram: "subnetting",
    notes: "Say this: Imagine one giant office with a thousand desks. You split it into floors so each team has its own space. That split is subnetting. The mask is the floor plan: slash 24 gives one floor with 254 rooms, slash 26 gives a smaller floor with 62 rooms. Same building, tidier floors.",
    analogy: "One apartment block divided into floors, each floor its own quiet hallway."
  },
  {
    id: 8,
    title: "TCP vs UDP",
    eyebrow: "Delivery Styles",
    bulletItems: [
      "TCP: registered post with a receipt",
      "UDP: postcard, fast but may get lost",
      "Websites and files use TCP",
      "Calls, games and video use UDP",
    ],
    diagram: "tcpVsUdp",
    notes: "Say this: Two ways to send. TCP is registered post: numbered, tracked, re-sent if lost. Websites, files and email use it. UDP is a postcard: fast and cheap, but nobody comes looking if it vanishes. Calls, games and live video choose speed over perfection. Everyday names to drop: HTTP for web pages, DNS for names, SSH for remote login.",
    analogy: "Registered letter with tracking versus a postcard tossed in the mail."
  },
  {
    id: 9,
    title: "Names, Numbers and Doors",
    eyebrow: "Helpers",
    bulletItems: [
      "DNS: the phonebook, names to numbers",
      "DHCP: the hotel desk hands you a room",
      "Ports: door numbers on each computer",
      "Web knocks on door 443",
    ],
    diagram: "dnsResolution",
    notes: "Say this: Three helpers. DNS is the phonebook: you type a name, it returns the number, asking the main book, then the surname book, then the family itself. DHCP is the hotel desk: Discover, Offer, Request, Accept, and you have a room number. Ports are door numbers: 443 for secure web, 80 for plain web, 53 for the phonebook itself.",
    analogy: "Phonebook, hotel reception, and numbered doors in one hallway."
  },
  {
    id: 10,
    title: "How the Internet Works",
    eyebrow: "Big Picture",
    bulletItems: [
      "Your message hops room to city to world",
      "Routers pass it closer at each hop",
      "Opening one site uses every helper",
      "The answer travels all the way back",
    ],
    diagram: "internetPath",
    notes: "Say this: Now the grand tour of opening one website. Phonebook finds it, name tag crosses the room, address crosses the world, TCP guarantees it, locks secure it, and the guard waves door 443 through. Then the answer walks the whole road back and your browser paints the page. Every earlier slide just happened in one second.",
    analogy: "One letter using the mailroom, vans, phonebook, locks and guards, then the reply comes home."
  },
  {
    id: 11,
    title: "Staying Safe",
    eyebrow: "Security",
    bulletItems: [
      "Firewall: guard checking every visitor",
      "NAT: one street address, many flats",
      "Locks and alarms add more layers",
      "Never trust, always check",
    ],
    diagram: "firewall",
    notes: "Say this: The firewall is the guard with a guest list: door 443 welcome, strangers turned away. NAT is the apartment doorman: one street address outside, many flats inside, and he remembers which letter belongs where. Add locks for secret messages, alarms that watch and block, and separate zones so one break-in cannot roam. Experts call that never trust, always check.",
    analogy: "Guard at the gate, doorman at the flats, locks on the letters, alarms on the walls."
  },
  {
    id: 12,
    title: "Fix It Yourself",
    eyebrow: "Takeaway",
    bulletItems: [
      "Cable in? Wi-Fi on?",
      "Got an address? Can you ping home?",
      "Can you reach out? Do names work?",
      "Names, numbers, roads, guards",
    ],
    diagram: "troubleshooting",
    notes: "Say this: When the internet dies, walk the road outward. Step one: cable in, Wi-Fi on. Step two: do we have a room number. Step three: can we ping our own router. Step four: can we reach the outside world. Step five: do names resolve. The first step that fails names the culprit. Take this home: names, numbers, roads, guards. Thank you, questions welcome.",
    analogy: "Lost on a trip: check fuel, check the map, check the road, then ask directions."
  },
];
