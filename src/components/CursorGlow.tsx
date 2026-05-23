import { useEffect, useRef } from 'react';

/**
 * Global ambient amber glow that drifts behind the cursor.
 * Lagged spring gives a dreamy, organic feel.
 * Renders a single fixed overlay — mount once in the app root.
 */
export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -400, y: -400 });
  const target = useRef({ x: -400, y: -400 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.08);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.08);

      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-[9990] pointer-events-none will-change-transform"
      style={{ width: 400, height: 400, borderRadius: '50%' }}
      ref={glowRef}
    >
      {/* Primary amber glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(38 90% 54% / 0.06) 0%, transparent 70%)',
        }}
      />
      {/* Smaller tight core */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '30%',
          background: 'radial-gradient(circle, hsl(38 90% 54% / 0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
