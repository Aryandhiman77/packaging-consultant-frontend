/**
 * Install the CMS image upload adapter on an ALREADY INITIALIZED CKEditor 5.
 * Do not register this adapter as a CKEditor plugin in `extraPlugins`: CKEditor
 * uses `new PluginConstructor(editor)` for that array.
 */
export function attachCmsImageUpload(editor, { token, apiBase = '' } = {}) {
  if (!editor || !editor.plugins || typeof editor.plugins.get !== 'function') {
    throw new Error('CKEditor is not ready yet.');
  }
  const repository = editor.plugins.get('FileRepository');
  if (!repository) throw new Error('Image upload support was not loaded.');

  repository.createUploadAdapter = (loader) => {
    const controller = new AbortController();
    return {
      async upload() {
        const file = await loader.file;
        if (!file) throw new Error('Choose an image to upload.');
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Image size must be 10 MB or less.');
        }
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
          throw new Error('Only JPG, PNG, GIF or WEBP images are supported.');
        }
        if (!token) throw new Error('Your admin session has expired. Please sign in again.');
        const form = new FormData();
        form.append('upload', file);
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/api/admin/media`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
          signal: controller.signal,
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body.url) {
          throw new Error(body.message || 'Image upload failed.');
        }
        // CKEditor needs an absolute image URL for editing on separate dev hosts.
        const origin = apiBase || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
        const imageUrl = new URL(body.url, origin).href;
        return { default: imageUrl };
      },
      abort() { controller.abort(); },
    };
  };
  return repository;
}
