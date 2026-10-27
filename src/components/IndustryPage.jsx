import { Link, Navigate, useParams } from 'react-router-dom'
import ContentWatermark from './ContentWatermark'
import Footer from './Footer'
import HeaderHero from './HeaderHero'
import { industries, industriesBySlug } from '../data/industries'

function scrollPageTop() {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

function IndustryDetail({ industry }) {
  return (
    <main className="relative overflow-x-clip bg-[#f5f1ed] text-[#30231c]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(120deg,#17110f_0%,#38271f_60%,#7e292c_100%)]" />
      <img className="pointer-events-none absolute top-16 right-[-5rem] w-[31rem] opacity-[.075]" src="/assets/site/header-mark-clean.png" alt="" />

      <div className="relative mx-auto max-w-7xl px-0 py-10 sm:px-8 lg:px-12 lg:py-14">
        <nav className="flex flex-wrap items-center gap-2 px-4 text-xs font-bold text-white/60 sm:px-0" aria-label="Breadcrumb">
          <Link to="/" className="!text-white/75 no-underline hover:!text-white">Home</Link>
          <span>/</span>
          <span className="text-white/75">Industries</span>
          <span>/</span>
          <span className="text-white">{industry.title}</span>
        </nav>

        <div className="mt-7 grid items-start gap-0 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="relative overflow-hidden border-0 bg-white shadow-[0_28px_80px_rgba(35,20,12,.24)] sm:rounded-[1.75rem] sm:border sm:border-white/30">
            <ContentWatermark repeat />

            <header className="relative z-10 overflow-hidden bg-[linear-gradient(135deg,#fff_0%,#f7f3ef_60%,#eadfd7_100%)] px-6 py-9 sm:px-10 sm:py-12">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-[#e51f32]" />
              <p className="text-xs font-black tracking-[.2em] text-[#d91f31] uppercase">Industries</p>
              <h1 className="mt-3 max-w-4xl font-serif text-3xl leading-tight font-bold tracking-tight text-[#211914] sm:text-5xl">{industry.title}</h1>
            </header>

            <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
              <div className="space-y-4 text-[17px] leading-8 text-[#4b3a30]">
                {industry.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-2">
                {industry.sections.map((section) => (
                  <section key={section.heading} className="border border-[#e2d8d0] bg-[#faf8f6]/90 p-5 sm:rounded-2xl sm:p-7">
                    <h2 className="text-lg font-black text-[#2b201a]">{section.heading}</h2>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-6 marker:text-[#e51f32]">
                      {section.items.map((item) => <li key={item} className="pl-1">{item}</li>)}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="mt-8 space-y-4 text-[17px] leading-8 text-[#4b3a30]">
                {industry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <section className="mt-8 border-t border-[#ded2ca] pt-5">
                <div className="flex flex-wrap gap-2">
                  {industry.links.map(([label, target], index) => (
                    <Link
                      key={label}
                      to={target}
                      onClick={scrollPageTop}
                      className={index === 0
                        ? 'bg-[#e51f32] px-3 py-2 text-xs font-black !text-white no-underline shadow-[0_7px_18px_rgba(229,31,50,.2)] transition hover:bg-[#c91929] sm:rounded-lg'
                        : 'border border-[#d7c9c0] bg-white px-3 py-2 text-xs font-black !text-[#4b3529] no-underline transition hover:border-[#e51f32] hover:!text-[#c91929] sm:rounded-lg'}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </article>

          <aside className="self-start border-0 bg-[#1f1713]/95 p-4 text-white shadow-[0_20px_50px_rgba(28,17,11,.22)] backdrop-blur sm:rounded-2xl sm:border sm:border-white/20 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto" aria-label="Industries">
            <h2 className="px-3 pt-2 pb-3 text-xs font-black tracking-[.18em] text-[#ef9da6] uppercase">Industries</h2>
            <nav className="grid gap-1">
              {industries.map((item, index) => (
                <Link
                  key={item.slug}
                  to={`/industries/${item.slug}`}
                  onClick={scrollPageTop}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold no-underline transition ${item.slug === industry.slug ? 'bg-[#e51f32] !text-white' : '!text-white/75 hover:bg-white/10 hover:!text-white'}`}
                >
                  <span className="text-[10px] text-white/45">{String(index + 1).padStart(2, '0')}</span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default function IndustryPage() {
  const { slug } = useParams()
  const industry = slug ? industriesBySlug[slug] : null

  if (!industry) return <Navigate to="/" replace />

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <IndustryDetail industry={industry} />
      <Footer />
    </div>
  )
}
