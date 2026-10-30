import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  Image,
  ImageUpload,
  ImageToolbar,
  ImageCaption,
  ImageResize,
  ImageStyle,
  Autoformat,
  Undo,
  SourceEditing,
  FontColor,
  FontBackgroundColor,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./ContentAdmin.css";

import { attachCmsImageUpload } from "./cmsUploadAdapter.js";
import BlogBannerCropper from "./BlogBannerCropper.jsx";

import {
  BANNER_WIDTH,
  BANNER_HEIGHT,
  validateBannerSource,
} from "./blogBannerCrop.js";

import { useApi } from "../context/ApiContext";
import { useAdminAuth } from "../context/AdminAuthContext";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const blank = () => ({
  title: "",
  slug: "",
  excerpt: "",
  bannerImage: "",
  bannerAlt: "",
  html: "<p>Write your article here.</p>",
  metaTitle: "",
  metaDescription: "",
  status: "draft",
});

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const imageUrl = (value) =>
  value ? new URL(value, API_BASE || window.location.origin).href : "";

const editorConfig = {
  licenseKey: import.meta.env.VITE_CKEDITOR_LICENSE_KEY || "GPL",

  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    Image,
    ImageUpload,
    ImageToolbar,
    ImageCaption,
    ImageResize,
    ImageStyle,
    Autoformat,
    Undo,
    SourceEditing,
    FontColor,
    FontBackgroundColor,
  ],

  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
      "insertTable",
      "uploadImage",
      "|",
      "sourceEditing",
    ],
    shouldNotGroupWhenFull: true,
  },

  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
    ],
  },

  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "imageStyle:inline",
      "imageStyle:block",
      "resizeImage",
    ],
  },

  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },

  link: {
    addTargetToExternalLinks: true,
  },

  fontColor: {
    colors: [
      { color: "#18243b", label: "Navy" },
      { color: "#c82438", label: "Brand Red" },
      { color: "#168575", label: "Teal" },
      { color: "#2366bd", label: "Blue" },
      { color: "#000000", label: "Black" },
      {
        color: "#ffffff",
        label: "White",
        hasBorder: true,
      },
      { color: "#e9c46a", label: "Gold" },
      { color: "#7c3aed", label: "Purple" },
    ],
    colorPicker: { format: "hex" },
  },

  fontBackgroundColor: {
    colors: [
      { color: "#fff4b8", label: "Pale Yellow" },
      { color: "#daf5e7", label: "Mint" },
      { color: "#e8f0ff", label: "Pale Blue" },
      { color: "#ffe4ea", label: "Pale Pink" },
      {
        color: "#ffffff",
        label: "White",
        hasBorder: true,
      },
      { color: "#f1f4f8", label: "Grey" },
    ],
    colorPicker: { format: "hex" },
  },
};

