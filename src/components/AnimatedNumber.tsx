import { useRef, useState, useEffect } from 'react';

/**
 * Single digit column — a vertical strip of 0-9 that slides to show the current digit.
 * Uses spring cubic-bezier for an elastic, slot-machine feel.
 */
const DigitColumn = ({ digit }: { digit: string }) => {
  const n = parseInt(digit, 10);

  if (isNaN(n)) {
    // Non-numeric character (comma, k, +, etc.) — render plain
    return <span className="tabular-nums">{digit}</span>;
  }

  return (
    <span
      className="inline-block overflow-hidden relative"
      style={{ height: '1.1em', verticalAlign: 'middle', minWidth: '0.6em' }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${-n * 1.1}em)`,
          transition: 'transform 0.48s cubic-bezier(0.34, 1.35, 0.64, 1)',
          willChange: 'transform',
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="block text-center tabular-nums"
            style={{ height: '1.1em', lineHeight: '1.1em' }}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
};

interface AnimatedNumberProps {
  value: number;
  /** Optional suffix rendered plain after the number e.g. "+" or "k" */
  suffix?: string;
  className?: string;
}

/**
 * Renders a number with slot-machine digit animation on value change.
 * Each digit column rolls independently with a spring easing.
 */
export const AnimatedNumber = ({ value, suffix = '', className = '' }: AnimatedNumberProps) => {
  const prevRef = useRef(value);
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value;
      setDisplayed(value);
    }
  }, [value]);

  const str = String(displayed);

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`}>
      {str.split('').map((ch, i) => (
        <DigitColumn key={i} digit={ch} />
      ))}
      {suffix && <span className="ml-px">{suffix}</span>}
    </span>
  );
};
