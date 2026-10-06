const COMPRESSIBLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type CompressOptions = {
  /** Longest edge of the output image, in pixels. */
  maxDimension?: number;
  /** JPEG quality between 0 and 1. */
  quality?: number;
};

/**
 * Downscales and re-encodes an image as JPEG in the browser so uploads fit
 * the hosting request size limit. Returns the original file when it isn't an
 * image, can't be decoded, or the result wouldn't be smaller.
 */
export async function compressImage(
  file: File,
  { maxDimension = 2000, quality = 0.82 }: CompressOptions = {},
): Promise<File> {
  if (!COMPRESSIBLE_TYPES.has(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }

  // JPEG has no transparency; paint white behind transparent PNG/WebP areas.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "document";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}
