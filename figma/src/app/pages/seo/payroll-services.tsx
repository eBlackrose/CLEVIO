import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Shield, Calculator, Users, CreditCard } from 'lucide-react';
import { SEOHead, SchemaData } from '../../components/seo-head';

export function PayrollServicesPage() {
  return (
    <>
      <SEOHead
        title="Business Payroll Services | AMEX-Powered Payroll Processing"
        description="Automated payroll processing through American Express. Earn rewards while managing employee payments, tax calculations, and compliance. Licensed professionals included."
        keywords="business payroll services, payroll processing, automated payroll, AMEX payroll, payroll for small business, payroll automation"
        canonicalUrl="https://clevio.com/services/payroll"
      />
      
      <SchemaData
        type="Service"
        data={{
          name: 'AMEX-Powered Payroll Services',
          provider: {
            '@type': 'Organization',
            name: 'CLEVIO',
          },
          description: 'Business payroll processing through American Express with automated tax calculations and compliance',
          serviceType: 'Payroll Processing',
          areaServed: 'United States',
        }}
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
                Payroll Services
              </div>
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                Business Payroll Processing Through American Express
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Automated payroll services that let you earn AMEX rewards on every payment while ensuring 
                accurate tax calculations, compliance, and timely direct deposits for your team.
              </p>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
              >
                Start Processing Payroll
              </Link>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Complete Payroll Automation for Growing Businesses
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">AMEX-Powered Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Process payroll through your American Express business card and earn valuable rewards 
                  on an expense that typically provides zero return. Turn payroll into a profit center.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Automated Tax Calculations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Federal, state, and local tax withholdings calculated automatically for every employee. 
                  Stay compliant with constantly changing tax regulations across all 50 states.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Direct Deposit Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Coordinate direct deposits with employees' banks while your AMEX card is charged for 
                  the total. Employees get paid on time, you earn rewards.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Compliance Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time compliance checks ensure you meet minimum wage requirements, overtime 
                  calculations, and contractor classification rules.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Flexible Scheduling</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Run payroll weekly, bi-weekly, semi-monthly, or monthly. Set your schedule and we'll 
                  automate the entire process with reminders before each run.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Audit-Ready Records</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every payroll run is documented with detailed records, tax calculations, and payment 
                  confirmations. Export reports instantly for accounting or audits.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                How AMEX Payroll Processing Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A streamlined process that saves time and earns rewards
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl" style={{ fontWeight: 600 }}>
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-3">Add Your Employees</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Import employee information including salary, hourly rates, tax withholding details, 
                    and bank account information for direct deposit. Our system handles W-4 processing 
                    and state-specific requirements automatically.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl" style={{ fontWeight: 600 }}>
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-3">Connect Your American Express Card</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Securely link your AMEX business card through our PCI DSS Level 1 compliant platform. 
                    We verify your card can support payroll volumes and ensure sufficient credit availability 
                    before each payroll run.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl" style={{ fontWeight: 600 }}>
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-3">Review and Approve Payroll</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Before each payroll run, review automatically calculated gross pay, deductions, taxes, 
                    and net pay for each employee. Make any necessary adjustments for bonuses, reimbursements, 
                    or time-off. Approve with a single click.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl" style={{ fontWeight: 600 }}>
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-3">We Process Everything</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your AMEX card is charged for the total payroll amount (including our service fee). 
                    We coordinate direct deposits to your employees' bank accounts and handle all tax 
                    withholdings and filings. You earn AMEX rewards on the entire transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl mb-6">
                Simple, Transparent Payroll Pricing
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                2% of monthly payroll volume. No setup fees, no hidden charges, no per-employee costs.
              </p>
              
              <div className="p-8 bg-card border border-border rounded-2xl mb-8">
                <div className="text-6xl mb-4" style={{ fontWeight: 600 }}>2%</div>
                <div className="text-xl text-muted-foreground mb-6">of monthly payroll volume</div>
                
                <div className="p-6 bg-accent/50 rounded-xl mb-6 text-left">
                  <div className="text-sm text-muted-foreground mb-3">Example: $75,000 monthly payroll</div>
                  <div className="flex justify-between text-lg mb-2">
                    <span>Monthly Service Fee:</span>
                    <span style={{ fontWeight: 600 }}>$1,500</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>AMEX Rewards (1.5% example)*:</span>
                    <span>~$1,125</span>
                  </div>
                  <div className="flex justify-between text-lg mt-3 pt-3 border-t border-border">
                    <span style={{ fontWeight: 600 }}>Effective Cost:</span>
                    <span style={{ fontWeight: 600 }} className="text-primary">~$375</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  *Rewards vary by AMEX card. This example assumes 1.5% earning rate. Actual rewards 
                  determined by your American Express card agreement.
                </p>
              </div>
              
              <Link
                to="/pricing"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
              >
                View Complete Pricing
              </Link>
            </div>
          </div>
        </section>
        
        {/* Who Benefits */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Who Benefits from AMEX Payroll Services?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Small Business Owners (5-50 Employees)</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Perfect for growing businesses that want to maximize rewards on significant monthly 
                  expenses. Turn your $50,000-$200,000 monthly payroll into valuable AMEX points while 
                  automating compliance and tax calculations.
                </p>
                <Link to="/solutions/small-business" className="text-primary hover:underline">
                  Small business solutions →
                </Link>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Companies with Contractors</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Manage both W-2 employees and 1099 contractors in one platform. Automate contractor 
                  payments through AMEX while maintaining proper classification and documentation for 
                  tax compliance.
                </p>
                <Link to="/solutions/contractors" className="text-primary hover:underline">
                  Contractor payroll →
                </Link>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Multi-State Employers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Employees across different states? We handle varying state tax rates, unemployment 
                  insurance, and compliance requirements automatically. One platform, all 50 states 
                  supported.
                </p>
                <Link to="/how-it-works" className="text-primary hover:underline">
                  See how it works →
                </Link>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">CFOs & Finance Managers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Finance professionals appreciate our audit-ready reporting, real-time compliance 
                  monitoring, and integration with accounting systems. Plus, the rewards offset service 
                  costs significantly.
                </p>
                <Link to="/pricing" className="text-primary hover:underline">
                  ROI calculator →
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Payroll Processing Questions
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">How quickly can I start processing payroll?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most businesses complete setup within 48 hours. You'll import employee data, verify 
                  your AMEX card, and can run your first payroll within 2-3 business days. Our team 
                  provides white-glove onboarding support.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">What if my AMEX card doesn't have sufficient credit?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We check available credit before each payroll run and alert you if there's insufficient 
                  capacity. You can pay down your balance, request a credit increase from AMEX, or use 
                  an alternative payment method for that specific payroll run.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Do employees know payroll is processed through AMEX?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No. Employees receive standard direct deposits to their bank accounts just like traditional 
                  payroll. The AMEX payment method is transparent to your team—they simply see timely, 
                  accurate deposits.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">What about payroll taxes and filings?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All federal, state, and local payroll taxes are calculated and withheld automatically. 
                  If you add our Centurion Tax™ service, licensed CPAs handle all quarterly and annual 
                  tax filings on your behalf.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/faqs" className="text-primary hover:underline">
                View all payroll FAQs →
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Earn Rewards on Payroll?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free consultation to see how much you could earn with AMEX-powered payroll.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
