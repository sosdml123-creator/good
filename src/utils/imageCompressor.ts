/**
 * Image compression and resizing utility for user review and community uploads.
 * Downscales large images and compresses to WebP / JPEG format to minimize payload size and data usage.
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

/**
 * Resizes and compresses an image File or Blob using HTML5 Canvas.
 * Default max dimensions: 1024x1024, quality: 0.8
 * Reduces a typical 5~10MB phone photo to ~80~150KB while retaining high fidelity.
 */
export async function compressAndResizeImage(
  file: File | Blob,
  options: ResizeOptions = {}
): Promise<string> {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image, try to read as dataURL or reject
    if (file.type && !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to FileReader if canvas context is unavailable
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      // Smooth scaling settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and resize image
      ctx.drawImage(img, 0, 0, width, height);

      try {
        // First try requested mimeType
        let dataUrl = canvas.toDataURL(mimeType, quality);
        
        // If webp is not supported by browser, toDataURL falls back to image/png which might be large.
        // If png resulted and we asked for webp or jpeg, force jpeg:
        if (dataUrl.startsWith('data:image/png')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(dataUrl);
      } catch (err) {
        // Fallback to jpeg
        try {
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(fallbackDataUrl);
        } catch {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        }
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
