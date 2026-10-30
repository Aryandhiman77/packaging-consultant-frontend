import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor, Essentials, Paragraph, Heading, Bold, Italic, Underline,
  Strikethrough, Link, List, BlockQuote, Table, TableToolbar, Image,
  ImageUpload, ImageToolbar, ImageCaption, ImageResize, ImageStyle,
  Autoformat, Undo, SourceEditing, FontColor, FontBackgroundColor,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './ContentAdmin.css';
import { attachCmsImageUpload } from './cmsUploadAdapter.js';
import { useApi } from '../context/ApiContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const GROUPS = [
  ['packaging-services', 'Packaging Services'],
  ['industries', 'Industries'],
  ['projects', 'Projects'],
  ['about-us', 'About Us'],
];
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Attach the upload adapter after editor initialization, not via extraPlugins.

class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('Content CKEditor failed:', error); }
  render() {
    if (this.state.error) {
      return <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
        CKEditor could not open: {this.state.error.message}. Reload this page and check the browser console. No content has been changed.
      </div>;
    }
    return this.props.children;
  }
}

function PageBodyEditor({ page, token, onSave, onClose, busy, serverError }) {
  const editorRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [editorError, setEditorError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [source, setSource] = useState(page.html || '');
  const [newTitle, setNewTitle] = useState(page.title || '');
  const [pageHeading, setPageHeading] = useState(page.heading || page.title || '');
  const initialHtml = useRef(page.html || '');
  const [retry, setRetry] = useState(0);
  const editorConfig = useMemo(() => ({
    licenseKey: import.meta.env.VITE_CKEDITOR_LICENSE_KEY || 'GPL',
    plugins: [
      Essentials, Paragraph, Heading, Bold, Italic, Underline,
      Strikethrough, Link, List, BlockQuote, Table, TableToolbar,
      Image, ImageUpload, ImageToolbar, ImageCaption, ImageResize,
      ImageStyle, Autoformat, Undo, SourceEditing, FontColor, FontBackgroundColor,
    ],
    toolbar: {
      items: [
        'undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline',
        'strikethrough', '|', 'fontColor', 'fontBackgroundColor', '|', 'link', 'bulletedList', 'numberedList',
        'blockQuote', '|', 'insertTable', 'uploadImage', '|', 'sourceEditing',
      ],
      shouldNotGroupWhenFull: false,
    },
    heading: { options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
    ] },
    image: { toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'resizeImage'] },
    table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
    link: { addTargetToExternalLinks: true },
    fontColor: { colors: [{color:'#18243b',label:'Navy'},{color:'#c82438',label:'Brand Red'},{color:'#168575',label:'Teal'},{color:'#2366bd',label:'Blue'},{color:'#000000',label:'Black'},{color:'#ffffff',label:'White',hasBorder:true},{color:'#e9c46a',label:'Gold'},{color:'#7c3aed',label:'Purple'}], colorPicker: {format:'hex'} },
    fontBackgroundColor: { colors: [{color:'#fff4b8',label:'Pale Yellow'},{color:'#daf5e7',label:'Mint'},{color:'#e8f0ff',label:'Pale Blue'},{color:'#ffe4ea',label:'Pale Pink'},{color:'#fff',label:'White',hasBorder:true},{color:'#f1f4f8',label:'Grey'}], colorPicker: {format:'hex'} },
  }), []);

  const close = () => {
    if (dirty && !window.confirm('You have unsaved changes. Close without saving?')) return;
    onClose();
  };
  const isNew = false;
  const [newKey, setNewKey] = useState(page.key);

  return <div className="cms-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cms-modal-title">
    <div className="cms-modal-window">
      <header className="cms-modal-top">
        <div>
          <div className="cms-modal-eyebrow">{isNew ? 'CREATE CONTENT PAGE' : 'PAGE BODY EDITOR'}</div>
          <h2 id="cms-modal-title" className="text-xl font-black sm:text-2xl">{isNew ? 'Add a Content Page' : 'Edit Full Page Content'}</h2>
          <p className="mt-2 text-sm text-slate-500">This edits the live page body, not navigation labels.</p>
        </div>
        <button type="button" aria-label="Close editor" className="cms-modal-close" onClick={close}>×</button>
      </header>
      <div className="cms-modal-body">
        {isNew ? <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold">Page group
            <select className="cms-admin-input" value={newKey.split('/')[0]} onChange={e => setNewKey(e.target.value + '/' + (newKey.split('/')[1] || 'new-page'))}>
              {GROUPS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold">Page URL slug
            <input className="cms-admin-input" value={newKey.split('/')[1] || ''} onChange={e => setNewKey(newKey.split('/')[0] + '/' + e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
          </label>
          <label className="text-sm font-bold sm:col-span-2">New page title
            <input className="cms-admin-input" value={newTitle} onChange={e => setNewTitle(e.target.value)} maxLength={200}/>
          </label>
        </div> : <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Page you are editing</div>
          <div className="mt-1 font-bold text-slate-900">{page.title}</div>
          <a className="mt-1 inline-block break-all text-sm text-blue-700 underline" href={`/${page.key}`} target="_blank" rel="noreferrer">/{page.key} (open live page)</a>
          <div className="mt-2 text-xs text-slate-500">The dropdown menu label is managed separately under Navigation Settings.</div>
        </div>}
        <label className="mt-5 block text-sm font-bold text-slate-900">On-page heading (not the dropdown link label)
          <input className="cms-admin-input" value={pageHeading} maxLength={200} onChange={e => { setPageHeading(e.target.value); setDirty(true); }} placeholder="Heading shown on public page"/>
        </label>
        <div className="mt-5 flex items-center justify-between gap-3">
          <label className="text-base font-black" htmlFor="cms-editor-region">Page Content (CKEditor)</label>
          {ready ? <span className="text-sm font-semibold text-green-700">Editor ready {dirty ? '• Unsaved changes' : ''}</span> : <span className="text-sm text-slate-500">Loading CKEditor...</span>}
        </div>
        <p className="mb-3 text-sm text-slate-500">Edit the actual paragraphs, headings, lists and images. Use the Source button for HTML when needed.</p>
        <div id="cms-editor-region" className="cms-editor cms-editor-visible" aria-label="Rich text page editor">
          <EditorErrorBoundary key={retry}>
            <CKEditor
              key={`${page.key}:${retry}`}
              editor={ClassicEditor}
              config={editorConfig}
              data={initialHtml.current}
              onReady={(editor) => {
                try {
                  // CKEditor plugin collection has already initialized at this point.
                  attachCmsImageUpload(editor, { token, apiBase: API_BASE });
                  editorRef.current = editor;
                  setEditorError('');
                  setReady(true);
                } catch (err) {
                  console.error('CKEditor image adapter setup failed', err);
                  editorRef.current = null;
                  setReady(false);
                  setEditorError(err?.message || 'Could not configure the image uploader.');
                }
              }}
              onChange={(_evt, editor) => {
                const html = editor.getData();
                setSource(html);
                setDirty(html !== initialHtml.current || pageHeading !== (page.heading || page.title || ''));
              }}
              onError={(err) => {
                console.error('CKEditor initialization error', err);
                setReady(false);
                setEditorError(err?.message || 'Unable to start the rich text editor.');
              }}
            />
          </EditorErrorBoundary>
        </div>
        {editorError && <div role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {editorError} <button className="ml-3 font-bold underline" onClick={() => { setEditorError(''); setRetry(x => x + 1); }} type="button">Retry editor</button>
        </div>}
        {serverError && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
      </div>
      <footer className="cms-modal-bottom">
        <span className="mr-auto hidden text-xs text-slate-500 sm:block">Saves to MongoDB and updates the public page content.</span>
        <button type="button" className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold" onClick={close}>Cancel</button>
        <button type="button" disabled={busy || !ready} className="rounded-lg bg-red-600 px-6 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={() => submitWithKey()}>{busy ? 'Saving...' : 'Save Page Content'}</button>
      </footer>
    </div>
  </div>;

  function submitWithKey() {
    const html = editorRef.current?.getData() ?? source;
    if (!ready) return;
    onSave({ ...page, title: isNew ? newTitle : page.title, heading: pageHeading, key: isNew ? newKey : page.key, html });
  }
}

export default function ContentAdmin() {
  const { request } = useApi();
  const { token } = useAdminAuth();
  const [pages, setPages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await request('/api/admin/content-pages', { cache: 'no-store' });
    setPages(res.data || []);
  }, [request]);
  useEffect(() => {
    let live = true;
    setLoading(true);
    refresh().catch(err => { if (live) setError(err.message); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [refresh]);

  async function openEditor(key) {
    setError(''); setSaveNotice('');
    try {
      const [group, slug] = key.split('/');
      const res = await request(`/api/admin/content/${group}/${slug}`, { cache: 'no-store' });
      if (!res.data || typeof res.data.html !== 'string') throw new Error('Page HTML was not returned by the backend.');
      setPage({ ...res.data });
    } catch (err) { setError(err.message); }
  }
  async function savePage(edited) {
    setError(''); setBusy(true);
    try {
      const [group, slug] = edited.key.split('/');
      if (!GROUPS.some(([name]) => name === group) || !/^[a-z0-9-]{1,90}$/.test(slug)) throw new Error('Invalid group or page URL.');
      if (!edited.title?.trim()) throw new Error('Page title is required.');
      if (!edited.html || (!edited.html.replace(/<[^>]*>/g, '').trim() && !edited.html.includes('<img'))) throw new Error('Page content cannot be empty.');
      const res = await request(`/api/admin/content/${group}/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ title: edited.title, heading: edited.heading || '', html: edited.html }),
      });
      if (!res.data || typeof res.data.html !== 'string') throw new Error('Could not confirm saved content from backend.');
      const reloaded = await request(`/api/admin/content/${group}/${slug}`, {cache:'no-store'});
      if (!reloaded.data || reloaded.data.html !== res.data.html) throw new Error('Save response did not match the database re-read.');
      setPage(null);
      setSaveNotice(`Saved page content: /${edited.key}. Open the public page to see the update.`);
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  const shown = pages.filter(p => (filter === 'all' || p.key.startsWith(`${filter}/`)) && !p.key.startsWith('resources/') && (`${p.title} ${p.key}`).toLowerCase().includes(search.trim().toLowerCase()));
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black">Content CMS</h1>
        <p className="mt-1 text-sm text-slate-500">Select a website page to edit its full content with CKEditor: headings, paragraphs, lists, links, images and tables. Menu links and order stay in Navigation &amp; Dropdowns.</p>
      </div>
    </div>
    <label className="block max-w-xl">
      <span className="mb-1.5 block text-sm font-bold">Search page title or URL</span>
      <input type="search" aria-label="Search CMS pages by title or URL" placeholder="Search e.g. packaging-development or industries/..." className="cms-admin-input" value={search} onChange={e => setSearch(e.target.value)}/>
    </label>
    <div className="flex flex-wrap gap-2">
      <button className={`rounded-lg border px-3 py-2 ${filter === 'all' ? 'bg-red-600 text-white' : ''}`} onClick={() => setFilter('all')}>All ({pages.filter(p=>!p.key.startsWith('resources/')).length})</button>
      {GROUPS.map(([key, label]) => <button key={key} onClick={() => setFilter(key)} className={`rounded-lg border px-3 py-2 ${filter === key ? 'bg-red-600 text-white' : ''}`}>{label}</button>)}
    </div>
    {saveNotice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 font-semibold text-green-800">{saveNotice}</p>}
    {!page && error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</p>}
    {loading ? <p>Loading CMS pages...</p> : <div className="grid gap-3 sm:grid-cols-2">
      {shown.map(item => <div className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-[#101722]" key={item.key}>
        <p className="break-all text-xs text-slate-500">/{item.key}</p>
        <h2 className="mt-1 text-lg font-bold">{item.title}</h2>
        <p className="mt-2 text-xs text-slate-500">Edit all paragraphs, headings, lists and images on this page.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white" onClick={() => openEditor(item.key)}>Edit Full Page Content</button>
          <a href={`/${item.key}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 underline">View Page</a>
        </div>
      </div>)}
    </div>}
    {page && <PageBodyEditor key={page.key} page={page} token={token} onSave={savePage} onClose={() => { setPage(null); setError(''); }} serverError={error} busy={busy} />}
  </section>;
}
