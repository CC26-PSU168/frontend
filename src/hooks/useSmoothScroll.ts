import { useEffect } from 'react';

/**
 * Hook to handle smooth scroll to a section
 * This prevents hydration errors by using useEffect
 */
export function useSmoothScroll(sectionId: string | null | undefined) {
  useEffect(() => {
    if (!sectionId) return;

    // Delay slightly to ensure DOM is fully ready
    const timer = setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Optional: Add visual highlight pulse
        element.classList.add('animate-pulse');
        const highlightTimer = setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 2000);

        return () => clearTimeout(highlightTimer);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [sectionId]);
}
