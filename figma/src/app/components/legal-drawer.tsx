import { useState } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LegalDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Sticky Legal Access Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="View legal information"
      >
        <Shield className="w-6 h-6" />
      </button>
      
      {/* Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Legal & Compliance</h3>
                  <p className="text-xs text-muted-foreground">Trust & transparency</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Facts */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Quick Facts
                </h4>
                
                <div className="space-y-2">
                  <div className="p-3 bg-accent/50 rounded-lg text-sm">
                    <div className="font-semibold mb-1">Not a Bank</div>
                    <div className="text-muted-foreground">
                      CLEVIO is a financial services platform. Banking services provided by partner institutions.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/50 rounded-lg text-sm">
                    <div className="font-semibold mb-1">Licensed Professionals</div>
                    <div className="text-muted-foreground">
                      All advisors are licensed CPAs, EAs, or CFPs with active credentials.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/50 rounded-lg text-sm">
                    <div className="font-semibold mb-1">$5M Insurance</div>
                    <div className="text-muted-foreground">
                      Professional liability coverage protects advisory services.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/50 rounded-lg text-sm">
                    <div className="font-semibold mb-1">SOC 2 & PCI Compliant</div>
                    <div className="text-muted-foreground">
                      Bank-grade security with independent audits.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legal Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Legal Documents
                </h4>
                
                <div className="space-y-2">
                  <Link
                    to="/compliance"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium">Complete Disclosures</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  
                  <Link
                    to="/terms"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium">Terms of Service</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  
                  <Link
                    to="/privacy"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium">Privacy Policy</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
              
              {/* Contact */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="text-muted-foreground mb-1">Compliance Questions</div>
                    <a href="mailto:compliance@clevio.com" className="text-primary font-medium">
                      compliance@clevio.com
                    </a>
                  </div>
                  
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <div className="text-muted-foreground mb-1">Security Concerns</div>
                    <a href="mailto:security@clevio.com" className="text-primary font-medium">
                      security@clevio.com
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="pt-4 pb-2 text-xs text-muted-foreground leading-relaxed">
                CLEVIO Financial Services, LLC. All services provided by properly licensed and insured 
                professionals. CLEVIO is not a bank. Banking services provided by partner institutions, Members FDIC.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
