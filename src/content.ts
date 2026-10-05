export const SITE = {
  name: "webcozvoni",
  brandSuffix: ".cz",
  domain: "webcozvoni.cz",
  wordmark: "WEBCOZVONÍ",
  phone: "608 228 124",
  phoneLink: "+420608228124",
  email: "info@webcozvoni.cz",
  ico: "29860873",
  // Právní údaje dle § 435 obč. zák. — ověřeno proti ARES, needitovat bez
  // kontroly v rejstříku. Zdroj pravdy i pro JSON-LD v index.html.
  legalName: "Matěj Kronus",
  legalAddress: "Klatovská třída 1562/106, 301 00 Plzeň",
  legalNote: "Neplátce DPH",
  legalRegistry: "Zapsán v živnostenském rejstříku",
  location: "Plzeň, Rokycany, Nýřany — a kamkoliv autem",
  serviceArea: "Plzeň a okolí",
  contactLocation: "Plzeň — a za vámi přijedeme",
  openingHours: "Zvedáme po–pá 8:00–17:00",
  footerSignoff: "Vyrobeno poctivě v Plzni",
  footerDescription: "Poctivé weby pro živnostníky a malé firmy z Plzně a okolí.",
};

export const SETTINGS = {
  smoothScrollLerp: 0.11,
  smoothScrollOffset: -92,
  smoothScrollDuration: 1.4,
  floatingCallScrollThreshold: 640,
};

