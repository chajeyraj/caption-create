import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageProgress = () => {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setProgress(0);
    setVisible(true);

    const t1 = setTimeout(() => setProgress(72), 30);
    const t2 = setTimeout(() => setProgress(100), 350);
    const t3 = setTimeout(() => setVisible(false), 650);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400"
        style={{
          width: `${progress}%`,
          transition: progress === 100
            ? 'width 0.15s ease-out, opacity 0.25s ease-in 0.15s'
            : 'width 0.4s ease-out',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
};
