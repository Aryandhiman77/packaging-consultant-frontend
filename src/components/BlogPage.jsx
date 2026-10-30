import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import HeaderHero from "./HeaderHero";
import Footer from "./Footer";
import { useApi } from "../context/ApiContext";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const imageUrl = (path) =>
  path ? new URL(path, API_BASE || window.location.origin).href : "";

function useSeo(post, listing) {
  useEffect(() => {
    const title =
      post?.metaTitle ||
      (listing
        ? "Blog | Packaging Consultants USA"
        : "Packaging Consultants USA");

    const description =
      post?.metaDescription ||
      (listing
        ? "Packaging design, manufacturing, supply and launch consulting insights."
        : "");

    const previousTitle = document.title;
    document.title = title;

    const metas = [
      ["name", "description", description],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:type", listing ? "website" : "article"],
      [
        "name",
        "twitter:card",
        post?.bannerImage ? "summary_large_image" : "summary",
      ],
    ];

    if (post?.bannerImage) {
      const image = imageUrl(post.bannerImage);

      metas.push(
        ["property", "og:image", image],
        ["name", "twitter:image", image],
        ["property", "og:image:width", "1200"],
        ["property", "og:image:height", "630"],
      );
    }

    const history = metas.map(([attribute, name, value]) => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);

      const created = !element;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      const previous = element.getAttribute("content");

      element.setAttribute("content", value);

      return { element, created, previous };
    });

    const canonicalUrl =
      window.location.origin +
      (listing ? "/blog" : `/blog/${post?.slug || ""}`);

    let canonical = document.head.querySelector('link[rel="canonical"]');

    const createdCanonical = !canonical;
    const oldHref = canonical?.getAttribute("href");

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    return () => {
      document.title = previousTitle;

      if (createdCanonical) {
        canonical.remove();
      } else if (oldHref !== null) {
        canonical.setAttribute("href", oldHref);
      } else {
        canonical.removeAttribute("href");
      }

      for (const item of history) {
        if (item.created) {
          item.element.remove();
        } else if (item.previous !== null) {
          item.element.setAttribute("content", item.previous);
        } else {
          item.element.removeAttribute("content");
        }
      }
    };
  }, [post, listing]);
}

export default function BlogPage() {
  const { slug } = useParams();
  const { request } = useApi();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useSeo(slug ? data?.data : null, !slug);

  useEffect(() => {
    let active = true;

    setData(null);
    setError("");

    const url = slug
      ? `/api/blog/${encodeURIComponent(slug)}`
      : `/api/blog?page=${page}`;

    request(url, { cache: "no-store" })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [request, slug, page]);

  const article = slug ? data?.data : null;
  const entries = slug ? [] : data?.data || [];

  return (
    <div className="page-shell">
      <HeaderHero compact />

      <main className="mx-auto min-h-[65vh] w-full max-w-[1200px] bg-white px-5 py-10 text-slate-900 sm:px-10 sm:py-14">
        <p className="text-sm font-semibold text-red-700">
          <Link to="/">Home</Link>
          {" / "}
          <Link to="/blog">Blog</Link>
        </p>

        {error ? (
          <p role="alert" className="mt-5">
            {error}
          </p>
        ) : !data ? (
          <p className="mt-5">Loading...</p>
        ) : slug ? (
          <article className="mx-auto max-w-[860px]">
            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
              {article.title}
            </h1>

            {article.bannerImage && (
              <img
                src={imageUrl(article.bannerImage)}
                alt={article.bannerAlt || article.title}
                className="mt-7 w-full rounded-xl border border-slate-200 object-cover"
                style={{ aspectRatio: "1200/630" }}
                fetchPriority="high"
              />
            )}

            {article.publishedAt && (
              <time
                className="mt-3 block text-sm text-slate-500"
                dateTime={article.publishedAt}
              >
                {new Date(article.publishedAt).toLocaleDateString()}
              </time>
            )}

            <div
              className="cms-rich-content mt-8"
              dangerouslySetInnerHTML={{
                __html: article.html,
              }}
            />
          </article>
        ) : (
          <>
            <h1 className="mt-5 text-3xl font-bold">
              Packaging Insights &amp; Blog
            </h1>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {entries.map((post) => (
                <article
                  key={post.slug}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  {post.bannerImage && (
                    <Link to={`/blog/${post.slug}`}>
                      <img
                        src={imageUrl(post.bannerImage)}
                        alt={post.bannerAlt || post.title}
                        className="block w-full object-cover"
                        style={{
                          aspectRatio: "1200/630",
                        }}
                        loading="lazy"
                      />
                    </Link>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-bold">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="mt-3 text-slate-600">{post.excerpt}</p>

                    <Link
                      className="mt-4 inline-block font-bold text-red-700 underline"
                      to={`/blog/${post.slug}`}
                    >
                      Read Article
                    </Link>
                  </div>
                </article>
              ))}

              {!entries.length && <p>No published articles yet.</p>}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </button>

              <span>Page {page}</span>

              <button
                disabled={page >= (data.pages || 1)}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
