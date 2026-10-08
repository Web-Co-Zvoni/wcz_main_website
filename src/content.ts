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

/**
 * Detail pages the niche cards and concept cards click through to. Niche pages are generated at
 * build time from NICHES + NICHE_PAGES (see vite.config.ts); concept pages come later (404 until then).
 */
export const ROUTES = {
  niche: (slug: string) => `/obory/${slug}/`,
  concept: (slug: string) => `/koncepty/${slug}/`,
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

/** Shared copy for the niche detail pages (/obory/<slug>/) */
export const NICHE_PAGE = {
  home: "Úvod",
  section: "Pro koho pracujeme",
  photoNote: "Fotka je ilustrační.",
  primaryCta: "Chci návrh zdarma",
  searchKicker: "Lokální SEO",
  searchTitle: "Takhle vás zákazníci hledají",
  searchNote: "Na tyhle dotazy chceme, aby Google ukázal vás — ne konkurenci.",
  needsKicker: "Co na webu bude",
  needsTitle: "Co na webu nesmí chybět",
  processKicker: "Postup",
  priceLead: "Weby od",
  priceNote: "jednorázově, cena vždy předem",
  priceLink: "Celý ceník",
  othersTitle: "Pracujeme i pro",
  /** <title> and meta description of each page, built from its heading */
  metaTitle: (heading: string) => `${heading} — Plzeň a okolí · webcozvoni.cz`,
  metaDescription: (heading: string) =>
    `${heading} z Plzně a okolí. Návrh do 72 hodin zdarma, spuštění do 14 dnů, jednorázová cena předem.`,
};

/**
 * One detail page per NICHES item, keyed by slug. `trade` preselects the matching chip in the
 * contact form (one of CONTACT.trades).
 */
export const NICHE_PAGES: Record<
  string,
  { heading: string; lead: string; trade: string; searches: string[]; needs: { title: string; text: string }[] }
> = {
  elektrikari: {
    heading: "Weby pro elektrikáře",
    lead: "Když někomu vypadnou jističe, nehledá dlouho. Zavolá prvnímu elektrikáři, kterého najde v telefonu a kterému věří. Postavíme web, aby to byl váš.",
    trade: "Elektroinstalace",
    searches: ["elektrikář plzeň", "elektrikář pohotovost", "revize elektro rokycany", "výměna rozvaděče cena"],
    needs: [
      { title: "Telefon na prvním místě", text: "Tlačítko Zavolat vidí zákazník hned po otevření webu, i na malém displeji." },
      { title: "Revize a oprávnění", text: "Osvědčení a typy revizí přehledně na jednom místě. Firmy a SVJ to hledají jako první." },
      { title: "Oblast výjezdu", text: "Mapa a seznam obcí, kam jezdíte. Ať vám nevolají lidé z druhého konce kraje." },
      { title: "Poptávka s fotkou", text: "Zákazník nafotí rozvaděč nebo závadu a pošle ji formulářem. Víte, co vézt, ještě než vyjedete." },
    ],
  },
  fotovoltaika: {
    heading: "Weby pro fotovoltaiku",
    lead: "Elektrárna na střechu je velký nákup a lidé srovnávají nabídky týdny. Web jim musí vysvětlit, kolik to stojí, kolik ušetří a proč právě vy.",
    trade: "Jiné řemeslo",
    searches: ["fotovoltaika plzeň", "fotovoltaika na klíč cena", "dotace na fotovoltaiku", "baterie k fotovoltaice"],
    needs: [
      { title: "Kalkulačka návratnosti", text: "Spotřeba, plocha střechy a orientační cena. Zákazník si udělá obrázek sám a vám pošle hotové údaje." },
      { title: "Dotace srozumitelně", text: "Co pokryje Nová zelená úsporám a co vyřídíte za zákazníka. Bez úředního jazyka." },
      { title: "Realizace s čísly", text: "Fotky hotových střech s výkonem v kWp a typem střídače. Řeknou o kvalitě víc než odstavec textu." },
      { title: "Poptávka krok za krokem", text: "Pár otázek místo dlouhého formuláře. Dostanete poptávky, se kterými se dá rovnou počítat." },
    ],
  },
  "instalateri-a-topenari": {
    heading: "Weby pro instalatéry a topenáře",
    lead: "Teče voda, nejde topení. Zákazník chce vědět jen tři věci: kdy přijedete, kolik to zhruba bude a na jaké číslo volat.",
    trade: "Instalatérství · voda · topení",
    searches: ["instalatér plzeň", "havárie vody plzeň", "servis kotle", "výměna radiátorů cena"],
    needs: [
      { title: "Havarijní linka", text: "Velké tlačítko pro havárie a jasně napsané, kdy jezdíte. Volají ti, kdo vás opravdu potřebují." },
      { title: "Ceník běžných prací", text: "Výjezd, výměna baterie, servis kotle. Orientační ceny ušetří vám i zákazníkovi zbytečné telefonáty." },
      { title: "Servis kotlů na termín", text: "Pravidelné prohlídky si lidé zarezervují sami v kalendáři. Žádné domlouvání přes SMS." },
      { title: "Značky, které servisujete", text: "Seznam výrobců kotlů a ohřívačů. Lidé často hledají přímo podle značky." },
    ],
  },
  "tepelna-cerpadla-a-klimatizace": {
    heading: "Weby pro tepelná čerpadla a klimatizace",
    lead: "Zákazník řeší, jestli se mu čerpadlo vyplatí a jestli nebude klimatizace hlučná. Web, který na to odpoví dřív než konkurence, získá zakázku.",
    trade: "Jiné řemeslo",
    searches: ["tepelné čerpadlo plzeň", "klimatizace do bytu cena", "servis tepelného čerpadla", "tepelné čerpadlo dotace"],
    needs: [
      { title: "Srovnání řešení", text: "Vzduch–voda, země–voda, split klimatizace. Krátce a lidsky, ať zákazník ví, na co se ptát." },
      { title: "Servisní smlouvy", text: "Pravidelný servis jako služba s cenou. Stálí zákazníci a práce i mimo sezónu." },
      { title: "Sezónní nabídky", text: "Na jaře klimatizace, na podzim topení. Úvodní stranu přepnete jedním kliknutím." },
      { title: "Poptávka s parametry", text: "Velikost domu, současné topení, rozpočet. Na první schůzku přijedete připravení." },
    ],
  },
  "tesari-a-truhlari": {
    heading: "Weby pro tesaře a truhláře",
    lead: "Práce ze dřeva se prodává očima. Kuchyň, pergola nebo krov — zákazník chce vidět, co umíte, a pak se ozve s vlastní představou.",
    trade: "Truhlářství · stolářství",
    searches: ["truhlář plzeň", "kuchyně na míru plzeň", "pergola na zakázku", "tesař krov cena"],
    needs: [
      { title: "Galerie, která prodává", text: "Velké fotky hotových prací roztříděné podle typu: kuchyně, schody, pergoly, krovy." },
      { title: "Výroba krok za krokem", text: "Od zaměření přes návrh po montáž. Zákazník ví, co ho čeká a jak dlouho to potrvá." },
      { title: "Poptávka s nákresem", text: "Formulář, kam zákazník nahraje fotku místa nebo vlastní skicu s rozměry." },
      { title: "Materiály a dřeviny", text: "Masiv, dýha, lamino. Krátké vysvětlení vám ušetří hodinu na schůzce." },
    ],
  },
  "okna-a-dvere": {
    heading: "Weby pro okna a dveře",
    lead: "Okna se mění jednou za dvacet let, takže zákazník neví, na co se ptát. Web, který ho výběrem provede, si od něj vyslouží poptávku.",
    trade: "Jiné řemeslo",
    searches: ["plastová okna plzeň", "výměna oken cena", "vchodové dveře na míru", "seřízení oken"],
    needs: [
      { title: "Průvodce výběrem", text: "Plast, dřevo, hliník. Profily, skla, kování — srozumitelně a s obrázky." },
      { title: "Poptávka podle rozměrů", text: "Počet oken a rozměry rovnou ve formuláři. Nabídku pošlete bez zbytečného volání." },
      { title: "Vzorkovna na mapě", text: "Adresa, mapa a kdy jste na místě. Okna si lidé chtějí osahat." },
      { title: "Servis a seřízení", text: "Samostatná stránka pro servis. Malé zakázky, ze kterých bývají velké." },
    ],
  },
  "stavby-a-rekonstrukce": {
    heading: "Weby pro stavby a rekonstrukce",
    lead: "Rekonstrukce je pro zákazníka velký krok a velké peníze. Dřív než zavolá, chce vidět, že se na vás může spolehnout: fotky, postup, termíny.",
    trade: "Stavebnictví · zednictví",
    searches: ["rekonstrukce koupelny plzeň", "rekonstrukce bytu cena", "stavební firma plzeň", "zednické práce rokycany"],
    needs: [
      { title: "Před a po", text: "Srovnání fotek z vašich zakázek. Nejsilnější argument, který máte." },
      { title: "Jasný postup", text: "Prohlídka, rozpočet, harmonogram, předání. Bez překvapení uprostřed práce." },
      { title: "Stránka pro každý typ zakázky", text: "Koupelny, byty, domy, fasády. Google vás pak najde podle toho, co lidé opravdu hledají." },
      { title: "Poptávka s fotkami", text: "Zákazník přiloží fotky a půdorys. Rozpočet uděláte rychleji a přesněji." },
    ],
  },
  "strechy-a-fasady": {
    heading: "Weby pro střechy a fasády",
    lead: "Do střechy zatéká a zákazník potřebuje někoho, kdo přijede a nebude to šidit. Web mu má ukázat obojí: že jste rychlí a že to umíte.",
    trade: "Stavebnictví · zednictví",
    searches: ["pokrývač plzeň", "oprava střechy cena", "zateplení fasády plzeň", "klempíř plzeň"],
    needs: [
      { title: "Oprava zvlášť od nových střech", text: "Zatékání má vlastní tlačítko. Nové střechy a zateplení vlastní poptávku." },
      { title: "Materiály a záruky", text: "Krytiny, systémy zateplení a jakou na ně dáváte záruku. Přehledně v jedné tabulce." },
      { title: "Realizace z výšky i zblízka", text: "Fotky hotových střech i detailů. Kvalitu ukážou líp než jakýkoliv text." },
      { title: "Dotace na zateplení", text: "Stručně, co se dá pokrýt z Nové zelené úsporám. Lidé to hledají dřív, než zavolají." },
    ],
  },
  autoservisy: {
    heading: "Weby pro autoservisy",
    lead: "Řidič chce vědět, jestli jeho auto vezmete, kdy a za kolik. Když to najde na webu a rovnou se objedná, nemusí vám volat uprostřed práce.",
    trade: "Autoservis",
    searches: ["autoservis plzeň", "výměna oleje cena", "pneuservis plzeň", "příprava na stk"],
    needs: [
      { title: "Objednání na termín", text: "Online kalendář s volnými termíny. Zákazník si vybere sám, vy jen potvrdíte." },
      { title: "Ceník základních úkonů", text: "Olej, brzdy, přezutí, klimatizace. Orientační ceny, které berou strach z účtu." },
      { title: "Značky a specializace", text: "Na co jste nejlepší. Lidé hledají „servis škoda“ nebo „servis diesel“." },
      { title: "Sezónní pneuservis", text: "Na jaře a na podzim vlastní stránka s objednáním přezutí. Fronta se rozloží sama." },
    ],
  },
  "hotely-a-penziony": {
    heading: "Weby pro hotely a penziony",
    lead: "Z každé rezervace přes Booking platíte provizi. Vlastní web s rezervací přivede hosty napřímo — a ti se k vám vracejí.",
    trade: "Malá firma · služby",
    searches: ["penzion plzeň", "ubytování šumava", "hotel s parkováním plzeň", "ubytování pro firmy plzeň"],
    needs: [
      { title: "Rezervace bez provize", text: "Kalendář obsazenosti a rezervace přímo na webu. Dá se propojit i s Bookingem, aby se termíny nekřížily." },
      { title: "Pokoje, které chcete vidět", text: "Velké fotky, vybavení a cena za noc. Každý pokoj přehledně na jednom místě." },
      { title: "Okolí a výlety", text: "Co je kolem, kam na kolo, kde se najíst. Hosté to hledají a Google to má rád." },
      { title: "Více jazyků", text: "Němčina a angličtina pro hosty z druhé strany hranice." },
    ],
  },
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
    { src: pexels(6419128), alt: "Instalatér montuje rozvody vody v koupelně", slug: "instalater", title: "Instalatér", subtitle: "Služby a poptávkový formulář" },
    { src: pexels(257736), alt: "Elektrikář zapojuje rozvaděč", slug: "elektrikar", title: "Elektrikář", subtitle: "Výjezdy a rychlý kontakt" },
    { src: pexels(32357250), alt: "Truhlář opracovává dřevo v dílně", slug: "truhlar", title: "Truhlář", subtitle: "Realizace a fotogalerie" },
    { src: pexels(3985360), alt: "Kosmetické ošetření pleti", slug: "kosmeticky-salon", title: "Kosmetický salon", subtitle: "Ceník a online rezervace" },
    { src: pexels(3807517), alt: "Automechanik kontroluje motor", slug: "autoservis", title: "Autoservis", subtitle: "Objednání na termín" },
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

export const FOOTER = {
  backToTop: "Zpět nahoru",
  privacy: "Zásady zpracování osobních údajů",
};
