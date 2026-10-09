import { BellMark, Button } from "../components/ui";
import { NOT_FOUND } from "../content";

export default function NotFound() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-4 pb-16 pt-40 text-center">
      <BellMark className="size-20 text-accent" strokeWidth={6} />
      <h1 tabIndex={-1} className="display mt-8 text-[clamp(2.4rem,5vw,4.6rem)] outline-none">
        {NOT_FOUND.title}
      </h1>
      <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-mute">{NOT_FOUND.text}</p>
      <Button href="/" size="lg" className="mt-10">
        {NOT_FOUND.cta}
      </Button>
    </section>
  );
}
