import { Link } from 'react-router-dom';
import { Award, CheckCircle2, FileText, Calendar, Shield } from 'lucide-react';
import { SEOHead, SchemaData } from '../../components/seo-head';

export function TaxAdvisoryServicesPage() {
  return (
    <>
      <SEOHead
        title="Business Tax Advisory Services | Licensed CPAs for Tax Planning"
        description="Strategic tax planning and compliance for businesses. Licensed CPAs provide quarterly filings, annual returns, and year-round tax optimization guidance."
        keywords="business tax advisory, tax planning for businesses, CPA tax services, business tax preparation, quarterly tax filings, tax strategy"
        canonicalUrl="https://clevio.com/services/tax"
      />
      
      <SchemaData
        type="Service"
        data={{
          name: 'Business Tax Advisory Services',
          provider: {
            '@type': 'Organization',
            name: 'CLEVIO',
          },
          description: 'Licensed CPA tax planning and preparation services for businesses',
          serviceType: 'Tax Advisory',
        }}
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-6" style={{ fontWeight: 600 }}>
                Tax Advisory Services
              </div>
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                Licensed CPA Tax Planning for Growing Businesses
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Strategic tax planning, quarterly filings, and year-round guidance from certified public 
                accountants who understand your business. Reduce liability, ensure compliance, plan ahead.
              </p>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
              >
                Consult with a CPA
              </Link>
            </div>
          </div>
        </section>
        
        {/* Why Licensed CPAs Matter */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-6">
                Why Licensed Tax Professionals Matter
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Tax law is complex and constantly changing. Working with licensed CPAs ensures your business 
                remains compliant while maximizing legitimate deductions and strategic opportunities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Active CPA Licenses</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All tax professionals maintain current CPA licenses in good standing with state boards 
                  of accountancy. Credentials are verified continuously.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">$5M E&O Insurance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Professional errors and omissions insurance protects your business in the unlikely event 
                  of professional mistakes or oversights.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-3">Continuing Education</h3>
                <p className="text-muted-foreground leading-relaxed">
                  CPAs must complete 40+ hours annually of continuing professional education to stay current 
                  with tax law changes and best practices.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* What's Included */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Comprehensive Tax Services for Your Business
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Quarterly Tax Planning & Filing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Proactive quarterly review of your financials with strategic recommendations to optimize 
                  your tax position throughout the year—not just at year-end.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Estimated tax payment calculations and reminders
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Form 941 (employer quarterly federal tax return) preparation and filing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      State quarterly filings for unemployment insurance and income tax withholding
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Mid-year tax projection to avoid surprises and optimize withholding
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Annual Tax Return Preparation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Complete preparation and filing of your business tax returns with strategic review to 
                  identify deductions and credits specific to your industry and situation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Form 1120 (C-Corp), 1120-S (S-Corp), or 1065 (Partnership) based on entity type
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Form 940 (federal unemployment tax) annual filing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      W-2 and 1099 preparation, filing, and distribution to recipients
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      State annual returns for income tax, franchise tax, and other obligations
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Strategic Tax Consultation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Year-round access to your assigned CPA for tax questions, planning discussions, and 
                  strategic decisions that impact your tax liability.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Entity structure optimization (C-Corp vs S-Corp vs LLC analysis)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Major purchase tax planning (equipment, vehicles, real estate)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Compensation strategy for owner-employees (salary vs distribution optimization)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Tax credit identification (R&D, Work Opportunity, industry-specific credits)
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Compliance & Audit Support</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Proactive compliance monitoring and professional support if you're selected for IRS 
                  examination or state tax audit.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Document retention guidance and audit-ready record organization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      IRS notice response and correspondence handling
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Audit representation (CPAs can represent clients before the IRS)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Penalty abatement assistance and installment agreement negotiation if needed
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tax Strategies */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Tax Strategies We Help Business Owners Implement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Section 179 & Bonus Depreciation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Maximize immediate deductions for equipment, vehicles, and technology purchases using 
                  Section 179 expensing (up to $1.16M for 2024) and bonus depreciation rules. We help you 
                  time purchases strategically for maximum tax benefit.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Qualified Business Income Deduction</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pass-through entity owners (S-Corps, LLCs, partnerships) may deduct up to 20% of qualified 
                  business income. We optimize your W-2 wages and asset basis to maximize this deduction 
                  within IRS guidelines.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Retirement Plan Contributions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Strategic use of SEP IRAs, Solo 401(k)s, or defined benefit plans can significantly reduce 
                  taxable income while building owner retirement security. We analyze which plan structure 
                  provides maximum benefit for your situation.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Home Office & Vehicle Deductions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Properly documented home office expenses and business vehicle use provide substantial 
                  deductions. We ensure you're taking these deductions correctly to withstand IRS scrutiny 
                  while maximizing legitimate claims.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Entity Structure Optimization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As your business grows, the optimal entity structure may change. We provide annual analysis 
                  of whether C-Corp, S-Corp, or LLC status best serves your tax situation, considering self-employment 
                  tax, qualified business income rules, and state-specific factors.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Tax Credit Maximization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Many businesses overlook valuable tax credits. We identify R&D credits for product development, 
                  Work Opportunity credits for hiring certain employees, and industry-specific credits that can 
                  reduce your tax bill dollar-for-dollar.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl mb-4">
                Tax Advisory Pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Add Centurion Tax™ to your payroll service for comprehensive tax support
              </p>
            </div>
            
            <div className="p-8 bg-card border border-border rounded-2xl text-center">
              <div className="text-6xl mb-4" style={{ fontWeight: 600 }}>+2%</div>
              <div className="text-xl text-muted-foreground mb-6">
                Additional fee on monthly payroll volume
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Centurion Tax™ requires active Centurion Payroll™ subscription. Both services are billed 
                as a simple percentage of your monthly payroll with no additional per-form or hourly fees.
              </p>
              <Link
                to="/pricing"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
              >
                View Complete Pricing
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Work with a Licensed CPA
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free tax consultation to discuss your business's specific situation and opportunities.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
            >
              Schedule Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
