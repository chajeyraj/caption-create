import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="animate-page-enter">
      {children}
    </div>
  );
};
