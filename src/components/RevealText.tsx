import { type CSSProperties } from 'react';

interface RevealTextProps {
  text: string;
  /** Extra className on the outer wrapper span */
  className?: string;
  /** Base animation delay in ms before the first word */
  delay?: number;
  /** ms between each word */
  stagger?: number;
  /** Tailwind / inline style for each word */
  wordClassName?: string;
}

/**
 * Splits text into words and reveals each through a clip-path mask,
 * creating a printing-press effect ideal for headings and quote text.
 *
 * Each word is wrapped in:
 *   <span.word-reveal-mask>   ← overflow:hidden clip container
 *     <span.word-reveal-inner> ← animates via word-unmask keyframe
 */
export const RevealText = ({
  text,
  className = '',
  delay = 0,
  stagger = 55,
  wordClassName = '',
}: RevealTextProps) => {
  const words = text.split(' ');

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-reveal-mask" aria-hidden>
          <span
            className={`word-reveal-inner ${wordClassName}`}
            style={{ '--delay': `${delay + i * stagger}ms`, animationDelay: `${delay + i * stagger}ms` } as CSSProperties}
          >
            {word}
          </span>
          {/* Space between words — outside the mask so it doesn't clip */}
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
};
