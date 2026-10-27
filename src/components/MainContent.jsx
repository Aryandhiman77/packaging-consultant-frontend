export default function MainContent() {
  return (
    <main>
      <section className="intro" id="about">
        <img className="intro__watermark" src="/assets/site/brand-mark.png" alt="" aria-hidden="true" />
        <div className="intro__copy">
          <h1>Packaging Decisions from the Market Backward</h1>
          <p className="intro__lead">
            <strong>TOGETHER, Packaging Consultants USA helps startups, growing brands, established companies, and larger organizations make better packaging decisions from the market backward—not by simply selecting a bag, pouch, carton, bottle, or container.</strong>
          </p>
          <p>
            We begin by defining your product, target customer, sales channel, competitive marketplace, storage and distribution conditions, and how the package will be opened, used, and stored. From there, we help define the necessary product protection, barrier performance, functionality, materials, and the appropriate flexible or rigid packaging structure.
          </p>
          <p>
            Once the structure is established, we help coordinate high-impact graphic design, production-ready artwork, pre-press, sourcing, and manufacturing through qualified U.S. or international production resources. Our objective is to help move your packaging from concept through production, supply, and launch.
          </p>
          <p className="intro__saying">As An Old Saying Goes,</p>
        </div>
      </section>

      <section className="quote-panel" aria-label="Packaging philosophy">
        <blockquote>
          “Packaging Makes That Important First Sale AND<br className="desktop-break" />
          Your Product Makes Those Important Next Sales!”
        </blockquote>
        <blockquote>
          “Think of Your Packaging As Your Key Sales Person on The Retail Shelf<br className="desktop-break" />
          or E-Commerce Web Page!”
        </blockquote>
      </section>
    </main>
  )
}
