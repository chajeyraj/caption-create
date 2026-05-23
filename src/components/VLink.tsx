import { type MouseEvent, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const supportsViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document;

type VLinkProps = LinkProps & { children: ReactNode };

/**
 * Drop-in replacement for React Router's <Link> that wraps navigation
 * in the View Transition API (Chrome 111+). Degrades to plain Link elsewhere.
 */
export const VLink = ({ to, onClick, children, ...rest }: VLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !supportsViewTransition) return;
    // Only intercept plain left-click without modifiers
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(() => {
        flushSync(() => navigate(typeof to === 'string' ? to : String(to)));
      });
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};
