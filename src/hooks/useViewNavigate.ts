import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

const supportsViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document;

/**
 * Wraps React Router's navigate with the View Transition API.
 * Falls back to plain navigate in unsupported browsers.
 */
export function useViewNavigate() {
  const navigate = useNavigate();

  return (to: string, options?: Parameters<typeof navigate>[1]) => {
    if (supportsViewTransition) {
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          flushSync(() => navigate(to, options));
        });
    } else {
      navigate(to, options);
    }
  };
}
