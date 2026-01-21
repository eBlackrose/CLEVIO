import { Link } from 'react-router-dom';
import { Shield, CreditCard, TrendingUp, Check, Lock, Users } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border mb-8">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">EMV 3D Secure Technology & Blockchain Encryption</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight" style={{ fontWeight: 600, lineHeight: 1.1 }}>
            Payroll, Paid by <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">AMEX</span>.
            <br />
            Strategy, Led by Experts.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto mb-12">
            CLEVIO enables businesses to run payroll through American Express while gaining access to licensed financial and tax professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Create Account
            </Link>
            <Link 
              to="/signin" 
              className="px-8 py-4 bg-card border border-border rounded-lg hover:bg-accent transition-all"
            >
              Sign In
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Secure AMEX Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Built for Founders</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Pillars */}
      <section className="py-24 px-6 lg:px-12 bg-card/30">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">AMEX-Powered Payroll</h3>
                <p className="text-muted-foreground">
                  Run payroll through your American Express card. Earn rewards while managing your team's compensation seamlessly.
                </p>
              </div>
            </div>
            
            {/* Pillar 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Strategic Tax & Financial Guidance</h3>
                <p className="text-muted-foreground">
                  Access licensed financial managers and tax advisors who understand sophisticated business structures and optimization.
                </p>
              </div>
            </div>
            
            {/* Pillar 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Predictable, Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  Simple percentage-based pricing with no hidden fees. Know exactly what you're paying from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Preview */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground mb-16">
            Getting started with CLEVIO is straightforward and secure
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              { step: '01', title: 'Create your account', desc: 'Quick signup process with secure verification' },
              { step: '02', title: 'Add your AMEX card', desc: 'Connect your American Express for payroll processing' },
              { step: '03', title: 'Add employees & contractors', desc: 'Minimum 5 required to activate services' },
              { step: '04', title: 'Select your service tier', desc: 'Choose from Payroll, Tax, or Advisory' },
              { step: '05', title: 'Run payroll seamlessly', desc: 'Process payments with ease and earn rewards' },
              { step: '06', title: 'Schedule advisory sessions', desc: 'Book time with licensed professionals' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 bg-card border border-border rounded-xl">
                <div className="text-4xl opacity-20" style={{ fontWeight: 600 }}>{item.step}</div>
                <div>
                  <h4 className="mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            to="/how-it-works" 
            className="inline-block mt-12 px-8 py-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
          >
            Learn More
          </Link>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-[800px] mx-auto text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl mb-6">Ready to elevate your financial operations?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join sophisticated businesses using CLEVIO for payroll and strategic advisory.
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}