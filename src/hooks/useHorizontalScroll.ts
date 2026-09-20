import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook to enable smooth horizontal scrolling via:
 * 1. Mouse wheel (vertical wheel -> horizontal scroll)
 * 2. Mouse drag-to-scroll (grab & swipe like mobile touch)
 * 3. Left / Right navigation buttons with scroll-boundary detection
 */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
  const scrollRef = useRef<T | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const scrollToLeft = useCallback((offset = 180) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -offset, behavior: 'smooth' });
    }
  }, []);

  const scrollToRight = useCallback((offset = 180) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    // 1. Mouse wheel translation to horizontal scroll
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkScroll();
      }
    };

    // 2. Mouse drag-to-scroll (touch-like dragging on desktop)
    const onMouseDown = (e: MouseEvent) => {
      // Left click only
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.pageX - el.offsetLeft;
      scrollLeftRef.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startXRef.current;
      if (Math.abs(walk) > 4) {
        hasMovedRef.current = true;
      }
      el.scrollLeft = scrollLeftRef.current - walk;
      checkScroll();
    };

    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      el.style.cursor = '';
      el.style.removeProperty('user-select');

      // If user dragged, intercept one click event so child links/buttons aren't triggered
      if (hasMovedRef.current) {
        const preventClick = (clickEvent: MouseEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
          el.removeEventListener('click', preventClick, true);
        };
        el.addEventListener('click', preventClick, true);
        setTimeout(() => {
          el.removeEventListener('click', preventClick, true);
        }, 60);
      }
    };

    const onMouseLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        el.style.cursor = '';
        el.style.removeProperty('user-select');
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('scroll', checkScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('scroll', checkScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [checkScroll]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollToLeft,
    scrollToRight,
    checkScroll,
  };
}
