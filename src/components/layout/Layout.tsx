import Header from './Header';
import Footer from './Footer';
// Temporarily disabled for debugging
// import { useAnalytics } from '@/hooks/useAnalytics';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  // Temporarily disabled analytics tracking for debugging
  // useAnalytics();

  return (
    <div className="flex min-h-screen flex-col bg-morning-mist">
      <Header />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}
