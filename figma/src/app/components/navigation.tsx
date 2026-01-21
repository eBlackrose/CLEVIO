import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl tracking-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLEVIO
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/how-it-works" 
              className={`text-sm transition-colors ${isActive('/how-it-works') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm transition-colors ${isActive('/pricing') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pricing
            </Link>
            <Link 
              to="/faqs" 
              className={`text-sm transition-colors ${isActive('/faqs') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              FAQs
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/signin" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