function BlogModal({ post, onClose, onSubmit, busy, error, token }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(post);
  const [ready, setReady] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [changed, setChanged] = useState(false);

  const [cropFile, setCropFile] = useState(null);
  const [bannerBlob, setBannerBlob] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerError, setBannerError] = useState("");

  useEffect(() => {
    if (!bannerBlob) {
      setBannerPreview("");
      return;
    }

    const url = URL.createObjectURL(bannerBlob);
    setBannerPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [bannerBlob]);

  const bannerUrl = bannerPreview || imageUrl(form.bannerImage);

  const field = "pc-field w-full rounded-xl border px-3 py-2.5";

  function setValue(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setChanged(true);
  }

  function updateTitle(value) {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug: post._id ? previous.slug : slugify(value),
      metaTitle:
        !previous.metaTitle || previous.metaTitle === previous.title
          ? value
          : previous.metaTitle,
    }));

    setChanged(true);
  }

  function chooseBanner(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      validateBannerSource(file);
      setBannerError("");
      setCropFile(file);
    } catch (err) {
      setBannerError(err.message);
    }
  }

  function croppedBanner(blob) {
    setBannerBlob(blob);
    setValue("bannerImage", "");
    setCropFile(null);
    setBannerError("");
  }

  function removeBanner() {
    setBannerBlob(null);
    setValue("bannerImage", "");
    setBannerError("");
  }

  function close() {
    if (changed && !window.confirm("Discard unsaved blog changes?")) {
      return;
    }

    onClose();
  }

  function save() {
    const data = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      html: editorRef.current?.getData() || form.html,
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      status: form.status,
      bannerImage: form.bannerImage || "",
      bannerAlt: (form.bannerAlt || "").trim(),
    };

    onSubmit(data, bannerBlob);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      className="pc-modal-backdrop fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-6"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !cropFile) {
          close();
        }
      }}
    >
      <div className="pc-modal-surface flex max-h-[95vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl shadow-2xl">
        <header className="flex items-start justify-between gap-5 border-b p-5 sm:p-6">
          <div>
            <p className="pc-eyebrow">Blog publishing</p>

            <h2 id="blog-modal-title" className="text-xl font-black">
              {post._id ? "Edit Blog Post" : "New Blog Post"}
            </h2>
          </div>

          <button
            type="button"
            className="pc-action"
            onClick={close}
            aria-label="Close blog editor"
          >
            ×
          </button>
        </header>

        <div className="grid gap-4 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
              Blog Title
              <input
                className={field}
                maxLength={200}
                required
                value={form.title}
                onChange={(event) => updateTitle(event.target.value)}
              />
            </label>

            <label className="grid gap-1.5 text-sm font-semibold">
              URL Slug
              <input
                className={field}
                maxLength={150}
                required
                value={form.slug}
                onChange={(event) =>
                  setValue("slug", slugify(event.target.value))
                }
              />
              <small>
                Public URL: /blog/
                {form.slug || "new-post"}
              </small>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold">
              Status
              <select
                className={field}
                value={form.status}
                onChange={(event) => setValue("status", event.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">
              Short Excerpt
              <textarea
                className={field}
                rows={2}
                maxLength={600}
                value={form.excerpt}
                onChange={(event) => setValue("excerpt", event.target.value)}
                placeholder="Short introduction"
              />
            </label>
          </div>

          {/* BLOG BANNER */}
          <section
            className="pc-seo-fields rounded-xl border p-4"
            aria-label="Blog banner image"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">Blog Banner Image</h3>

                <p className="mt-1 text-sm font-semibold">
                  Required Image Size: {BANNER_WIDTH} × {BANNER_HEIGHT} px{" "}
                  (1.91:1)
                </p>

                <p className="mt-1 text-xs opacity-75">
                  JPG, PNG or WEBP. Maximum 10 MB. The cropper opens
                  automatically when you select an image.
                </p>
              </div>

              <button
                type="button"
                className="pc-action px-4"
                onClick={() => fileInputRef.current?.click()}
              >
                {bannerUrl ? "Change / Crop Banner" : "Add Banner Image"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Choose 1200 by 630 blog banner"
              onChange={chooseBanner}
            />

            {bannerUrl ? (
              <div className="mt-4">
                <div
                  className="max-w-2xl overflow-hidden rounded-xl border"
                  style={{
                    aspectRatio: "1200/630",
                  }}
                >
                  <img
                    src={bannerUrl}
                    alt={form.bannerAlt || "Selected blog banner"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="opacity-70">
                    {bannerBlob
                      ? "New cropped image, uploads on Save"
                      : "Currently saved banner"}
                  </span>

                  <button
                    type="button"
                    className="font-bold text-red-600 underline"
                    onClick={removeBanner}
                  >
                    Remove Banner
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed px-5 py-7 text-center text-sm opacity-75">
                No banner yet. Click Add Banner Image.
              </div>
            )}

            <label className="mt-4 grid gap-1.5 text-sm font-semibold">
              Banner Alt Text (SEO)
              <input
                className={field}
                maxLength={200}
                placeholder="Describe the banner image"
                value={form.bannerAlt || ""}
                onChange={(event) => setValue("bannerAlt", event.target.value)}
              />
            </label>

            {bannerError && (
              <p role="alert" className="pc-error mt-3 p-3">
                {bannerError}
              </p>
            )}
          </section>

          {/* CKEDITOR */}
          <div>
            <div className="mb-2 flex flex-wrap justify-between gap-2">
              <h3 className="text-sm font-bold">Blog Body (CKEditor)</h3>

              <span className="text-xs">
                {ready ? "Editor ready" : "Loading editor..."}
              </span>
            </div>

            <div className="cms-editor cms-editor-visible">
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                data={post.html || ""}
                onReady={(editor) => {
                  try {
                    attachCmsImageUpload(editor, {
                      token,
                      apiBase: API_BASE,
                    });

                    editorRef.current = editor;
                    setReady(true);
                  } catch (err) {
                    setEditorError(err.message);
                  }
                }}
                onError={(err) => {
                  setEditorError(err.message);
                  setReady(false);
                }}
                onChange={() => setChanged(true)}
              />
            </div>

            {editorError && (
              <p role="alert" className="pc-error p-3">
                {editorError}
              </p>
            )}
          </div>

          {/* SEO */}
          <section className="pc-seo-fields grid gap-4 rounded-xl border p-4">
            <div>
              <h3 className="font-bold">SEO Settings</h3>

              <p className="text-xs opacity-70">
                Used for blog SEO and social previews.
              </p>
            </div>

            <label className="grid gap-1 text-sm font-semibold">
              Meta Title ({form.metaTitle.length}/180)
              <input
                className={field}
                maxLength={180}
                value={form.metaTitle}
                onChange={(event) => setValue("metaTitle", event.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm font-semibold">
              Meta Description ({form.metaDescription.length}/320)
              <textarea
                rows={3}
                maxLength={320}
                className={field}
                value={form.metaDescription}
                onChange={(event) =>
                  setValue("metaDescription", event.target.value)
                }
              />
            </label>
          </section>

          {error && (
            <p role="alert" className="pc-error p-3">
              {error}
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t p-5">
          <button type="button" className="pc-action px-4" onClick={close}>
            Cancel
          </button>

          <button
            type="button"
            className="pc-primary px-6 py-2.5"
            disabled={!ready || busy}
            onClick={save}
          >
            {busy
              ? "Saving..."
              : post._id
                ? "Save Blog Changes"
                : "Create Blog Post"}
          </button>
        </footer>
      </div>

      {cropFile && (
        <BlogBannerCropper
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onCropped={croppedBanner}
        />
      )}
    </div>
  );
}

export default function BlogAdmin() {
  const { request } = useApi();
  const { token } = useAdminAuth();

  const bannerUploadCache = useRef(new WeakMap());

  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(
    () =>
      request("/api/admin/blogs", {
        cache: "no-store",
      }).then((result) => setPosts(result.data || [])),
    [request],
  );

  useEffect(() => {
    refresh()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  const filtered = useMemo(
    () =>
      posts.filter((post) =>
        `${post.title} ${post.slug}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [posts, search],
  );

  async function edit(id) {
    setError("");
    setNotice("");

    try {
      const result = await request(`/api/admin/blogs/${id}`, {
        cache: "no-store",
      });

      setModal(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function save(data, bannerBlob) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (
        !data.title ||
        !data.slug ||
        !data.metaTitle ||
        !data.metaDescription ||
        !data.html
      ) {
        throw new Error("Title, slug, content and SEO fields are required.");
      }

      if (data.status === "published" && !data.bannerImage && !bannerBlob) {
        throw new Error("Please crop a banner before publishing.");
      }

      if (bannerBlob) {
        if (bannerBlob.size > 10 * 1024 * 1024) {
          throw new Error("Cropped image exceeds 10 MB.");
        }

        let url = bannerUploadCache.current.get(bannerBlob);

        if (!url) {
          const image = new FormData();

          image.append("upload", bannerBlob, "blog-banner-1200x630.jpg");

          const uploaded = await request("/api/admin/media/blog-banner", {
            method: "POST",
            body: image,
          });

          if (
            !uploaded.url ||
            uploaded.width !== 1200 ||
            uploaded.height !== 630
          ) {
            throw new Error("Backend could not confirm banner size.");
          }

          url = uploaded.url;

          bannerUploadCache.current.set(bannerBlob, url);
        }

        data.bannerImage = url;
      }

      const path = modal._id
        ? `/api/admin/blogs/${modal._id}`
        : "/api/admin/blogs";

      const result = await request(path, {
        method: modal._id ? "PATCH" : "POST",
        body: JSON.stringify(data),
      });

      if (!result.data?._id) {
        throw new Error("Could not confirm saved blog post.");
      }

      setModal(null);
      setNotice("Blog post saved successfully.");

      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(post) {
    if (!window.confirm(`Permanently delete "${post.title}"?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await request(`/api/admin/blogs/${post._id}`, { method: "DELETE" });

      setNotice("Blog post deleted.");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="pc-eyebrow">Content publishing</p>

          <h1 className="text-2xl font-black">Blog Posts</h1>

          <p className="mt-1 text-sm text-slate-500">
            Create drafts, edit blogs and publish posts.
          </p>
        </div>

        <button
          type="button"
          className="pc-primary px-5 py-3"
          onClick={() => {
            setError("");
            setModal(blank());
          }}
        >
          + New Blog Post
        </button>
      </div>

      <label className="block max-w-lg">
        <span className="mb-2 block text-sm font-semibold">Search Blogs</span>

        <input
          className="pc-field w-full rounded-lg border px-3 py-3"
          type="search"
          placeholder="Search title or URL"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {notice && (
        <p role="status" className="pc-success p-3">
          {notice}
        </p>
      )}

      {error && !modal && (
        <p role="alert" className="pc-error p-3">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((post) => (
            <article key={post._id} className="pc-card rounded-xl border p-5">
              {post.bannerImage && (
                <img
                  src={imageUrl(post.bannerImage)}
                  alt={post.bannerAlt || post.title}
                  className="mb-4 w-full rounded-lg object-cover"
                  style={{
                    aspectRatio: "1200/630",
                  }}
                  loading="lazy"
                />
              )}

              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold">{post.title}</h2>

                <span
                  className={`pc-status ${
                    post.status === "published" ? "published" : ""
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <p className="mt-2 break-all text-sm text-slate-500">
                /blog/{post.slug}
              </p>

              <p className="mt-2 text-sm">{post.excerpt}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="pc-primary px-4 py-2 text-sm"
                  onClick={() => edit(post._id)}
                >
                  Edit Blog
                </button>

                {post.status === "published" && (
                  <a
                    className="text-sm font-semibold underline"
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                )}

                <button
                  type="button"
                  className="text-sm font-semibold text-red-600 underline"
                  onClick={() => remove(post)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {!filtered.length && (
            <p className="pc-card rounded-xl border p-5">
              No blog posts found.
            </p>
          )}
        </div>
      )}

      {modal && (
        <BlogModal
          key={modal._id || "new"}
          post={modal}
          token={token}
          onClose={() => {
            setModal(null);
            setError("");
          }}
          onSubmit={save}
          busy={busy}
          error={error}
        />
      )}
    </section>
  );
}
