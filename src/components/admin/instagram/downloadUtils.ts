// src/components/admin/instagram/downloadUtils.ts
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

export interface DownloadSlideTarget {
  id: string;
  index: number;
  templateType: string;
  element: HTMLElement;
}

/** 단일 슬라이드 DOM 노드를 고해상도(pixelRatio: 2) PNG로 다운로드 */
export async function downloadSlideAsPng(
  element: HTMLElement,
  fileName: string = 'sinsangpick_card.png'
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      skipFonts: false,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export slide as PNG:', error);
    throw error;
  }
}

/** 모든 슬라이드를 PNG로 변환하여 하나의 ZIP 파일로 묶어 다운로드 */
export async function downloadAllSlidesAsZip(
  targets: DownloadSlideTarget[],
  zipFileName: string = 'sinsangpick_cards.zip',
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  try {
    const zip = new JSZip();

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (onProgress) onProgress(i + 1, targets.length);

      const dataUrl = await toPng(target.element, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
      });

      // dataUrl -> base64 string
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const paddedIndex = String(i + 1).padStart(2, '0');
      const filename = `${paddedIndex}_${target.templateType}.png`;

      zip.file(filename, base64Data, { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = zipFileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export slides as ZIP:', error);
    throw error;
  }
}
