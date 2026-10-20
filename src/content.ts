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

/** Detail pages the niche cards and concept cards open (src/pages, routed in src/lib/router.ts). */
export const ROUTES = {
  niche: (slug: string) => `/obory/${slug}/`,
  concept: (slug: string) => `/koncepty/${slug}/`,
};

/** Tab titles and search descriptions — the app sets the title, scripts/prerender.mjs writes both into each page's HTML. */
export const META = {
  homeTitle: "webcozvoni.cz — Weby, co zvoní · Webová agentura Plzeň",
  homeDescription:
    "Stavíme poctivé weby pro živnostníky a malé firmy z Plzně a okolí. Návrh do 72 hodin zdarma, spuštění do 14 dnů. Web, díky kterému vám zákazníci volají.",
  nicheDescription: (title: string) =>
    `${title} z Plzně a okolí. Návrh do 72 hodin zdarma, spuštění do 14 dnů, jednorázová cena předem.`,
  notFoundTitle: "Stránka nenalezena — webcozvoni.cz",
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

/** the same Pexels photo, large and uncropped, for the top of a detail page */
export const heroPhoto = (src: string) => src.replace(/\?.*$/, "?auto=compress&cs=tinysrgb&w=1920");
/** a concept photo as the cover-flow cards show it */
export const cardPhoto = (src: string) => src.replace("h=1000&w=800", "h=1120&w=740");

const nichePhoto = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600`;

/** The trades we build for, in the grainy carousel under the hero. Photos are illustrative (Pexels). */
export const NICHES = {
  title: "Pro koho pracujeme",
  note: "Fotky jsou ilustrační.",
  items: [
    { slug: "elektrikari", name: "Elektrikáři", group: "Řemesla", icon: "zap", src: nichePhoto(257736), alt: "Elektrikář zapojuje jističe v rozvaděči" },
    { slug: "fotovoltaika", name: "Fotovoltaika", group: "Technika do domu", icon: "sun", src: nichePhoto(9875418), alt: "Montážník nese solární panel na střechu" },
    { slug: "instalateri-a-topenari", name: "Instalatéři a topenáři", group: "Řemesla", icon: "wrench", src: nichePhoto(6419128), alt: "Instalatér utahuje spoj na vodovodním potrubí" },
    { slug: "tepelna-cerpadla-a-klimatizace", name: "Tepelná čerpadla a klimatizace", group: "Technika do domu", icon: "fan", src: nichePhoto(27134985), alt: "Venkovní jednotka klimatizace na fasádě" },
    { slug: "tesari-a-truhlari", name: "Tesaři a truhláři", group: "Řemesla", icon: "hammer", src: nichePhoto(32357250), alt: "Truhlář opracovává dřevo v dílně" },
    { slug: "okna-a-dvere", name: "Okna a dveře", group: "Technika do domu", icon: "window", src: nichePhoto(5691544), alt: "Montážník osazuje okenní rám" },
    { slug: "stavby-a-rekonstrukce", name: "Stavby a rekonstrukce", group: "Řemesla", icon: "hardhat", src: nichePhoto(5691622), alt: "Řemeslník stěrkuje zeď" },
    { slug: "strechy-a-fasady", name: "Střechy a fasády", group: "Technika do domu", icon: "house", src: nichePhoto(33404248), alt: "Pokrývač pokládá šindel na střechu" },
    { slug: "autoservisy", name: "Autoservisy", group: "Řemesla", icon: "car", src: nichePhoto(3807517), alt: "Automechanik kontroluje motor" },
    { slug: "hotely-a-penziony", name: "Hotely a penziony", group: "Ubytování", icon: "bed", src: nichePhoto(5883728), alt: "Pokoj v penzionu s manželskou postelí" },
  ],
};

export const SERVICES = {
  title: "Všechno kolem webu pod jednou střechou",
  description: "Jeden telefon místo pěti dodavatelů.",
  outroCta: "Napsat poptávku",
  // the four main services, each a bento tile with its working demo
  items: [
    { demo: "web", title: "Weby na míru.", text: "Žádná šablona. Web pro vaše řemeslo a zákazníky, kteří vás hledají v telefonu." },
    { demo: "seo", title: "Lokální SEO.", text: "Profil na Googlu, mapy a obsah — když někdo hledá „řemeslo + Plzeň“." },
    { demo: "booking", title: "Rezervace a poptávky.", text: "Formuláře a online kalendář. Zákazník se ozve, i když zrovna nezvedáte telefon." },
    { demo: "care", title: "Správa a hosting.", text: "Aktualizace, zálohy a drobné úpravy. Vy děláte svou práci, my hlídáme web." },
  ] as const,
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
  care: {
    incoming: "Dobrý den, můžete prosím změnit ceník? Výměna baterie je teď za 1 200 Kč.",
    reply: "Hotovo, už je to na webu.",
    status: "Záloha dnes 3:00 · web běží",
  },
};

/**
 * The wide metric tile at the foot of the Services bento. The numbers are a made-up business's
 * enquiries, labelled "ukázka" on the page — an illustration of the goal, not a client result.
 */
export const GROWTH = {
  title: "Pomáháme vám vydělávat víc",
  lead: "Víc lidí vás najde, víc jich napíše. Tak vypadá web, který dělá svou práci.",
  metric: "Poptávky z webu",
  sample: "ukázka · vymyšlená firma",
  unit: "poptávek",
  pointLabel: (i: number) => `${i}. měsíc po spuštění`,
  deltaLabel: "za poslední měsíc",
  stats: { peak: "nejvíc", low: "nejméně", avg: "průměr" },
  views: { curve: "Křivka", bars: "Sloupce" },
  periods: [
    { label: "3 měsíce", points: 3 },
    { label: "6 měsíců", points: 6 },
    { label: "Rok", points: 12 },
  ],
  data: [3, 5, 6, 8, 9, 11, 10, 13, 15, 14, 17, 19],
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
  // figures for the little pictures in the milestone tiles — the same promises as above
  callMinutes: 15,
  draftLabel: "72 h",
  launchDays: 14,
  discount: 10,
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800`;

export const PORTFOLIO = {
  kicker: "Oborové koncepty",
  title: "Koncepty, ne reference",
  description: "Hotové klientské weby zatím ukázat nemůžeme. Tohle jsou oborové koncepty — fotky jsou ilustrační.",
  hint: "Přepínejte šipkami, tečkami nebo kliknutím na vedlejší kartu",
  sampleLabel: "koncept",
  open: "Prohlédnout koncept",
  prev: "Předchozí koncept",
  next: "Další koncept",
  reviewsNote: "Recenze zveřejníme, až je budeme mít od skutečných klientů. Žádné vymyšlené.",
  closingLink: "Probrat váš web",
  items: [
    { src: pexels(3807517), alt: "Automechanik kontroluje motor", slug: "autoservis", title: "Autoservis", subtitle: "Objednání na termín" },
    { src: pexels(15456627), alt: "Nový dřevěný krov proti modré obloze", slug: "tesar", title: "Tesař", subtitle: "Realizace a poptávka" },
    { src: "/nahledy/penzion-foto.webp", alt: "Dům s červenou střechou na louce u lesa", slug: "penzion", title: "Penzion", subtitle: "Rezervace ve třech jazycích" },
    { src: pexels(18316988), alt: "Solární panely na střeše při západu slunce", slug: "fotovoltaika", title: "Fotovoltaika", subtitle: "Kalkulačka a e-shop" },
    { src: pexels(8550826), alt: "Instruktor autoškoly se žákem za volantem", slug: "autoskola", title: "Autoškola", subtitle: "Kurzy, test a přihláška" },
    { src: pexels(6419128), alt: "Instalatér montuje rozvody vody v koupelně", slug: "instalater", title: "Instalatér", subtitle: "Služby a poptávkový formulář" },
    { src: pexels(257736), alt: "Elektrikář zapojuje rozvaděč", slug: "elektrikar", title: "Elektrikář", subtitle: "Výjezdy a rychlý kontakt" },
    { src: pexels(32357250), alt: "Truhlář opracovává dřevo v dílně", slug: "truhlar", title: "Truhlář", subtitle: "Realizace a fotogalerie" },
    { src: pexels(3985360), alt: "Kosmetické ošetření pleti", slug: "kosmeticky-salon", title: "Kosmetický salon", subtitle: "Ceník a online rezervace" },
    { src: pexels(6474471), alt: "Malíř natírá stěnu válečkem", slug: "malir-pokoju", title: "Malíř pokojů", subtitle: "Kalkulace a reference" },
    { src: pexels(1855214), alt: "Vitrína pekárny s pečivem", slug: "pekarstvi", title: "Pekařství", subtitle: "Denní nabídka a mapa" },
    { src: pexels(39559306), alt: "Kadeřník stříhá vlasy v salonu", slug: "kadernictvi", title: "Kadeřnictví", subtitle: "Rezervace a ceník" },
    { src: pexels(6195125), alt: "Tým úklidové firmy v bytě", slug: "uklidova-firma", title: "Úklidová firma", subtitle: "Balíčky a poptávka" },
    { src: pexels(5691622), alt: "Řemeslník stěrkuje zeď", slug: "stavebni-prace", title: "Stavební práce", subtitle: "Služby a oblast výjezdu" },
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
  progress: (done: number, total: number) => (done === total ? "Hotovo, můžete odeslat" : `Vyplněno ${done} z ${total}`),
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

/**
 * Booking a consultation — the form comes from our own booking system (rezervacni-system),
 * shown in an iframe. Its address comes from VITE_REZERVACE_URL (.env.production).
 */
export const BOOKING = {
  /** the business in the booking system (its slug, set in /admin → Klienti) */
  tenant: "webcozvoni",
  kicker: "Konzultace",
  title: "Radši to probereme?",
  description: "Vyberte si volný termín. Potvrdíme vám ho e-mailem.",
  frameTitle: "Rezervace konzultace",
};

export const FOOTER = {
  backToTop: "Zpět nahoru",
  privacy: "Zásady zpracování osobních údajů",
};

/* ------------------------------------------------------------------ */
/* Detail pages                                                       */
/* ------------------------------------------------------------------ */

/** Shared copy of the trade pages (/obory/…). */
export const NICHE_PAGE = {
  back: "Zpět",
  heroCta: "Ukázat koncepty",
  heroCtaSecondary: "Nezávazná poptávka",
  featuresKicker: "Co pro vás uděláme",
  featuresTitle: "Web, který zná vaše řemeslo",
  featuresLead: "Žádná šablona pro všechny. Každý obor má jiné zákazníky a jiné otázky — web na ně odpoví dřív, než zavolají.",
  seoKicker: "Jak web optimalizujeme",
  seoTitle: "Aby vás našli dřív než konkurenci",
  seoLead: "Hezký web nestačí. Stavíme ho od začátku tak, aby ho Google ukázal lidem z okolí, kteří vás právě hledají.",
  searchesLabel: "Co lidé v okolí hledají",
  searchesNote: "Na tyhle dotazy web postavíme — nadpisy, texty i stránky služeb.",
  seo: [
    { title: "Rychlý i na mobilních datech", text: "Zmenšené fotky, žádné zbytečné skripty. Web se načte rychle i v terénu." },
    { title: "Lokální SEO", text: "Stránka pro každou službu a místa, kde pracujete. Tak vás Google spojí s Plzní a okolím." },
    { title: "Firemní profil na Googlu", text: "Založíme ho nebo vyladíme, aby vás lidé našli i v mapách." },
    { title: "Strukturovaná data", text: "Google přesně ví, co děláte, kde a kdy máte otevřeno." },
    { title: "Poptávka na každé stránce", text: "Formulář a kontakt jsou vždycky po ruce. Zákazník nemusí hledat." },
    { title: "Měření a report", text: "Víte, kolik poptávek přišlo z webu. Každý měsíc report." },
  ],
  funnelKicker: "Koncepty",
  funnelTitle: "Jak by mohl vypadat váš web",
  funnelLead: "Hotové klientské weby zatím ukázat nemůžeme. Máme ale koncepty — vyberte si, co vás zajímá, a podívejte se, jak přemýšlíme.",
  documentTitle: (title: string) => `${title} — Plzeň a okolí · webcozvoni.cz`,
};

export type NicheDetail = {
  /** the page's headline */
  title: string;
  lead: string;
  features: { title: string; text: string }[];
  /** what customers around Plzeň type into Google */
  searches: string[];
  /** related concepts (PORTFOLIO slugs); the carousel on the page opens at the first one */
  concepts: string[];
  /** pre-picked chip in the enquiry form (one of CONTACT.trades) */
  trade?: string;
};

/** Per-trade copy, keyed by NICHES slug. Plans for what the site would do — no client results. */
export const NICHE_DETAILS: Record<string, NicheDetail> = {
  elektrikari: {
    title: "Weby pro elektrikáře",
    lead: "Když vypadnou jističe, hledá se elektrikář v telefonu — a volá se prvnímu, kdo vypadá důvěryhodně. Postavíme vám web, díky kterému budete tím prvním.",
    features: [
      { title: "Porucha na první pohled", text: "Kontakt a informace o pohotovosti hned nahoře. Bez hledání v menu." },
      { title: "Stránka pro každou službu", text: "Rozvody, revize, rozvaděče, wallboxy. Každá služba má svou stránku, kterou Google najde." },
      { title: "Revize bez telefonování", text: "Formulář na revizi s typem objektu a termínem. Poptávka přijde rovnou do mailu." },
      { title: "Ukázky práce", text: "Fotky rozvaděčů a realizací. Zákazník vidí, že děláte čistě." },
    ],
    searches: ["elektrikář Plzeň", "revize elektro Plzeň", "elektrikář pohotovost", "montáž wallboxu Plzeň"],
    concepts: ["elektrikar"],
    trade: "Elektroinstalace",
  },
  fotovoltaika: {
    title: "Weby pro fotovoltaiku",
    lead: "Fotovoltaiku si nikdo nekoupí na první dobrou. Lidé porovnávají, počítají a čtou. Web jim musí odpovědět dřív, než zavolají konkurenci.",
    features: [
      { title: "Srozumitelné sestavy", text: "Sestavy podle velikosti domu a spotřeby, s tím, co je v ceně. Žádné „cena na dotaz“." },
      { title: "Poptávka s podklady", text: "Zákazník nahraje fotku střechy a vyúčtování. Nabídku chystáte s podklady, ne naslepo." },
      { title: "Dotace lidsky", text: "Stránka o dotacích a jejich vyřízení, kterou zákazník pochopí bez úředního slovníku." },
      { title: "Realizace s čísly", text: "Hotové instalace s výkonem a lokalitou. Důkaz, že to umíte." },
    ],
    searches: ["fotovoltaika Plzeň", "solární panely na dům", "fotovoltaika s baterií cena", "montáž fotovoltaiky Plzeňský kraj"],
    concepts: ["fotovoltaika", "elektrikar"],
    trade: "Elektroinstalace",
  },
  "instalateri-a-topenari": {
    title: "Weby pro instalatéry a topenáře",
    lead: "Teče voda nebo netopí kotel? Zákazník nečte, chce pomoc hned. Web musí ukázat kontakt, oblast výjezdu a co opravujete — na první obrazovce.",
    features: [
      { title: "Havárie nahoře", text: "Kontakt a dostupnost havarijní služby jsou první, co zákazník uvidí." },
      { title: "Fotka závady ve formuláři", text: "Zákazník pošle fotku kapající baterie nebo kotle. Víte, co vézt s sebou." },
      { title: "Oblast výjezdu", text: "Mapa a seznam obcí, kam jezdíte. Ozvou se ti, ke kterým dojedete." },
      { title: "Servis kotlů na termín", text: "Objednání pravidelného servisu online, i v neděli večer." },
    ],
    searches: ["instalatér Plzeň", "havárie vody Plzeň", "servis kotle Plzeň", "výměna baterie instalatér"],
    concepts: ["instalater"],
    trade: "Instalatérství · voda · topení",
  },
  "tepelna-cerpadla-a-klimatizace": {
    title: "Weby pro tepelná čerpadla a klimatizace",
    lead: "Tepelné čerpadlo je investice na roky. Zákazník chce vědět, s čím počítat, kolik to stojí a jestli budete k zastižení i za pět let.",
    features: [
      { title: "Orientační kalkulace", text: "Pár otázek o domě a zákazník ví, s čím počítat. Vy dostanete poptávku i s parametry." },
      { title: "Servis a revize", text: "Objednání pravidelného servisu, aby se zákazník vracel k vám." },
      { title: "Úvod podle sezóny", text: "Na jaře klimatizace, na podzim čerpadla. Úvodní stránku přepnete jedním klikem." },
      { title: "Instalace z okolí", text: "Realizace z Plzně a okolí s fotkami venkovních jednotek." },
    ],
    searches: ["tepelné čerpadlo Plzeň", "klimatizace do bytu Plzeň", "servis tepelného čerpadla", "montáž klimatizace cena"],
    concepts: ["instalater", "elektrikar"],
  },
  "tesari-a-truhlari": {
    title: "Weby pro tesaře a truhláře",
    lead: "U dřeva rozhoduje oko. Zákazník chce vidět kuchyně, schody a krovy, které jste udělali — a pak se zeptat, kolik by stála ta jeho.",
    features: [
      { title: "Galerie realizací", text: "Velké fotky podle typu zakázky: kuchyně, vestavěné skříně, schody, pergoly." },
      { title: "Poptávka s rozměry", text: "Rozměry, fotka místa a představa v jednom formuláři. Hned víte, o čem je řeč." },
      { title: "Materiály a postup", text: "Z čeho děláte a jak dlouho to trvá. Méně otázek po telefonu." },
      { title: "Dílna a lidé", text: "Fotky z dílny a kdo v ní pracuje. Lidé si objednávají od lidí." },
    ],
    searches: ["truhlář Plzeň", "kuchyně na míru Plzeň", "tesař krov Plzeň", "vestavěné skříně na míru"],
    concepts: ["tesar", "truhlar"],
    trade: "Truhlářství · stolářství",
  },
  "okna-a-dvere": {
    title: "Weby pro okna a dveře",
    lead: "Okna se mění jednou za desítky let. Zákazník si proto všechno porovná — profily, skla, ceny i montáž. Na webu musí najít odpovědi.",
    features: [
      { title: "Přehled profilů", text: "Plast, dřevo, hliník. Srovnání, které zákazník pochopí i bez katalogu." },
      { title: "Poptávka podle oken", text: "Počet a rozměry oken rovnou ve formuláři. Nacenění bez kolečka telefonátů." },
      { title: "Montáž krok za krokem", text: "Jak výměna probíhá a kolik dní trvá. Méně obav z nepořádku v bytě." },
      { title: "Vzorkovna a zaměření", text: "Kde vás najdou, kdy máte otevřeno a jak si domluvit zaměření." },
    ],
    searches: ["plastová okna Plzeň", "výměna oken Plzeň", "vchodové dveře Plzeň", "zaměření oken zdarma"],
    concepts: ["truhlar", "stavebni-prace"],
  },
  "stavby-a-rekonstrukce": {
    title: "Weby pro stavby a rekonstrukce",
    lead: "Rekonstrukce je velká zakázka a velká důvěra. Zákazník chce vidět hotové byty a koupelny, vědět, jak pracujete, a mít jistotu, že termín platí.",
    features: [
      { title: "Před a po", text: "Fotky stejné místnosti před rekonstrukcí a po ní. Mluví za vás." },
      { title: "Všechno od jedné firmy", text: "Bourání, instalace, obklady, malování. Zákazník vidí, že stačí jeden telefon." },
      { title: "Poptávka s rozsahem", text: "Typ prostoru, metry a fotky. Na prohlídku jedete připravení." },
      { title: "Kde stavíte", text: "Oblast a typ zakázek, které berete. Ozvou se ti správní." },
    ],
    searches: ["rekonstrukce bytu Plzeň", "rekonstrukce koupelny Plzeň", "stavební firma Plzeň", "zednické práce Plzeň"],
    concepts: ["stavebni-prace", "malir-pokoju"],
    trade: "Stavebnictví · zednictví",
  },
  "strechy-a-fasady": {
    title: "Weby pro střechy a fasády",
    lead: "Když zatéká, hledá se pokrývač hned. Když se plánuje nová fasáda, porovnává se měsíce. Web musí zvládnout obojí.",
    features: [
      { title: "Rychlá oprava", text: "Poptávka opravy po bouřce nebo vichřici, viditelná hned nahoře." },
      { title: "Fotky z výšky", text: "Realizace střech a fasád, klidně z dronu. Ukazují rozsah, který zvládnete." },
      { title: "Materiály a záruky", text: "Krytiny, zateplení, záruky. Přehledně, bez katalogového žargonu." },
      { title: "Poptávka s fotkou", text: "Zákazník pošle fotku střechy nebo domu a vy víte, do čeho jdete." },
    ],
    searches: ["pokrývač Plzeň", "oprava střechy Plzeň", "zateplení fasády Plzeň", "klempíř Plzeň"],
    concepts: ["stavebni-prace"],
    trade: "Stavebnictví · zednictví",
  },
  autoservisy: {
    title: "Weby pro autoservisy",
    lead: "Řidič potřebuje vědět tři věci: jestli opravujete jeho auto, kolik to bude stát a kdy může přijet. Web mu to řekne dřív, než zavolá.",
    features: [
      { title: "Objednání na termín", text: "Servis, přezutí, příprava na STK. Ráno si jen otevřete kalendář." },
      { title: "Ceník základních úkonů", text: "Olej, brzdy, pneu. Orientační ceny, které berou strach z účtu." },
      { title: "Značky a služby", text: "Co opravujete a na co máte vybavení. Stránky, které Google ukáže." },
      { title: "Pneusezóna", text: "Na jaře a na podzim jde přezouvání nahoru. Úvod se mění se sezónou." },
    ],
    searches: ["autoservis Plzeň", "přezutí pneu Plzeň", "výměna oleje Plzeň", "servis Škoda Plzeň"],
    concepts: ["autoservis"],
    trade: "Autoservis",
  },
  "hotely-a-penziony": {
    title: "Weby pro hotely a penziony",
    lead: "Z každé rezervace přes portál platíte provizi. Vlastní web s rezervací přivede hosty napřímo.",
    features: [
      { title: "Rezervace napřímo", text: "Kalendář volných pokojů a rezervace bez provize portálům." },
      { title: "Pokoje v plné kráse", text: "Velké fotky pokojů, vybavení a cena za noc. Host ví, co dostane." },
      { title: "Okolí a výlety", text: "Tipy na výlety a akce v okolí. Obsah, který Google rád ukazuje." },
      { title: "Více jazyků", text: "Čeština, němčina, angličtina. Pro hosty z Bavorska i odjinud." },
    ],
    searches: ["penzion Plzeň", "ubytování Šumava", "hotel Plzeň centrum", "penzion se snídaní Plzeňský kraj"],
    concepts: ["penzion"],
  },
};

/** Shared copy of the concept pages (/koncepty/…). */
export const CONCEPT_PAGE = {
  back: "Zpět",
  label: (n: number, total: number) => `Koncept ${String(n).padStart(2, "0")}/${String(total).padStart(2, "0")}`,
  honesty: "Koncept, ne reference. Takhle bychom web pro tenhle obor postavili.",
  previewNote: "Ilustrační obrázek — náhled webu doplníme",
  honestyLive: "Koncept, ne reference. Firma je vymyšlená, web je hotový — proklikejte si ho.",
  openLive: "Otevřít celý web",
  liveLabel: "živý web",
  facts: { plan: "Balíček", price: "Cena", launch: "Spuštění", scope: "Rozsah" },
  scope: (plan: string, pages: number) => (plan === "Start" ? "Jedna stránka" : `${pages} podstránek`),
  aboutKicker: "O konceptu",
  aboutTitle: "Co má web umět",
  pagesLabel: "Co na webu bude",
  planKicker: "Cena",
  priceTitle: "Kolik by takový web stál",
  planCta: "Chci podobný web",
  allPlans: "Porovnat všechny balíčky",
  processKicker: "Postup",
  processTitle: "Jak by takový web vznikl",
  reviewKicker: "Recenze klienta",
  reviewBadge: "Zatím prázdné",
  reviewText: "Tady bude recenze klienta. Zveřejníme ji, až web poběží naostro — žádné vymyšlené.",
  reviewAuthor: "Jméno klienta",
  reviewRole: (title: string) => `${title} · Plzeň`,
  nextLabel: "Další koncept",
  documentTitle: (title: string) => `Koncept: ${title} — webcozvoni.cz`,
};

export type ConceptDetail = {
  headline: string;
  about: string;
  features: { title: string; text: string }[];
  /** PRICING plan name the site would be built on */
  plan: "Start" | "Poctivý web" | "Na míru";
  pages: string[];
  /** pre-picked chip in the enquiry form (one of CONTACT.trades) */
  trade?: string;
  /** a real screenshot of the concept, once there is one — until then the photo stands in */
  preview?: string;
  /** the finished concept site, once it is online — the preview then opens it */
  live?: string;
  /** "Spuštění" fact, when the plan doesn't name one */
  launch?: string;
  /** "Rozsah" fact, when the plan's default doesn't fit */
  scope?: { value: string; sub?: string };
  /** why this concept costs what it costs — replaces the general pricing line */
  priceNote?: string;
};

/** Per-concept copy, keyed by PORTFOLIO slug. Made-up briefs, shown as concepts — not client work. */
export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  instalater: {
    headline: "Web pro instalatéra",
    about: "Koncept pro instalatéra, který jezdí po Plzni a okolí. Hlavní úkol webu: aby zákazník s havárií zavolal do minuty a ten s plánovanou opravou poslal poptávku i s fotkou.",
    features: [
      { title: "Havárie hned nahoře", text: "Kontakt a pohotovost na první obrazovce, na mobilu i počítači." },
      { title: "Poptávka s fotkou", text: "Zákazník vyfotí závadu, vy víte, co vézt." },
      { title: "Oblast výjezdu", text: "Mapa obcí, kam jezdíte. Žádné zbytečné hovory z druhého konce kraje." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Služby", "Havárie", "Ceník", "Oblast výjezdu", "Kontakt"],
    trade: "Instalatérství · voda · topení",
  },
  elektrikar: {
    headline: "Web pro elektrikáře",
    about: "Koncept pro elektrikáře, který dělá rozvody, revize i rychlé výjezdy. Web třídí zákazníky hned na vstupu: kdo má poruchu, volá; kdo plánuje, posílá poptávku.",
    features: [
      { title: "Dvě cesty z úvodu", text: "Porucha → telefon. Plánovaná práce → formulář. Každý ví, kam kliknout." },
      { title: "Revize online", text: "Objednání revize s typem objektu a termínem." },
      { title: "Wallboxy a fotovoltaika", text: "Samostatné stránky pro služby, na které se lidé ptají Googlu." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Služby", "Revize", "Wallboxy", "Realizace", "Kontakt"],
    trade: "Elektroinstalace",
  },
  truhlar: {
    headline: "Web pro truhláře",
    about: "Koncept pro truhlářskou dílnu, která dělá kuchyně, skříně a schody na míru. Na webu mluví hlavně fotky — text jen doplňuje, co na nich není vidět.",
    features: [
      { title: "Galerie podle zakázek", text: "Kuchyně, skříně, schody. Zákazník najde přesně to, co hledá." },
      { title: "Poptávka s rozměry", text: "Rozměry, fotka místa a představa v jednom formuláři." },
      { title: "Příběh dílny", text: "Kdo jste a jak pracujete. Lidé si objednávají od lidí." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Realizace", "Kuchyně", "Nábytek na míru", "O dílně", "Kontakt"],
    trade: "Truhlářství · stolářství",
  },
  "kosmeticky-salon": {
    headline: "Web pro kosmetický salon",
    about: "Koncept pro salon s několika ošetřeními a jednou kosmetičkou. Web má jediný cíl: aby si klientka vybrala ošetření a rovnou si ho zarezervovala — klidně ve 23:00.",
    features: [
      { title: "Online rezervace", text: "Výběr ošetření a volného termínu bez telefonování." },
      { title: "Ceník na jednom místě", text: "Ošetření, délka a cena. Přehledně, i na mobilu." },
      { title: "Dárkové poukazy", text: "Objednávka poukazu přes formulář. Před Vánoci se hodí." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Ošetření", "Ceník", "Rezervace", "Poukazy", "Kontakt"],
    trade: "Kadeřnictví · kosmetika · barber",
  },
  autoservis: {
    headline: "Web pro autoservis",
    about: "Autoservis Kovář z Plzně si vymysleli, web pro něj je ale hotový a funguje — klidně si ho proklikejte. Jedna stránka, která řidiči odpoví na všechno: co opravujete, kolik to stojí a kdy máte otevřeno. A nakonec ho objedná na termín, aniž by musel volat do dílny.",
    features: [
      { title: "Objednávka na pár kliknutí", text: "Služba, SPZ, auto, den a čas. Do dílny přijde hotová objednávka, ne „zavolejte mi“." },
      { title: "Ceník bez hvězdiček", text: "22 úkonů v pěti záložkách, ceny včetně DPH a práce. Řidič ví, do čeho jde, dřív než přijede." },
      { title: "Web, co ví, kolik je hodin", text: "Otevřeno, nebo zavřeno podle otevírací doby, nejbližší volný termín a nabídka podle sezóny — na podzim přezouvání, v létě klimatizace." },
    ],
    plan: "Start",
    pages: ["Úvod s volným termínem", "Sezónní nabídka", "Služby", "Značky", "Ceník", "Jak to probíhá", "O dílně", "Časté dotazy", "Objednávka", "Kontakt a mapa"],
    trade: "Autoservis",
    preview: "/nahledy/autoservis.webp",
    live: "https://autoservis-template.matej-kronus.workers.dev/",
    scope: { value: "Jedna stránka", sub: "10 sekcí" },
    priceNote: "Všechno podstatné na jedné stránce: služby, ceník, otevírací doba, objednávka na termín a mapa. Přesně na to je balíček Start.",
  },
  "malir-pokoju": {
    headline: "Web pro malíře pokojů",
    about: "Koncept pro malíře, který pracuje sám nebo s pomocníkem. Jedna stránka, která odpoví na všechno podstatné a skončí poptávkou s metry čtverečními.",
    features: [
      { title: "Orientační kalkulace", text: "Zákazník zadá plochu a typ práce a uvidí rozmezí ceny." },
      { title: "Před a po", text: "Fotky stejných pokojů před malováním a po něm." },
      { title: "Co je v ceně", text: "Jasně napsané: zakrývání, úklid, odvoz." },
    ],
    plan: "Start",
    pages: ["Úvod", "Služby", "Kalkulace", "Fotky", "Poptávka"],
    trade: "Malířství · natěračství",
  },
  pekarstvi: {
    headline: "Web pro pekařství",
    about: "Koncept pro rodinnou pekárnu s prodejnou. Lidé na webu hledají hlavně dvě věci: co je dnes čerstvé a kdy máte otevřeno.",
    features: [
      { title: "Denní nabídka", text: "Pečivo dne, které upravíte z mobilu za minutu." },
      { title: "Otevírací doba a mapa", text: "Hned na úvodu, včetně svátků." },
      { title: "Objednávky na oslavy", text: "Chlebíčky a koláče na objednávku přes formulář." },
    ],
    plan: "Start",
    pages: ["Úvod", "Dnes v nabídce", "Objednávky", "Otevírací doba", "Mapa"],
    trade: "Gastro · pekařství",
  },
  kadernictvi: {
    headline: "Web pro kadeřnictví",
    about: "Koncept pro kadeřnictví se třemi křesly. Web ukazuje, kdo u vás stříhá, kolik co stojí a kdy je volno — a rezervace zabere minutu.",
    features: [
      { title: "Rezervace ke konkrétní kadeřnici", text: "Výběr služby, kadeřnice i termínu." },
      { title: "Ceník podle délky vlasů", text: "Krátké, střední, dlouhé. Žádné překvapení u pokladny." },
      { title: "Galerie střihů", text: "Fotky z vašeho Instagramu přímo na webu." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Ceník", "Tým", "Rezervace", "Galerie", "Kontakt"],
    trade: "Kadeřnictví · kosmetika · barber",
  },
  "uklidova-firma": {
    headline: "Web pro úklidovou firmu",
    about: "Koncept pro úklidovou firmu, která uklízí domácnosti i kanceláře. Web nabízí jasné balíčky, aby zákazník věděl, co dostane, a poptal ten správný.",
    features: [
      { title: "Balíčky služeb", text: "Běžný, generální, kanceláře. S tím, co je v ceně." },
      { title: "Poptávka s plochou", text: "Metry, typ úklidu a frekvence. Nabídku pošlete bez obhlídky." },
      { title: "Pravidelný úklid", text: "Objednávka opakovaného úklidu na den v týdnu." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Balíčky", "Domácnosti", "Firmy", "Poptávka", "Kontakt"],
    trade: "Malá firma · služby",
  },
  "stavebni-prace": {
    headline: "Web pro stavební firmu",
    about: "Koncept pro menší stavební firmu, která dělá rekonstrukce a zednické práce. Web stojí na realizacích a na jasně vymezené oblasti, kde firma pracuje.",
    features: [
      { title: "Realizace před a po", text: "Každá zakázka s fotkami, rozsahem a délkou prací." },
      { title: "Oblast výjezdu", text: "Mapa, kde stavíte. Poptávky jen z míst, kam dojedete." },
      { title: "Poptávka s rozsahem", text: "Typ práce, metry a fotky už v první zprávě." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod", "Služby", "Realizace", "Oblast", "O nás", "Kontakt"],
    trade: "Stavebnictví · zednictví",
  },
  tesar: {
    headline: "Web pro tesaře",
    about: "Tesařství Krokev z Plzně si vymysleli, web pro něj je ale hotový — klidně si ho proklikejte. Jedna stránka, na které mluví hlavně fotky krovů a pergol. Zákazník si vybere stavbu, jakou chce, a poptávka už ví, o jaký typ práce jde.",
    features: [
      { title: "Realizace s místem a rokem", text: "Hotové stavby v posuvné galerii. U každé obec, rok a co se dělalo — třeba 14 m³ smrku na krov." },
      { title: "„Chci podobnou“", text: "Tlačítko u služby i u realizace skočí na formulář a rovnou vybere typ práce." },
      { title: "Zaměření zdarma nahoře", text: "Nejbližší volný termín zaměření a nabídka do 3 dnů hned na první obrazovce." },
    ],
    plan: "Start",
    pages: ["Úvod", "Co stavíme", "Realizace", "Jak to probíhá", "O nás", "Časté dotazy", "Poptávka"],
    trade: "Truhlářství · stolářství",
    preview: "/nahledy/tesar.webp",
    live: "https://tesar-template.matej-kronus.workers.dev/",
    scope: { value: "Jedna stránka", sub: "7 sekcí" },
    priceNote: "Jedna stránka s galerií realizací a poptávkovým formulářem. Nic víc tesař na webu nepotřebuje — a přesně to obsahuje balíček Start.",
  },
  penzion: {
    headline: "Web pro penzion",
    about: "Penzion Pod Javorem na Šumavě si vymysleli, web pro něj je ale hotový — proklikejte si ho. Jedna stránka ve třech jazycích, kde host uvidí pokoje, spočítá si cenu pobytu a rovnou si ho zarezervuje. Napřímo, bez provize portálům.",
    features: [
      { title: "Rezervace s kalendářem", text: "Host vidí volné noci, vybere pokoj a počet hostů. Cena se spočítá hned — i s přistýlkou, psem a slevou za delší pobyt." },
      { title: "Česky, německy, anglicky", text: "Celý web včetně rezervace ve třech jazycích. Pro hosty z Bavorska i odjinud." },
      { title: "Nabídka podle sezóny", text: "Na podzim 4 noci za cenu 3, v zimě běžky od dveří, na jaře děti zdarma. Přepíná se sama podle měsíce." },
    ],
    plan: "Na míru",
    pages: ["Úvod s ověřením volna", "Sezónní nabídka", "Pokoje", "Co u nás najdete", "O nás", "Okolí a výlety", "Ceník", "Jak rezervace probíhá", "Rezervace", "Časté dotazy", "Jak k nám"],
    trade: "Malá firma · služby",
    preview: "/nahledy/penzion.webp",
    live: "https://penzion-template.matej-kronus.workers.dev/",
    launch: "do 3 týdnů",
    scope: { value: "Jedna stránka", sub: "3 jazyky" },
    priceNote: "Rezervace s kalendářem obsazenosti a výpočtem ceny je víc než formulář a tři jazyky znamenají tři verze všech textů. Proto balíček Na míru — pevnou cenu dostanete předem podle počtu pokojů a jazyků.",
  },
  fotovoltaika: {
    headline: "Web pro fotovoltaiku",
    about: "Firma Zenitra Energie neexistuje, web pro ni je ale hotový a funguje — včetně e-shopu. Zákazník si spočítá, kolik mu střecha ušetří, vybere hotovou sestavu a komponenty si rovnou objedná.",
    features: [
      { title: "Kalkulačka úspory", text: "Spotřeba, cena elektřiny, orientace střechy a baterie. Hned je vidět výkon, úspora, dotace i návratnost." },
      { title: "E-shop s košíkem", text: "24 produktů v sedmi kategoriích — panely, střídače, baterie i wallboxy. Košík, doprava a objednávka." },
      { title: "Kam teče elektřina", text: "Posuvník času dne ukáže, jak střídač dělí energii mezi dům, baterii, auto a síť." },
    ],
    plan: "Na míru",
    pages: ["Úvod", "Kalkulačka", "Služby", "Sestavy a ceny", "Realizace", "E-shop", "Detail produktu", "Košík", "Kontakt"],
    trade: "Elektroinstalace",
    preview: "/nahledy/fotovoltaika.webp",
    live: "https://fotovoltaika-template.matej-kronus.workers.dev/",
    launch: "do 3 týdnů",
    scope: { value: "Web a e-shop", sub: "24 produktů" },
    priceNote: "Úvodní stránka s kalkulačkou, realizace a k tomu celý e-shop s košíkem a objednávkou. To je balíček Na míru — pevnou cenu řekneme předem podle počtu produktů a napojení na sklad.",
  },
  autoskola: {
    headline: "Web pro autoškolu",
    about: "Autoškola Zelená vlna z Olomouce je vymyšlená, web pro ni je ale hotový — proklikejte si ho. Jedna dlouhá stránka, která uchazeče provede od výběru kurzu přes cenu a instruktory až k přihlášce. A cestou si zkusí test nanečisto.",
    features: [
      { title: "Cena podle vás", text: "Vyberete kurz a co k němu chcete, cena se přepočítá hned. Žádné „od“ a hvězdičky." },
      { title: "Test nanečisto", text: "Pět otázek jako ve skutečném testu. Bez registrace, výsledek hned." },
      { title: "Odpočet do dalšího kurzu", text: "Kdy začíná další kurz a kolik zbývá volných míst. Termíny se posouvají samy." },
    ],
    plan: "Poctivý web",
    pages: ["Úvod s odpočtem", "O autoškole", "Kurzy", "Ceník a kalkulačka", "Instruktoři", "Cesta k řidičáku", "Test nanečisto", "Recenze", "Časté dotazy", "Přihláška"],
    trade: "Malá firma · služby",
    preview: "/nahledy/autoskola.webp",
    live: "https://autoskola-template.matej-kronus.workers.dev/",
    scope: { value: "Jedna stránka", sub: "10 sekcí" },
    priceNote: "Je to jedna stránka, ale s kalkulačkou ceny, testem z teorie, odpočtem kurzů a přihláškou. To už je víc než Start — proto Poctivý web.",
  },
};

export const NOT_FOUND = {
  title: "Tahle stránka nezvoní.",
  text: "Odkaz je nejspíš starý nebo překlep. Zkuste to z úvodní stránky.",
  cta: "Na úvodní stránku",
};

/** the large image a concept page shows: its screenshot once there is one, the photo until then */
export const conceptPhoto = (slug: string) => {
  const p = PORTFOLIO.items.find((x) => x.slug === slug);
  return CONCEPT_DETAILS[slug]?.preview ?? (p ? heroPhoto(p.src) : "");
};
