import { Clock, MonitorSmartphone, Search } from "lucide-react";
import { Reveal, SectionHead } from "./ui";

const PAINS = [
  {
    n: "01",
    icon: MonitorSmartphone,
    title: "Web z doby, kdy frčel ICQ",
    text: "Z roku 2013. Na mobilu se rozsype, Google ho neukazuje a zákazník utíká dřív, než se vůbec načte.",
  },
  {
    n: "02",
    icon: Search,
    title: "Konkurence je vidět. Vy ne.",
    text: "Když někdo napíše „instalatér Plzeň“, objeví se tři firmy před vámi. A hádáte správně — volá jim, ne vám.",
  },
  {
    n: "03",
    icon: Clock,
    title: "Na web prostě není čas",
    text: "Celý den v dílně nebo u zákazníků. Večer chcete spát, ne se učit HTML. Přesně proto tu jsme my.",
  },
];

export default function Problem() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="01"
          eyebrow="Znáte to?"
          title={
            <>
              Řemeslu rozumíte <span className="text-accent">vy.</span>
              <br />
              Webům zase my.
            </>
          }
          desc="Většina živnostníků nemá špatný web proto, že by jim na něm nezáleželo. Mají ho proto, že okolo něj běží opravdová práce."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-paper/10 bg-card p-8 transition-colors duration-500 hover:border-accent/40">
                <div className="absolute -right-4 -top-6 stretch text-[104px] font-black leading-none text-paper/[0.04] transition-colors duration-500 group-hover:text-accent/10">
                  {p.n}
                </div>
                <div className="relative">
                  <div className="grid size-12 place-items-center rounded-2xl border border-paper/10 bg-ink text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <p.icon className="size-5.5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-6 stretch text-xl font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-12 max-w-2xl border-l-2 border-accent pl-6 text-[17px] leading-relaxed text-paper/85">
            Správný web pro řemeslníka nemá být „hezký“. Má vás <strong>dostat na Google</strong>, ukázat vaši
            práci a udělat z návštěvníka <strong>hovor nebo poptávku</strong>. Nic víc. A přesně to stavíme.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
