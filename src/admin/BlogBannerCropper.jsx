import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  calculateBannerCrop,
} from "./blogBannerCrop.js";

import "./BlogBannerCropper.css";

export default function BlogBannerCropper({
  file,
  onCancel,
  onCropped,
}) {
  const imageRef = useRef(null);
  const viewRef = useRef(null);
  const pointer = useRef(null);

  const [source, setSource] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);

    setSource(url);
    setDimensions(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError("");

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useLayoutEffect(() => {
    if (!viewRef.current) return;

    const observer = new ResizeObserver((entries) => {
      setViewportWidth(entries[0].contentRect.width);
    });

    observer.observe(viewRef.current);

    return () => observer.disconnect();
  }, []);

  const viewHeight =
    (viewportWidth * BANNER_HEIGHT) / BANNER_WIDTH;

  const crop =
    dimensions && viewportWidth
      ? calculateBannerCrop({
          imageWidth: dimensions.width,
          imageHeight: dimensions.height,
          viewWidth: viewportWidth,
          viewHeight,
          zoom,
          offsetX: offset.x,
          offsetY: offset.y,
        })
      : null;

  function startPointer(event) {
    if (!crop) return;

    event.preventDefault();

    pointer.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: crop.offsetX,
      originY: crop.offsetY,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  function movePointer(event) {
    if (
      !crop ||
      !pointer.current ||
      pointer.current.id !== event.pointerId
    ) {
      return;
    }

    const dx =
      event.clientX - pointer.current.startX;

    const dy =
      event.clientY - pointer.current.startY;

    setOffset({
      x: Math.max(
        -crop.maxX,
        Math.min(
          crop.maxX,
          pointer.current.originX + dx
        )
      ),
      y: Math.max(
        -crop.maxY,
        Math.min(
          crop.maxY,
          pointer.current.originY + dy
        )
      ),
    });
  }

  function stopPointer(event) {
    if (pointer.current?.id !== event.pointerId) {
      return;
    }

    pointer.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  }

  async function acceptCrop() {
    if (!crop || !imageRef.current) return;

    setBusy(true);
    setError("");

    try {
      const canvas = document.createElement("canvas");

      canvas.width = BANNER_WIDTH;
      canvas.height = BANNER_HEIGHT;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Cropping is not supported in this browser."
        );
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(
        imageRef.current,
        crop.sourceX,
        crop.sourceY,
        crop.sourceWidth,
        crop.sourceHeight,
        0,
        0,
        BANNER_WIDTH,
        BANNER_HEIGHT
      );

      const blob = await new Promise(
        (resolve, reject) => {
          canvas.toBlob(
            (result) =>
              result
                ? resolve(result)
                : reject(
                    new Error("Could not export image.")
                  ),
            "image/jpeg",
            0.9
          );
        }
      );

      onCropped(blob);
    } catch (err) {
      setError(err.message || "Crop failed.");
      setBusy(false);
    }
  }

  return (
    <div
      className="blog-crop-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-crop-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <div className="blog-crop-panel">
        <header className="blog-crop-head">
          <div>
            <p className="blog-crop-eyebrow">
              Blog banner editor
            </p>

            <h3 id="blog-crop-title">
              Crop your banner image
            </h3>

            <p>
              Final size: <strong>1200 × 630 px</strong>.
              Drag to move and use zoom to adjust.
            </p>
          </div>

          <button
            className="blog-crop-close"
            type="button"
            onClick={onCancel}
            aria-label="Close cropper"
          >
            ×
          </button>
        </header>

        <div className="blog-crop-body">
          <div
            ref={viewRef}
            className="blog-crop-viewport"
            onPointerDown={startPointer}
            onPointerMove={movePointer}
            onPointerUp={stopPointer}
            onPointerCancel={stopPointer}
          >
            {source && (
              <img
                ref={imageRef}
                src={source}
                alt="Drag image to choose crop"
                draggable={false}
                onLoad={(event) => {
                  const img = event.currentTarget;

                  if (
                    !img.naturalWidth ||
                    !img.naturalHeight
                  ) {
                    setError("Image could not be opened.");
                    return;
                  }

                  setDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  });
                }}
                onError={() =>
                  setError("Unable to open this image.")
                }
                style={
                  crop
                    ? {
                        width: crop.renderedWidth,
                        height: crop.renderedHeight,
                        left: `calc(50% + ${crop.offsetX}px)`,
                        top: `calc(50% + ${crop.offsetY}px)`,
                      }
                    : { visibility: "hidden" }
                }
              />
            )}

            <div
              className="blog-crop-guides"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="blog-crop-tools">
            <label htmlFor="blog-banner-zoom">
              Zoom
            </label>

            <input
              id="blog-banner-zoom"
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(event) =>
                setZoom(Number(event.target.value))
              }
            />

            <span>{Math.round(zoom * 100)}%</span>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
            >
              Reset
            </button>
          </div>

          <p className="blog-crop-hint">
            Only the selected area will be saved.
            Final output is JPG, 1200 × 630 px.
          </p>

          {error && (
            <p role="alert" className="blog-crop-error">
              {error}
            </p>
          )}
        </div>

        <footer className="blog-crop-actions">
          <button
            className="pc-action"
            type="button"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="pc-primary"
            type="button"
            disabled={busy || !crop || !!error}
            onClick={acceptCrop}
          >
            {busy ? "Cropping..." : "Use Cropped Image"}
          </button>
        </footer>
      </div>
    </div>
  );
}