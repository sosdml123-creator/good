/**
 * Global helper for Web/Desktop environments:
 * Converts mouse wheel vertical scroll into horizontal scroll for elements
 * that have horizontal overflow (like categories, pill filters, product rows).
 */
export function initWebHorizontalScroll() {
  if (typeof window === 'undefined') return;

  const handleGlobalWheel = (e: WheelEvent) => {
    // If Shift key is pressed, let native browser horizontal scrolling handle it
    if (e.shiftKey) return;
    
    // Only convert if vertical wheel is dominant
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    let target = e.target as HTMLElement | null;

    while (target && target !== document.body && target !== document.documentElement) {
      // Find scrollable container
      const style = window.getComputedStyle(target);
      const isOverflowX = style.overflowX === 'auto' || style.overflowX === 'scroll';
      const hasHorizontalOverflow = target.scrollWidth > target.clientWidth + 2;

      // If this element has horizontal scrollable content
      if (isOverflowX && hasHorizontalOverflow) {
        // Check if element can scroll further in the wheel direction
        const canScrollRight = target.scrollLeft < target.scrollWidth - target.clientWidth - 1;
        const canScrollLeft = target.scrollLeft > 1;

        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
          e.preventDefault();
          target.scrollLeft += e.deltaY;
          return;
        }
      }

      target = target.parentElement;
    }
  };

  window.addEventListener('wheel', handleGlobalWheel, { passive: false });
}
