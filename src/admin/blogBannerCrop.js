export const BANNER_WIDTH = 1200;
export const BANNER_HEIGHT = 630;
export const BANNER_MAX_BYTES = 10 * 1024 * 1024;

export const ALLOWED_BANNER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validateBannerSource(file) {
  if (!file || !ALLOWED_BANNER_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG or WEBP image.");
  }

  if (file.size > BANNER_MAX_BYTES) {
    throw new Error("The image must be 10 MB or less.");
  }
}

export function calculateBannerCrop({
  imageWidth,
  imageHeight,
  viewWidth,
  viewHeight,
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
}) {
  const values = [
    imageWidth, imageHeight, viewWidth,
    viewHeight, zoom, offsetX, offsetY,
  ];

  if (
    !values.every(Number.isFinite) ||
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    viewWidth <= 0 ||
    viewHeight <= 0 ||
    zoom < 1
  ) {
    throw new Error("Invalid crop dimensions.");
  }

  const scale =
    Math.max(
      viewWidth / imageWidth,
      viewHeight / imageHeight
    ) * zoom;

  const renderedWidth = imageWidth * scale;
  const renderedHeight = imageHeight * scale;

  const maxX = Math.max(
    0,
    (renderedWidth - viewWidth) / 2
  );

  const maxY = Math.max(
    0,
    (renderedHeight - viewHeight) / 2
  );

  const x = Math.max(-maxX, Math.min(maxX, offsetX));
  const y = Math.max(-maxY, Math.min(maxY, offsetY));

  return {
    scale,
    renderedWidth,
    renderedHeight,
    maxX,
    maxY,
    offsetX: x,
    offsetY: y,
    sourceX:
      (renderedWidth - viewWidth) / (2 * scale) -
      x / scale,
    sourceY:
      (renderedHeight - viewHeight) / (2 * scale) -
      y / scale,
    sourceWidth: viewWidth / scale,
    sourceHeight: viewHeight / scale,
  };
}