import { Link } from 'react-router-dom'
import Footer from './Footer'
import HeaderHero from './HeaderHero'
import ContentWatermark from './ContentWatermark'
import { artTemplatesPdfPath } from '../data/packagingServices'

const templateFigures = [
  {
    src: '/assets/art-templates/poly-lined-paper-tin-tie.png',
    alt: 'Poly lined paper tin tie bag dieline with printed Tate’s Bake Shop bags',
    className: 'lg:col-span-5',
  },
  {
    src: '/assets/art-templates/stand-up-zipper-pouch.png',
    alt: 'All film or foil stand up zipper pouch dieline with printed pouch examples',
    className: 'lg:col-span-7',
  },
  {
    src: '/assets/art-templates/side-gusset-foil-coffee.png',
    alt: 'Standard side gusset foil style coffee bag dieline and finished packages',
    className: 'lg:col-span-4',
  },
  {
    src: '/assets/art-templates/standard-quad-seal-coffee.png',
    alt: 'Standard quad seal coffee style bag dieline and finished packages',
    className: 'lg:col-span-4',
  },
  {
    src: '/assets/art-templates/quad-seal-box-bottom.png',
    alt: 'Quad seal box bottom bag with one side zipper dieline and printed packages',
    className: 'lg:col-span-4',
  },
]

export default function ArtTemplatesPage() {
  return (
    <div className="page-shell">
      <HeaderHero compact />

      <main className="relative overflow-hidden bg-white text-[#262323]">
        <ContentWatermark repeat />
        <div className="relative z-10 mx-auto w-full max-w-[1540px] px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold text-[#675f5a]" aria-label="Breadcrumb">
            <Link to="/" className="no-underline hover:text-[#e72538]">Home</Link>
            <span>/</span>
            <span>Packaging Services</span>
            <span>/</span>
            <span className="text-[#201d1c]">Art Templates</span>
          </nav>

          <section className="grid items-start gap-8 lg:grid-cols-[minmax(280px,390px)_minmax(0,1fr)] lg:gap-14">
            <div className="max-w-[390px] text-[13px] leading-[1.28] sm:text-sm">
              <h2 className="text-base font-black tracking-tight">STEP ONE:</h2>
              <p>Choose the Structure or Type of Bag or Pouch for your product.</p>

              <h2 className="mt-6 text-base font-black tracking-tight">ARTWORK SPECIFICATIONS:</h2>
              <p>
                If you request art services from us we high prefer PC Adobe Illustrator files Saved As .ai with any and all photos or images attached and in .eps or .tif format typically created or edited in Adobe Photoshop. Images for press print need to be 300 dpi or higher, no .gif or low resolution .jpg files. Further, we do prefer you convert fonts to Outlines requiring no fonts with the artwork you send. Customers may still send rough concept art, or art in black and white laser print however, please note there will be time added for artwork recreation.
              </p>
            </div>

            <div className="lg:pt-1">
              <h1 className="text-center font-sans text-[clamp(3.2rem,8vw,8.75rem)] leading-[.82] font-black tracking-[-.045em] text-[#211f1f] [text-shadow:0_14px_16px_rgba(42,36,34,.3)]">
                ART TEMPLATES
              </h1>
              <div className="mt-8 flex justify-center lg:justify-end">
                <a
                  href={artTemplatesPdfPath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#211f1f] bg-white px-5 py-3 text-xs font-black tracking-[.12em] text-[#211f1f] no-underline uppercase transition hover:bg-[#211f1f] hover:text-white"
                >
                  Open Original PDF <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>

          <section className="mt-12 grid items-start gap-x-8 gap-y-10 sm:mt-16 lg:grid-cols-12 lg:gap-y-14" aria-label="Packaging structure templates">
            {templateFigures.map((figure) => (
              <figure key={figure.src} className={`m-0 min-w-0 ${figure.className}`}>
                <img className="block h-auto w-full" src={figure.src} alt={figure.alt} />
              </figure>
            ))}
          </section>

          <section className="mt-12 sm:mt-16">
            <h2 className="text-center font-sans text-[clamp(2rem,4.1vw,4.25rem)] leading-[.98] font-black tracking-[-.035em] text-[#211f1f]">
              How You Start, Pick the Structure and the Best Barrier for Your Product.
            </h2>
            <figure className="m-0 mt-7 overflow-x-auto">
              <img
                className="block h-auto min-w-[760px] w-full"
                src="/assets/art-templates/structure-barrier-guide.png"
                alt="Custom printed polylined paper tin tie bag dieline with paper and claycoat package examples"
              />
            </figure>
          </section>

          <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-[#d9d3cf] pt-8">
            <Link
              to="/packaging-services/packaging-structures-dielines"
              className="border-2 border-[#211f1f] bg-[#211f1f] px-5 py-3 text-sm font-black !text-white no-underline transition hover:bg-[#e72538] hover:border-[#e72538]"
            >
              Packaging Structures &amp; Dielines
            </Link>
            <a
              href={artTemplatesPdfPath}
              download
              className="border-2 border-[#211f1f] bg-white px-5 py-3 text-sm font-black !text-[#211f1f] no-underline transition hover:bg-[#f2efed]"
            >
              Download Art Templates PDF
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
