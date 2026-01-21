import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="text-2xl tracking-tight mb-4" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                CLEVIO
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AMEX-powered payroll and strategic financial services for sophisticated businesses.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faqs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Trust & Compliance
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 text-sm">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} CLEVIO. All services provided by properly licensed and insured professionals.
            </p>
            <p className="text-xs text-muted-foreground">
              CLEVIO is a financial services platform, not a bank.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}