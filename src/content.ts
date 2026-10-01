export const SITE = {
  name: "webcozvoni",
  brandSuffix: ".cz",
  domain: "webcozvoni.cz",
  wordmark: "WEBCOZVONÍ",
  phone: "608 228 124",
  phoneLink: "+420608228124",
  email: "info@webcozvoni.cz",
  ico: "29860873",
  location: "Plzeň · Rokycany · Nýřany · kamkoliv autem",
  serviceArea: "Plzeň & okolí",
  contactLocation: "Plzeň — a za vámi přijedeme",
  openingHours: "Zvedáme po–pá 8:00–17:00",
  footerSignoff: "Vyrobeno poctivě v Plzni",
  footerDescription:
    "Poctivé weby pro živnostníky a malé firmy z Plzně a okolí. Bez keců, za férovou cenu — a tak, aby vám díky nim zvonil telefon.",
};

export const SETTINGS = {
  smoothScrollLerp: 0.11,
  smoothScrollOffset: -70,
  smoothScrollDuration: 1.4,
  floatingCallScrollThreshold: 640,
  callerRotationMs: 4200,
  formSubmitDelayMs: 1100,
};

export const NAV_LINKS = [
  { label: "Služby", href: "#sluzby" },
  { label: "Postup", href: "#postup" },
  { label: "Koncepty", href: "#reference" },
  { label: "Ceník", href: "#cenik" },
  { label: "Otázky", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export const HEADER = {
  offerCta: "Chci nabídku zdarma",
  openMenu: "Otevřít menu",
  closeMenu: "Zavřít menu",
  callUs: "Zavolejte nám",
};

export const HERO = {
  eyebrowPrefix: "Webová agentura — ",
  titleLines: ["Weby,", "co zvoní."],
  audience: "živnostníky a malé firmy",
  descriptionStart: "Stavíme poctivé weby pro ",
  descriptionMiddle: " z Plzně a okolí. Bez korporátních keců a paušálů za nic — jen web, díky kterému ",
  descriptionEnd: "vás zákazníci snadno najdou a kontaktují.",
  primaryCta: "Nezávazná konzultace zdarma",
  secondaryCta: "Podívat se na koncepty",
  disclaimer: "Ukázkové scénáře nejsou klientské výsledky",
  stats: [
    { value: "72 h", label: "první návrh — zdarma" },
    { value: "14 dní", label: "od zadání po spuštění" },
    { value: "0 Kč", label: "měsíční paušály za nic" },
    { value: "24 h", label: "do odpovědi na poptávku" },
  ],
  callers: [
    { tag: "Ukázkový scénář", name: "Poptávka na instalatérské práce", place: "Ilustrační obsah", initials: "UP" },
    { tag: "Ukázkový scénář", name: "Rezervace termínu v salonu", place: "Ilustrační obsah", initials: "RS" },
    { tag: "Ukázkový scénář", name: "Poptávka na nábytek na míru", place: "Ilustrační obsah", initials: "NM" },
    { tag: "Ukázkový scénář", name: "Objednání do autoservisu", place: "Ilustrační obsah", initials: "OA" },
  ],
  callLabels: {
    inProgress: "Hovor probíhá",
    incoming: "Příchozí poptávka",
    next: "Příští",
    accept: "Přijmout",
    hangUp: "Ukončit hovor",
    reject: "Odmítnout",
    acceptRequest: "Přijmout poptávku",
    sampleFeature: "Ukázková funkce",
    requestForm: "Poptávkový formulář",
    booking: "Online rezervace termínu",
  },
};

export const PROBLEM = {
  eyebrow: "Znáte to?",
  titleLead: "Řemeslu rozumíte",
  titleAccent: "vy.",
  titleEnd: "Webům zase my.",
  description:
    "Většina živnostníků nemá špatný web proto, že by jim na něm nezáleželo. Mají ho proto, že okolo něj běží opravdová práce.",
  items: [
    {
      title: "Web z doby, kdy frčel ICQ",
      text: "Z roku 2013. Na mobilu se rozsype, Google ho neukazuje a zákazník utíká dřív, než se vůbec načte.",
    },
    {
      title: "Konkurence je vidět. Vy ne.",
      text: "Když někdo napíše „instalatér Plzeň“, objeví se tři firmy před vámi. A hádáte správně — volá jim, ne vám.",
    },
    {
      title: "Na web prostě není čas",
      text: "Celý den v dílně nebo u zákazníků. Večer chcete spát, ne se učit HTML. Přesně proto tu jsme my.",
    },
  ],
  closingStart: "Správný web pro řemeslníka nemá být „hezký“. Má vás ",
  closingGoogle: "dostat na Google",
  closingMiddle: ", ukázat vaši práci a udělat z návštěvníka ",
  closingContact: "hovor nebo poptávku",
  closingEnd: ". Nic víc. A přesně to stavíme.",
};

export const SERVICES = {
  eyebrow: "Co pro vás uděláme",
  titleLead: "Všechno okolo webu.",
  titleAccent: "Pod jednou střechou.",
  description: "Nebudete shánět copywritera, fotografa ani ajťáka na hosting. Zavoláte jednou a vyřídí se všechno.",
  items: [
    {
      title: "Weby na míru",
      text: "Žádná šablona za tři stovky. Web stavěný pro vaše řemeslo, vaše zákazníky a hlavně pro mobil, na kterém vás hledají.",
      tags: ["Web design", "Vývoj"],
    },
    {
      title: "Lokální SEO",
      text: "Ať vás najdou, když hledají „řemeslo + Plzeň“. Profil firmy na Google, mapy, struktura webu i obsah.",
      tags: ["Google profil", "Mapy"],
    },
    {
      title: "Rezervace a poptávky",
      text: "Formuláře, objednávky a online kalendář. Zákazník se ozve i večer v devět — když už zrovna nechcete zvedat telefon.",
      tags: ["Formuláře", "Kalendář"],
    },
    {
      title: "E-shopy",
      text: "Prodáváte to, co vyrábíte? Postavíme obchod, který zvládnete obsluhovat sami — bez programátora na telefonu.",
      tags: ["Prodej online", "Platby"],
    },
    {
      title: "Správa a hosting",
      text: "Aktualizace, zálohy a drobné úpravy. Jedna SMS a druhý den je hotovo. Vy se věnujete práci, my webu.",
      tags: ["Hosting", "Podpora"],
    },
    {
      title: "Texty a fotky",
      text: "Napíšeme texty, co prodávají vaši práci — a když je potřeba, přijedeme vyfotit dílnu i hotové zakázky.",
      tags: ["Copywriting", "Foto"],
    },
  ],
};

export const PROCESS = {
  eyebrow: "Jak to funguje",
  titleLead: "Od telefonátu",
  titleAccent: "k telefonátům.",
  description: "Čtyři kroky, žádné překvapení. Termíny a cenu dostanete předem — a platí to, co bylo dohodnuto.",
  steps: [
    {
      title: "Zavoláme si",
      text: "Patnáct minut telefonu. Zeptáme se na pár věcí a poradíme upřímně — i kdybyste si web nakonec dělali sami.",
      meta: "Zdarma · bez závazků",
    },
    {
      title: "Návrh do 72 hodin",
      text: "Uvidíte, jak bude web vypadat, dřív než cokoliv zaplatíte. Nelíbí se? Upravíme — nebo se rozejdeme jako kamarádi.",
      meta: "3 dny · platba až po schválení",
    },
    {
      title: "Web do 14 dnů venku",
      text: "Texty, fotky, formuláře, SEO. Vy to schválíte, my spustíme. Doména i web jsou od prvního dne vaše.",
      meta: "2 týdny · klíče v ruce",
    },
    {
      title: "Začne to zvonit",
      text: "Hlídáme návštěvnost a poptávky, každý měsíc držíme web fit. Vy řešíte už jen to, kam tu zakázku nacpete.",
      meta: "Trvale · měsíční report",
    },
  ],
  guaranteeEyebrow: "Garance, co se nešvejkuje",
  guarantee: "Zpozdíme se z naší viny? Sleva 10 %. Bez diskuzí.",
  guaranteeCta: "Chci termín návrhu",
};

export const PORTFOLIO = {
  eyebrow: "Oborové koncepty",
  titleLead: "Ukázky, ne",
  titleAccent: "reference.",
  description:
    "Zatím nemáme realizované weby, které bychom mohli ukázat. Tyto oborové koncepty ilustrují obsah a funkce, které můžeme navrhnout. Fotografie jsou ilustrační.",
  conceptLabel: "Koncept",
  closing: "Chcete probrat vlastní web?",
  closingLink: "Ozvěte se",
  items: [
    {
      name: "Web pro instalatéra",
      place: "Koncept pro řemeslníka",
      services: ["Služby", "Poptávkový formulář"],
      description: "Přehled služeb, oblast výjezdu a jednoduchá cesta k poptávce.",
      img: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      alt: "Instalatér montuje rozvody vody v koupelně",
    },
    {
      name: "Web pro truhláře",
      place: "Koncept pro řemeslníka",
      services: ["Realizace", "Fotogalerie"],
      description: "Prostor pro ukázky práce, materiály a popis zakázek na míru.",
      img: "https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      alt: "Truhlář opracovává dřevo na pile v dílně",
    },
    {
      name: "Web pro salon",
      place: "Koncept pro služby",
      services: ["Ceník", "Rezervace"],
      description: "Ceník, informace o službách a návrh online objednávání.",
      img: "https://images.pexels.com/photos/39559306/pexels-photo-39559306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      alt: "Kadeřník stříhá vlasy v salonu",
    },
    {
      name: "Web pro autoservis",
      place: "Koncept pro služby",
      services: ["Služby", "Kontakt"],
      description: "Srozumitelná nabídka oprav, otevírací doba a rychlý kontakt.",
      img: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      alt: "Automechanik kontroluje motor v servisu",
    },
  ],
};

export const PRICING = {
  eyebrow: "Ceník",
  titleLead: "Cena na stole.",
  titleAccent: "Hned a celá.",
  description: "Žádné „napište nám a uvidíme“. Víte předem, kolik co stojí — a dohodnutá cena se nehne ani o korunu.",
  featuredLabel: "Nejčastější volba",
  noteLabel: "// poznámka pod čarou",
  note: "Všechny weby platíte jednorázově — web je váš, žádný pronájem. Hosting + doména od 1 800 Kč/rok, první rok máte od nás k webu. Návrh zdarma, platba až po jeho schválení.",
  plans: [
    {
      name: "Start",
      price: "9 900 Kč",
      per: "jednorázově",
      desc: "Pro živnostníka, co potřebuje být konečně pořádně vidět.",
      features: ["Jednostránkový web na míru", "Poptávkový formulář + mapa", "Mobilní verze, co nezlobí", "Základy SEO + profil na Google", "Spuštění do 10 dnů"],
      cta: "Chci Start",
      featured: false,
    },
    {
      name: "Poctivý web",
      price: "19 900 Kč",
      per: "jednorázově",
      desc: "Nejčastější volba pro malé firmy, dílny a salony.",
      features: ["Vše z balíčku Start", "Do 8 podstránek + sekce referencí", "Rezervace nebo objednávkový modul", "Rozšířené lokální SEO pro Plzeň i okolí", "45min školení — úpravy zvládnete sami", "Spuštění do 14 dnů"],
      cta: "Chci Poctivý web",
      featured: true,
    },
    {
      name: "Na míru",
      price: "Cena dohodou",
      per: "vždy pevná a předem",
      desc: "E-shop, katalog nebo cokoliv, co se do krabičky nevejde.",
      features: ["E-shop nebo katalog produktů", "Atypické funkce a napojení na systémy", "Vícejazyčná verze i velké weby", "Konzultace zdarma, nabídka do 48 h"],
      cta: "Popište nám zadání",
      featured: false,
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: "Recenze",
  titleLead: "Žádné vymyšlené",
  titleAccent: "recenze.",
  description: "Zatím nemáme klientské recenze ani realizace, o které bychom se mohli opřít. Až budeme mít svolení klientů, zveřejníme jejich skutečné zkušenosti.",
  note: "Raději vám ukážeme náš postup, ceny a ukázkové koncepty, než abychom zveřejňovali zkušenosti, které zatím nemáme.",
  cta: "Probrat váš web",
};

export const FAQ = {
  eyebrow: "Časté otázky",
  titleLead: "Na rovinu",
  titleAccent: "odpovězeno.",
  intro: "Nenašli jste, co jste hledali? Zavolejte — raději odpovíme na hloupou otázku než na tu nezodpovězenou.",
  items: [
    {
      question: "Kolik trvá výroba webu?",
      answer: "Menší weby stíháme za 7–10 dní, ty větší za 2–3 týdny. Termín dostanete předem na papír — a když se zpozdíme z naší viny, máte slevu 10 %. Zpozdit se kvůli nám zkrátka nemůže stát vašeho času.",
    },
    {
      question: "Musím si něco připravit nebo vymyslet texty?",
      answer: "Ne. Stačí telefon a půl hodina času na úvodní hovor. Texty napíšeme my, fotky použijeme vaše — nebo k vám přijedeme a dílnu, tým i hotové zakázky vyfotíme. Vy pak jen schválíte výsledek.",
    },
    {
      question: "Kolik mě web bude stát dohromady a do roka?",
      answer: "Cenu návrhu a výroby víte předem a pevně. K tomu hosting a doména od 1 800 Kč ročně (první rok je od nás). Žádné skryté poplatky, žádné „měsíční paušály na nic“, o kterých se dozvíte až za půl roku.",
    },
    {
      question: "Co když se mi první návrh nebude líbit?",
      answer: "První návrh děláme do 72 hodin zdarma a bez závazků. Upravujeme ho, dokud nesedne — a zaplatíte až po jeho schválení. Kdyby nesedl ani poté, rozejdeme se bez faktury a bez křiku.",
    },
    {
      question: "Zvládnu si web upravovat sám?",
      answer: "Ano. Během 45 minut vás naučíme měnit texty, ceny i fotky — víc většinou není potřeba. A kdybyste si přesto nevěděli rady, stačí napsat; drobné úpravy pro klienty se správou děláme zdarma.",
    },
    {
      question: "Pomůžete i s Googlem, mapami a e-mailem?",
      answer: "Jasně. Zřídíme a doladíme firemní profil na Google (mapy, recenze, fotky), e-maily na vaší doméně i propojení se sociálními sítěmi. Všechno okolo webu pod jednou střechou.",
    },
  ],
};

export const CONTACT = {
  eyebrow: "08 — Kontakt",
  titleLead: "Chcete web,",
  titleAccent: "zvoní?",
  descriptionStart: "Formulář vyplníte za dvě minuty. Do 24 hodin se ozveme — ",
  descriptionHighlight: "většinou během pár hodin",
  descriptionEnd: " — a domluvíme si krátký hovor. Žádný spam, žádné „dobré dopoledne, volám z call centra“.",
  availability: "Volná kapacita od",
  monthsGenitive: [
    "ledna", "února", "března", "dubna", "května", "června",
    "července", "srpna", "září", "října", "listopadu", "prosince",
  ],
  firstDraft: "První návrh do 72 hodin",
  callNote: "Když nezvedneme, jsme u klienta — ozveme se zpět",
  emailLabel: "E-mail",
  locationLabel: "Kde nás najdete",
  successTitle: "Díky, je to u nás.",
  successStart: "Ozveme se do 24 hodin — většinou mnohem dřív. Když to hodně hoří, rovnou volejte",
  formTitle: "Nezávazná poptávka",
  formDuration: "2 minuty práce",
  fields: {
    name: "Jméno a příjmení *",
    phone: "Telefon *",
    email: "E-mail",
    trade: "Čím se živíte? *",
    tradePlaceholder: "Vyberte obor…",
    message: "Co potřebujete? *",
    consent: "Souhlasím se zpracováním údajů za účelem vyřízení poptávky. Žádný spam — fakt.",
    submit: "Odeslat poptávku",
    sending: "Odesíláme…",
    response: "Odpovídáme do 24 hodin · první návrh zdarma",
    namePlaceholder: "Jan Novák",
    phonePlaceholder: "777 123 456",
    emailPlaceholder: "jan@firma.cz",
    messagePlaceholder: "Např.: Mám starý web z roku 2015 a potřebuju nový. Hlavně aby mě lidi našli v Plzni a mohli rovnou volat…",
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
  navigationLabel: "Navigace",
  servicesLabel: "Služby",
  backToTop: "Zpět nahoru",
  services: ["Weby na míru", "Lokální SEO", "Rezervace a poptávky", "E-shopy", "Správa a hosting", "Texty a fotky"],
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
