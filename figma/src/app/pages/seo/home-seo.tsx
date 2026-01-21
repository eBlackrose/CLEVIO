import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Award, TrendingUp } from 'lucide-react';
import { SEOHead, SchemaData } from '../../components/seo-head';

export function HomeSEO() {
  return (
    <>
      <SEOHead
        title="CLEVIO | AMEX-Powered Payroll & Financial Services for Businesses"
        description="Run payroll through American Express while earning rewards. Licensed CPAs and financial advisors provide tax planning and strategic guidance for growing businesses."
        keywords="AMEX payroll, American Express payroll, business payroll solutions, payroll automation, financial services for businesses, tax advisory services"
        canonicalUrl="https://clevio.com"
      />
      
      <SchemaData
        type="Organization"
        data={{
          name: 'CLEVIO',
          description: 'AMEX-powered payroll and financial services platform',
          url: 'https://clevio.com',
          logo: 'https://clevio.com/logo.png',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'hello@clevio.com',
          },
          sameAs: [
            'https://linkedin.com/company/clevio',
            'https://twitter.com/clevio',
          ],
        }}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                Business Payroll Through American Express
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Turn payroll into a strategic advantage. Process payroll with your AMEX card, 
                earn valuable rewards, and access licensed financial professionals—all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
                >
                  Start Free Consultation
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 bg-card border border-border rounded-xl hover:bg-accent transition-all text-lg"
                >
                  How AMEX Payroll Works
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Licensed CPAs & Financial Advisors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>$5M Professional Insurance</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Value Propositions */}
        <section className="py-16 lg:py-24 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-16">
              Why Business Owners Choose CLEVIO for Payroll
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-4">Earn Rewards on Every Payroll</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Process payroll through your American Express business card and earn points or 
                  cash back on an expense that typically provides zero return. Turn a cost center 
                  into a revenue opportunity.
                </p>
                <Link to="/how-it-works" className="text-primary hover:underline inline-flex items-center gap-1">
                  Learn how it works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-4">Licensed Financial Professionals</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Access certified public accountants (CPAs) and licensed financial advisors who 
                  understand your business. Get strategic tax planning and financial guidance included 
                  with your service.
                </p>
                <Link to="/services/advisory" className="text-primary hover:underline inline-flex items-center gap-1">
                  Meet our advisors <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-4">Enterprise-Grade Security</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bank-level security with SOC 2 Type II certification and PCI DSS Level 1 compliance. 
                  Your payroll data is protected by the same standards used by major financial institutions.
                </p>
                <Link to="/security-compliance" className="text-primary hover:underline inline-flex items-center gap-1">
                  Security details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                How AMEX-Powered Payroll Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A smarter way to run payroll that benefits your business and your bottom line
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  1
                </div>
                <h3 className="text-lg mb-3" style={{ fontWeight: 600 }}>Connect Your AMEX Card</h3>
                <p className="text-sm text-muted-foreground">
                  Link your American Express business card securely through our encrypted platform
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  2
                </div>
                <h3 className="text-lg mb-3" style={{ fontWeight: 600 }}>Run Payroll as Usual</h3>
                <p className="text-sm text-muted-foreground">
                  Process payroll on your schedule with automated tax calculations and compliance
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  3
                </div>
                <h3 className="text-lg mb-3" style={{ fontWeight: 600 }}>Earn AMEX Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically earn points or cash back on every payroll run based on your card's terms
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  4
                </div>
                <h3 className="text-lg mb-3" style={{ fontWeight: 600 }}>Get Strategic Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Work with licensed CPAs and advisors for tax optimization and financial planning
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
              >
                See Complete Process <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Services Overview */}
        <section className="py-16 lg:py-24 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                Comprehensive Financial Services for Growing Businesses
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                More than payroll—a complete financial operations platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/services/payroll" className="block p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
                <h3 className="text-2xl mb-3">Payroll Services</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  AMEX-powered payroll processing with automated tax calculations, direct deposit 
                  coordination, and full compliance monitoring.
                </p>
                <div className="text-primary group-hover:underline inline-flex items-center gap-1">
                  View payroll features <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              
              <Link to="/services/tax" className="block p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
                <h3 className="text-2xl mb-3">Tax Advisory</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Licensed CPAs provide quarterly tax planning, annual filings, and strategic 
                  consultation to optimize your business tax position.
                </p>
                <div className="text-primary group-hover:underline inline-flex items-center gap-1">
                  Tax services details <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              
              <Link to="/services/advisory" className="block p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
                <h3 className="text-2xl mb-3">Financial Advisory</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Licensed financial advisors help with cash flow optimization, capital deployment, 
                  and long-term strategic planning.
                </p>
                <div className="text-primary group-hover:underline inline-flex items-center gap-1">
                  Advisory offerings <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Trust Indicators */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                Trusted by Business Leaders
              </h2>
              <p className="text-xl text-muted-foreground">
                Security, compliance, and professional credentials you can verify
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>SOC 2</div>
                <div className="text-sm text-muted-foreground">Type II Certified</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>PCI DSS</div>
                <div className="text-sm text-muted-foreground">Level 1 Compliant</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>$5M</div>
                <div className="text-sm text-muted-foreground">E&O Insurance</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>50</div>
                <div className="text-sm text-muted-foreground">States Licensed</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 lg:py-24 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Transform Your Payroll?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free consultation with a licensed financial professional to discuss 
              how CLEVIO can benefit your business.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
            >
              Get Started Today
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 5-minute setup • Speak with a real person
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
