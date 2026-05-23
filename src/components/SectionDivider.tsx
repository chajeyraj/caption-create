type DividerColor = 'amber' | 'violet' | 'both';

const GRADIENTS: Record<DividerColor, string> = {
  amber:
    'linear-gradient(90deg, transparent 0%, hsl(38 90% 54% / 0.4) 50%, transparent 100%)',
  violet:
    'linear-gradient(90deg, transparent 0%, hsl(271 60% 65% / 0.35) 50%, transparent 100%)',
  both:
    'linear-gradient(90deg, transparent 0%, hsl(38 90% 54% / 0.4) 35%, hsl(271 60% 65% / 0.35) 65%, transparent 100%)',
};

interface SectionDividerProps {
  color?: DividerColor;
  /** Width of the gradient line as a Tailwind class e.g. "w-2/3" or "w-full" */
  width?: string;
  /** Additional wrapper className */
  className?: string;
}

/**
 * Animated gradient line used between sections.
 * The background position drifts back and forth via gradient-drift keyframe.
 */
export const SectionDivider = ({
  color = 'amber',
  width = 'w-2/3',
  className = '',
}: SectionDividerProps) => (
  <div className={`w-full flex justify-center ${className}`} aria-hidden>
    <div
      className={`${width} section-divider`}
      style={{
        background: GRADIENTS[color],
        backgroundSize: '200% 100%',
      }}
    />
  </div>
);
