import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderHero from "./HeaderHero";
import Footer from "./Footer";
import ContentWatermark from "./ContentWatermark";
import { useApi } from "../context/ApiContext";
export default function CmsContentPage({ group, slug: fixedSlug }) {
  const { slug: paramSlug } = useParams();
  const slug = fixedSlug || paramSlug;
  const { request } = useApi();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    setPage(null);
    setError("");
    request(`/api/content/${group}/${slug}`, { cache: "no-store" })
      .then((r) => {
        if (live) setPage(r.data);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [request, group, slug]);
  return (
    <div className="page-shell">
      <HeaderHero compact />
      <main className="relative isolate mx-auto min-h-[620px] w-full max-w-[100vw] overflow-hidden border-x border-[#8d8985] bg-white text-[#201d1b]">
        <ContentWatermark />
        <article className="relative z-10 mx-auto w-full px-6 py-10 sm:px-12 sm:py-14 lg:px-[7%] lg:py-16">
          {page ? (
            <>
              <h1
                className={`${group === "packaging-services" || group === "resources" ? "text-[clamp(1rem,1.25vw,1.18rem)] font-black uppercase" : "sr-only"}`}
              >
                {page.heading || page.title}
              </h1>
              <div
                className="cms-rich-content mt-6"
                dangerouslySetInnerHTML={{ __html: page.html }}
              />
            </>
          ) : (
            <p role="status">
              {error ? (
                <>
                  {error}. <Link to="/contact-us">Contact us</Link> for
                  assistance.
                </>
              ) : (
                "Loading page..."
              )}
            </p>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
