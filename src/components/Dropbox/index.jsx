import { useEffect, useRef, useState } from "react";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.ceil(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CustomDropBox({
  files = [],
  onFilesChange,
  onError,
  maxFiles = 30,
  maxSizeBytes = 20 * 1024 * 1024,
  allowedExtensions = [],
  accept,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});
  const remaining = Math.max(0, maxFiles - files.length);

  useEffect(() => {
    const urls = {};

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        urls[fileKey(file)] = URL.createObjectURL(file);
      }
    });

    setPreviewUrls(urls);
    return () => Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const addFiles = (incoming) => {
    const existingKeys = new Set(files.map(fileKey));
    const unique = Array.from(incoming).filter((file) => {
      const key = fileKey(file);
      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

    const rejected = [];
    const valid = [];

    unique.forEach((file) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;

      if (!allowedExtensions.includes(extension)) {
        rejected.push(`${file.name}: unsupported file type`);
      } else if (file.size > maxSizeBytes) {
        rejected.push(`${file.name}: larger than 20 MB`);
      } else {
        valid.push(file);
      }
    });

    const available = Math.max(0, maxFiles - files.length);
    const accepted = valid.slice(0, available);

    if (valid.length > available) {
      rejected.push(`Only ${maxFiles} files can be uploaded at one time.`);
    }

    if (accepted.length) onFilesChange?.([...files, ...accepted]);
    onError?.(rejected.length ? rejected.join(" ") : null);
  };

  const removeFile = (index) => {
    onFilesChange?.(files.filter((_, fileIndex) => fileIndex !== index));
    onError?.(null);
  };

  return (
    <div className="text-left">
      {remaining > 0 && (
        <div
          className={`grid min-h-56 place-items-center border-2 border-dashed px-5 py-8 text-center transition-colors sm:rounded-xl ${dragging ? "border-[#e51f32] bg-[#fff1f2]" : "border-[#cdbeb4] bg-white/75 hover:border-[#e51f32]/70 hover:bg-[#fffafa]"}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0f1] text-[#d91f31]">
              <UploadIcon />
            </span>
            <h3 className="mt-4 text-base font-black text-[#392b23]">Choose files or drag and drop</h3>
            <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#7b6558]">
              Photos, artwork, documents and videos · 20 MB per file · up to 30 files
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-lg bg-[#e51f32] px-5 py-2.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(229,31,50,.2)] transition hover:-translate-y-0.5 hover:bg-[#c91929]"
            >
              Select project files
            </button>
            <p className="mt-3 text-[11px] font-bold text-[#92796a]">
              {remaining} {remaining === 1 ? "file" : "files"} remaining
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files || []);
                event.target.value = "";
              }}
            />
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black tracking-wide text-[#6e5547] uppercase">
              Selected files ({files.length}/{maxFiles})
            </p>
            <button
              type="button"
              onClick={() => {
                onFilesChange?.([]);
                onError?.(null);
              }}
              className="text-xs font-black text-[#b32131] underline underline-offset-2"
            >
              Remove all
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {files.map((file, index) => {
              const extension = file.name.includes(".")
                ? file.name.split(".").pop().toUpperCase()
                : "FILE";
              const preview = previewUrls[fileKey(file)];

              return (
                <div key={fileKey(file)} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e0d5ce] bg-white p-2.5 shadow-sm">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f6eeea] text-[10px] font-black text-[#a32331]">
                    {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : extension}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-[#3d2c23]" title={file.name}>{file.name}</p>
                    <p className="mt-1 text-[11px] text-[#806b60]">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-bold text-[#b32131] transition hover:bg-[#fff0f1]"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
