import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Update the state with current value
    setMatches(media.matches);
    
    // Create event listener function
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add listener for changes
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }
    
    // Clean up
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
