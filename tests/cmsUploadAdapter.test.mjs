import test from 'node:test';
import assert from 'node:assert/strict';
import { attachCmsImageUpload } from '../src/admin/cmsUploadAdapter.js';

function stubEditor() {
  const repository = {};
  const editor = { plugins: { get: (name) => name === 'FileRepository' ? repository : undefined } };
  return { editor, repository };
}

function mockFetch(testFn) {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = testFn;
  return () => { globalThis.fetch = oldFetch; };
}

test('upload adapter attaches only after editor exists', () => {
  const { editor, repository } = stubEditor();
  assert.equal(attachCmsImageUpload(editor, { token: 'some-jwt' }), repository);
  assert.equal(typeof repository.createUploadAdapter, 'function');
  assert.throws(() => attachCmsImageUpload(null), /not ready/);
});

test('upload sends one image with bearer JWT and returns a full URL', async () => {
  const { editor, repository } = stubEditor();
  attachCmsImageUpload(editor, { token: 'jwt-token', apiBase: 'https://api.example.com' });
  const restore = mockFetch(async (url, opts) => {
    assert.equal(url, 'https://api.example.com/api/admin/media');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers.Authorization, 'Bearer jwt-token');
    const entries = [...opts.body.entries()];
    assert.equal(entries.length, 1);
    assert.equal(entries[0][0], 'upload');
    assert.equal(entries[0][1].type, 'image/png');
    return { ok: true, json: async () => ({ url: '/api/media/image.png' }) };
  });
  try {
    const file = new File([Uint8Array.from([137,80,78,71])], 'image.png', { type: 'image/png' });
    const adapter = repository.createUploadAdapter({ file: Promise.resolve(file) });
    assert.deepEqual(await adapter.upload(), { default: 'https://api.example.com/api/media/image.png' });
    adapter.abort();
  } finally { restore(); }
});

test('upload rejects oversized files before any fetch', async () => {
  const { editor, repository } = stubEditor();
  attachCmsImageUpload(editor, { token: 'jwt' });
  const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' });
  const adapter = repository.createUploadAdapter({ file: Promise.resolve(file) });
  await assert.rejects(adapter.upload(), /10 MB/);
});

test('upload rejects unsupported MIME', async () => {
  const { editor, repository } = stubEditor();
  attachCmsImageUpload(editor, { token: 'jwt' });
  const file = new File(['script'], 'bad.svg', { type: 'image/svg+xml' });
  const adapter = repository.createUploadAdapter({ file: Promise.resolve(file) });
  await assert.rejects(adapter.upload(), /JPG, PNG, GIF or WEBP/);
});

test('server rejection surfaces error in editor', async () => {
  const { editor, repository } = stubEditor();
  attachCmsImageUpload(editor, { token: 'jwt', apiBase:'https://api.example.com' });
  const restore = mockFetch(async () => ({ ok: false, json: async () => ({ message:'Upload denied' }) }));
  try {
    const file = new File(['abc'], 'a.jpg', { type:'image/jpeg' });
    await assert.rejects(repository.createUploadAdapter({ file:Promise.resolve(file) }).upload(), /Upload denied/);
  } finally { restore(); }
});