export const NAV_LINKS = [
  { label: "Služby", href: "#sluzby" },
  { label: "Postup", href: "#postup" },
  { label: "Koncepty", href: "#koncepty" },
  { label: "Ceník", href: "#cenik" },
  { label: "Otázky", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export const HEADER = {
  offerCta: "Nabídka zdarma",
  openMenu: "Otevřít menu",
  closeMenu: "Zavřít menu",
  callUs: "Zavolejte nám",
};

export const HERO = {
  kicker: "Webová agentura pro živnostníky z Plzně",
  titleLines: ["Weby,", "co zvoní."],
  description: "Stavíme weby, díky kterým vás zákazníci najdou — a rovnou zavolají. Bez keců a paušálů za nic.",
  primaryCta: "Chci konzultaci zdarma",
  secondaryCta: "Prohlédnout koncepty",
  stats: [
    { value: "72 h", label: "první návrh zdarma" },
    { value: "14 dní", label: "do spuštění" },
    { value: "0 Kč", label: "paušály za nic" },
    { value: "24 h", label: "do odpovědi" },
  ],
};

export const MARQUEE_TRADES = [
  "Instalatéři",
  "Elektrikáři",
  "Truhláři",
  "Malíři",
  "Autoservisy",
  "Kadeřnictví",
  "Obkladači",
  "Zámečníci",
  "Pekařství",
  "Klempíři",
  "Podlaháři",
  "Hodináři",
];

export const SERVICES = {
  title: "Všechno kolem webu pod jednou střechou",
  description: "Jeden telefon místo pěti dodavatelů.",
  scrollHint: "Scrollujte, služby pojedou do strany",
  cta: "Chci to",
  outroLead: "Nevíte, co z toho potřebujete?",
  outroCta: "Napsat poptávku",
  items: [
    {
      title: "Weby na míru",
      subtitle: "Stavěné hlavně pro mobil",
      text: "Žádná šablona. Web pro vaše řemeslo a zákazníky, kteří vás hledají v telefonu.",
      tags: ["Návrh", "Vývoj", "Mobil"],
    },
    {
      title: "Lokální SEO",
      subtitle: "Ať vás najdou v Plzni",
      text: "Profil na Googlu, mapy a obsah — když někdo hledá „řemeslo + Plzeň“.",
      tags: ["Google profil", "Mapy", "Obsah"],
    },
    {
      title: "Rezervace a poptávky",
      subtitle: "Zakázky i v devět večer",
      text: "Formuláře a online kalendář. Zákazník se ozve, i když zrovna nezvedáte telefon.",
      tags: ["Formuláře", "Kalendář"],
    },
    {
      title: "E-shopy",
      subtitle: "Prodávejte, co vyrábíte",
      text: "Obchod, který zvládnete obsluhovat sami. Bez programátora na telefonu.",
      tags: ["Prodej online", "Platby"],
    },
    {
      title: "Správa a hosting",
      subtitle: "Jedna SMS a je hotovo",
      text: "Aktualizace, zálohy a drobné úpravy. Vy děláte svou práci, my hlídáme web.",
      tags: ["Hosting", "Zálohy", "Podpora"],
    },
    {
      title: "Texty a fotky",
      subtitle: "Prodávají vaši práci",
      text: "Napíšeme texty a když je potřeba, přijedeme nafotit dílnu i hotové zakázky.",
      tags: ["Copywriting", "Foto"],
    },
  ],
};

/** Copy for the mini-demos in Services. A made-up business, shown with a "ukázka" label — not a client. */
export const SERVICE_DEMOS = {
  sampleLabel: "ukázka",
  business: "Instalatér Novák",
  web: {
    url: "instalater-novak.cz",
    headline: "Teče vám voda? Přijedeme do hodiny.",
    call: "Zavolat",
    rows: ["Havárie vody a topení", "Výměna baterií a WC", "Kotle a radiátory"],
  },
  seo: {
    query: "instalatér plzeň",
    place: "Plzeň-Slovany · 2,1 km",
    open: "Otevřeno do 18:00",
    call: "Zavolat",
    route: "Trasa",
    others: ["Instalatérské práce Plzeň", "Voda-topení servis"],
  },
  booking: {
    day: "Středa 15.",
    slots: ["8:00", "10:30", "13:00", "15:30"],
    bookedSlot: 1,
    booked: "Rezervováno",
    time: "21:04",
    notice: "Nová poptávka",
    noticeText: "Kapající baterie v koupelně",
  },
  shop: {
    product: "Dubové prkénko",
    price: "890 Kč",
    add: "Do košíku",
    added: "V košíku",
    order: "Objednávka přijata",
    orderNo: "č. 1024",
  },
  care: {
    incoming: "Dobrý den, můžete prosím změnit ceník? Výměna baterie je teď za 1 200 Kč.",
    reply: "Hotovo, už je to na webu.",
    status: "Záloha dnes 3:00 · web běží",
  },
  photo: {
    caption: "Nová koupelna za tři dny, včetně rozvodů.",
  },
};

export const PROCESS = {
  title: "Od telefonátu k hotovému webu",
  steps: [
    { title: "Zavoláme si", text: "15 minut, zdarma a bez závazků.", meta: "Den 1" },
    { title: "Návrh do 72 hodin", text: "Uvidíte web dřív, než cokoliv zaplatíte.", meta: "Den 3" },
    { title: "Spuštění do 14 dnů", text: "Texty, fotky, SEO. Doména i web jsou vaše.", meta: "Den 14" },
    { title: "Začne to zvonit", text: "Hlídáme web i poptávky, každý měsíc report.", meta: "Pořád" },
  ],
  guarantee: "Zpozdíme se z naší viny? Máte slevu 10 %.",
  guaranteeCta: "Chci termín návrhu",
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800`;

export const PORTFOLIO = {
  kicker: "Oborové koncepty",
  title: "Koncepty, ne reference",
  description: "Hotové klientské weby zatím ukázat nemůžeme. Tohle jsou oborové koncepty — fotky jsou ilustrační.",
  hint: "Táhněte do stran, kliknutím přiblížíte",
  reviewsNote: "Recenze zveřejníme, až je budeme mít od skutečných klientů. Žádné vymyšlené.",
  closingLink: "Probrat váš web",
  items: [
    { src: pexels(6419128), alt: "Instalatér montuje rozvody vody v koupelně", title: "Instalatér", subtitle: "Služby a poptávkový formulář" },
    { src: pexels(257736), alt: "Elektrikář zapojuje rozvaděč", title: "Elektrikář", subtitle: "Výjezdy a rychlý kontakt" },
    { src: pexels(32357250), alt: "Truhlář opracovává dřevo v dílně", title: "Truhlář", subtitle: "Realizace a fotogalerie" },
    { src: pexels(3985360), alt: "Kosmetické ošetření pleti", title: "Kosmetický salon", subtitle: "Ceník a online rezervace" },
    { src: pexels(3807517), alt: "Automechanik kontroluje motor", title: "Autoservis", subtitle: "Objednání na termín" },
    { src: pexels(6474471), alt: "Malíř natírá stěnu válečkem", title: "Malíř pokojů", subtitle: "Kalkulace a reference" },
    { src: pexels(1855214), alt: "Vitrína pekárny s pečivem", title: "Pekařství", subtitle: "Denní nabídka a mapa" },
    { src: pexels(39559306), alt: "Kadeřník stříhá vlasy v salonu", title: "Kadeřnictví", subtitle: "Rezervace a ceník" },
    { src: pexels(6195125), alt: "Tým úklidové firmy v bytě", title: "Úklidová firma", subtitle: "Balíčky a poptávka" },
    { src: pexels(5691622), alt: "Řemeslník stěrkuje zeď", title: "Stavební práce", subtitle: "Služby a oblast výjezdu" },
  ],
};

export const PRICING = {
  kicker: "Ceník",
  title: "Cena na stole. Hned a celá.",
  description: "Platíte jednou a web je váš. Žádný pronájem.",
  featuredLabel: "Nejčastější volba",
  note: "Hosting a doména od 1 800 Kč/rok — první rok od nás. Návrh zdarma, platíte až po schválení.",
  plans: [
    {
      name: "Start",
      price: "9 900 Kč",
      per: "jednorázově",
      desc: "Pro živnostníka, co potřebuje být konečně vidět.",
      features: ["Jednostránkový web na míru", "Poptávkový formulář a mapa", "Základy SEO a profil na Googlu", "Spuštění do 10 dnů"],
      cta: "Chci Start",
      featured: false,
    },
    {
      name: "Poctivý web",
      price: "19 900 Kč",
      per: "jednorázově",
      desc: "Pro dílny, salony a malé firmy.",
      features: ["Do 8 podstránek a reference", "Rezervace nebo objednávky", "Lokální SEO pro Plzeň a okolí", "Školení — úpravy zvládnete sami", "Spuštění do 14 dnů"],
      cta: "Chci Poctivý web",
      featured: true,
    },
    {
      name: "Na míru",
      price: "Dohodou",
      per: "vždy pevná cena předem",
      desc: "E-shop, katalog nebo cokoliv většího.",
      features: ["E-shop nebo katalog", "Napojení na vaše systémy", "Vícejazyčné weby", "Nabídka do 48 hodin"],
      cta: "Popsat zadání",
      featured: false,
    },
  ],
};

export const FAQ = {
  title: "Na rovinu odpovězeno",
  items: [
    {
      question: "Kolik trvá výroba webu?",
      answer: "Menší weby do 10 dnů, větší do 3 týdnů. Termín dostanete předem — a když se zpozdíme my, máte slevu 10 %.",
    },
    {
      question: "Musím si připravit texty?",
      answer: "Ne. Stačí půlhodinový hovor. Texty napíšeme my, fotky použijeme vaše, nebo přijedeme nafotit.",
    },
    {
      question: "Kolik mě web stojí do roka?",
      answer: "Cenu výroby víte předem. K tomu hosting a doména od 1 800 Kč ročně, první rok od nás. Nic skrytého.",
    },
    {
      question: "Co když se mi návrh nebude líbit?",
      answer: "Návrh je zdarma a bez závazků. Upravujeme, dokud nesedne. Když nesedne vůbec, rozejdeme se bez faktury.",
    },
    {
      question: "Zvládnu si web upravovat sám?",
      answer: "Ano. Za 45 minut vás naučíme měnit texty, ceny i fotky. Klientům se správou děláme drobné úpravy zdarma.",
    },
    {
      question: "Pomůžete i s Googlem a e-mailem?",
      answer: "Jasně. Firemní profil na Googlu, e-maily na vaší doméně i napojení na sociální sítě.",
    },
  ],
  more: "Jiná otázka? Napište nám.",
  formCta: "Zeptat se přes formulář",
};

export const CONTACT = {
  title: "Chcete web, co zvoní?",
  description: "Formulář zabere dvě minuty. Ozveme se do 24 hodin — většinou dřív.",
  emailLead: "Nebo napište rovnou na e-mail",
  availability: "Volná kapacita od",
  monthsGenitive: [
    "ledna", "února", "března", "dubna", "května", "června",
    "července", "srpna", "září", "října", "listopadu", "prosince",
  ],
  successTitle: "Díky, je to u nás.",
  successStart: "Ozveme se do 24 hodin. Když to spěchá, napište nám na",
  formTitle: "Nezávazná poptávka",
  fields: {
    name: "Jméno a příjmení *",
    phone: "Telefon *",
    email: "E-mail",
    trade: "Čím se živíte? *",
    message: "Co potřebujete? *",
    privacyNote: "Odesláním berete na vědomí, jak nakládáme s vašimi údaji. Nikomu je nepředáváme.",
    submit: "Odeslat poptávku",
    sending: "Odesíláme…",
    error: "Odeslání se nepovedlo. Zkuste to znovu, nebo zavolejte.",
    namePlaceholder: "Jan Novák",
    phonePlaceholder: "777 123 456",
    emailPlaceholder: "jan@firma.cz",
    messagePlaceholder: "Např.: Mám starý web a potřebuju nový, aby mě lidi našli v Plzni…",
  },
  trades: [
    "Instalatérství · voda · topení",
    "Elektroinstalace",
    "Malířství · natěračství",
    "Truhlářství · stolářství",
    "Autoservis",
    "Kadeřnictví · kosmetika · barber",
    "Stavebnictví · zednictví",
    "Gastro · pekařství",
    "Jiné řemeslo",
    "Malá firma · služby",
  ],
};

export const FOOTER = {
  backToTop: "Zpět nahoru",
  privacy: "Zásady zpracování osobních údajů",
};
