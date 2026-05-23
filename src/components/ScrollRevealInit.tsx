import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SELECTOR = '.scroll-reveal, .parallax-section-header';

export const ScrollRevealInit = () => {
  const location = useLocation();

  useEffect(() => {
    // Chrome 115+ handles this natively via CSS — skip JS observer
    if (CSS.supports('animation-timeline: view()')) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    const observe = (el: Element) => {
      if (!el.classList.contains('is-visible')) io.observe(el);
    };

    // Observe elements already in DOM
    document.querySelectorAll(SELECTOR).forEach(observe);

    // Watch for elements added after async data loads
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as Element;
          if (el.matches(SELECTOR)) observe(el);
          el.querySelectorAll(SELECTOR).forEach(observe);
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [location.pathname]);

  return null;
};
