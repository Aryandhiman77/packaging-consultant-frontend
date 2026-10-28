import ContentWatermark from "./ContentWatermark";
import { Link } from "react-router-dom";

export default function ContentDocument({
  title,
  intro = [],
  lead,
  callout,
  sections = [],
  body = [],
  closingLead,
  closing = [],
  links = [],
  renderItems,
}) {
  return (
    <main className="relative isolate mx-auto min-h-[620px] w-full max-w-[100vw] overflow-hidden border-x border-[#8d8985] bg-white text-[#201d1b]">
      <ContentWatermark />

      <article className="relative z-10 mx-auto w-full max-w-[100vw] px-6 py-10 sm:px-12 sm:py-14 lg:px-[7%] lg:py-16">
        {title && (
          <h1 className="m-0 text-[clamp(1rem,1.25vw,1.18rem)] leading-[1.35] font-black tracking-[.01em] text-[#201d1b] uppercase">
            {title}
          </h1>
        )}

        {lead && (
          <p className={`${title ? "mt-7" : "mt-0"} text-[clamp(1rem,1.3vw,1.22rem)] leading-[1.55] font-black`}>
            {lead}
          </p>
        )}

        <div className={`${title || lead ? "mt-5" : "mt-0"} space-y-5 text-[clamp(.98rem,1.22vw,1.18rem)] leading-[1.55]`}>
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {callout && (
          <p className="mt-8 text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.5] font-black italic">
            {callout}
          </p>
        )}

        <div className="mt-8 space-y-8">
          {sections.map((section, index) => (
            <section key={section.heading || `content-section-${index}`}>
              {section.heading && (
                <h2 className="text-[clamp(1.05rem,1.35vw,1.28rem)] leading-[1.35] font-black">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs && (
                <div className="mt-4 space-y-4 text-[clamp(.98rem,1.16vw,1.14rem)] leading-[1.55]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}

              {section.items &&
                (renderItems ? (
                  renderItems(section, index)
                ) : (
                  <ul className="mt-4 list-disc space-y-1.5 pl-8 text-[clamp(.98rem,1.16vw,1.14rem)] leading-[1.45] marker:text-black">
                    {section.items.map((item) => (
                      <li key={item} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                ))}
            </section>
          ))}
        </div>

        <div className="mt-9 space-y-5 text-[clamp(.98rem,1.22vw,1.18rem)] leading-[1.55]">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {closingLead && <p className="font-black">{closingLead}</p>}
          {closing.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {links.length > 0 && (
          <nav className="mt-7" aria-label="Related pages">
            <ul className="space-y-1 text-[clamp(.9rem,1.05vw,1.02rem)] leading-[1.4]">
              {links.map(([label, target]) => (
                <li key={`${label}-${target}`}>
                  {target.toLowerCase().endsWith(".pdf") ? (
                    <a
                      href={target}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold !text-[#c51e30] underline underline-offset-2"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={target}
                      className="font-bold !text-[#c51e30] underline underline-offset-2"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </main>
  );
}
