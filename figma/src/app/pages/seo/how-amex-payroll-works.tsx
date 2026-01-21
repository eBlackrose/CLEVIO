import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, CreditCard, Users, Calculator, TrendingUp } from 'lucide-react';
import { SEOHead } from '../../components/seo-head';

export function HowAmexPayrollWorksPage() {
  return (
    <>
      <SEOHead
        title="How AMEX Payroll Works | American Express Business Payments"
        description="Learn how to process business payroll through American Express. Step-by-step guide to earning rewards on payroll while automating payments and tax compliance."
        keywords="AMEX payroll how it works, American Express payroll processing, business payroll AMEX, how to pay employees with AMEX, payroll rewards"
        canonicalUrl="https://clevio.com/how-it-works"
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                How to Process Payroll Through American Express
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                A complete guide to earning AMEX rewards on payroll while automating employee payments, 
                tax calculations, and compliance—without changing how your employees get paid.
              </p>
            </div>
          </div>
        </section>
        
        {/* The Concept */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl mb-6">
                The Concept: Turn Payroll Into a Revenue Opportunity
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Traditional payroll services deduct fees from your bank account and provide no financial 
                  benefit beyond processing payments. You're paying for a necessary service with no upside.
                </p>
                <p>
                  <strong className="text-foreground">CLEVIO changes this equation.</strong> By processing 
                  payroll through your American Express business card, you transform a pure cost center into 
                  an opportunity to earn valuable rewards—points, miles, or cash back depending on your card.
                </p>
                <p>
                  Here's what makes it work: Your AMEX card is charged for the total payroll amount (plus our 
                  service fee). We coordinate direct deposits to your employees' bank accounts. Employees receive 
                  standard direct deposits—nothing changes from their perspective. You earn AMEX rewards on 
                  the entire transaction.
                </p>
                <p>
                  <strong className="text-foreground">The result:</strong> Payroll rewards can offset a significant 
                  portion of our service fee, making professional payroll management surprisingly affordable—or 
                  even profitable with the right rewards card.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Step by Step */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Step-by-Step: Your First Payroll Run
            </h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" style={{ fontWeight: 600 }}>
                    1
                  </div>
                  <h3 className="text-2xl mb-3">Create Your Account</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sign up and complete our streamlined onboarding process in about 10 minutes.
                  </p>
                </div>
                <div className="lg:w-2/3 p-6 bg-card border border-border rounded-xl">
                  <h4 className="mb-4" style={{ fontWeight: 600 }}>What You'll Provide:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Business Information:</strong> EIN, legal business name, 
                        address, and entity type
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Bank Account:</strong> For accounting reconciliation 
                        and backup payment methods
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Service Selection:</strong> Choose Payroll (required), 
                        and optionally add Tax or Advisory tiers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" style={{ fontWeight: 600 }}>
                    2
                  </div>
                  <h3 className="text-2xl mb-3">Connect Your American Express Card</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Securely link your AMEX business card through our encrypted, PCI-compliant platform.
                  </p>
                </div>
                <div className="lg:w-2/3 p-6 bg-card border border-border rounded-xl">
                  <h4 className="mb-4" style={{ fontWeight: 600 }}>Card Verification Process:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Secure Entry:</strong> Enter your AMEX card details 
                        through bank-grade 256-bit encryption
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Verification Check:</strong> We place a small temporary 
                        authorization (reversed within 24 hours) to verify the card is active
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Credit Review:</strong> Our system confirms sufficient 
                        available credit to support your projected payroll volume
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg text-sm text-muted-foreground">
                    <strong className="text-foreground">Security Note:</strong> Your card information is tokenized 
                    and never stored in plain text. We maintain PCI DSS Level 1 compliance—the highest security 
                    standard for payment processing.
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" style={{ fontWeight: 600 }}>
                    3
                  </div>
                  <h3 className="text-2xl mb-3">Add Your Employees</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Import employee data or enter it manually. Our system handles all the complexity.
                  </p>
                </div>
                <div className="lg:w-2/3 p-6 bg-card border border-border rounded-xl">
                  <h4 className="mb-4" style={{ fontWeight: 600 }}>Employee Information Needed:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Basic Details:</strong> Full name, address, 
                        date of birth, Social Security number
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Compensation:</strong> Salary or hourly rate, 
                        pay frequency, and any recurring deductions
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Tax Withholding:</strong> W-4 information 
                        (federal and state) to calculate proper withholdings
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Banking:</strong> Direct deposit account and 
                        routing numbers for payment delivery
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" style={{ fontWeight: 600 }}>
                    4
                  </div>
                  <h3 className="text-2xl mb-3">Run Your First Payroll</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Review automatically calculated amounts and approve with a single click.
                  </p>
                </div>
                <div className="lg:w-2/3 p-6 bg-card border border-border rounded-xl">
                  <h4 className="mb-4" style={{ fontWeight: 600 }}>What Happens During Processing:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Automatic Calculations:</strong> Gross pay, 
                        federal/state/local taxes, FICA, and net pay calculated for each employee
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Review Period:</strong> You see all calculations 
                        before approval and can adjust for bonuses, reimbursements, or PTO
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">AMEX Charge:</strong> Your card is charged for 
                        total net pay + withheld taxes + our 2% service fee
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">Direct Deposits:</strong> We coordinate ACH 
                        transfers to employees' banks based on your selected payment date
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 text-2xl" style={{ fontWeight: 600 }}>
                    5
                  </div>
                  <h3 className="text-2xl mb-3">Earn Your AMEX Rewards</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Points, miles, or cash back post to your AMEX account according to your card's terms.
                  </p>
                </div>
                <div className="lg:w-2/3 p-6 bg-card border border-border rounded-xl">
                  <h4 className="mb-4" style={{ fontWeight: 600 }}>Understanding Your Rewards:</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <div className="mb-2" style={{ fontWeight: 600 }}>Example Calculation:</div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Monthly Payroll:</span>
                          <span className="text-foreground font-semibold">$100,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CLEVIO Service Fee (2%):</span>
                          <span className="text-foreground font-semibold">$2,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total AMEX Charge:</span>
                          <span className="text-foreground font-semibold">$102,000</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between">
                            <span>AMEX Rewards (1.5% example)*:</span>
                            <span className="text-primary font-semibold">$1,530</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="font-semibold">Net Cost After Rewards:</span>
                            <span className="text-foreground font-semibold">$470</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      *Actual rewards depend on your American Express card's earning structure. This example 
                      assumes 1.5% earning rate. Some AMEX cards offer higher rates in specific categories or 
                      with annual spending bonuses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Behind the Scenes */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              What Happens Behind the Scenes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-4">Tax Withholding & Remittance</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When we charge your AMEX card, we're collecting not just net employee pay but also all 
                  withheld taxes (federal income tax, state income tax, Social Security, Medicare, and any 
                  local taxes). These funds are held in trust and remitted to tax authorities on your behalf 
                  on the required schedule.
                </p>
                <p className="text-sm text-muted-foreground">
                  With our Centurion Tax™ tier, licensed CPAs handle all quarterly and annual filings, 
                  ensuring you never miss a deadline or face penalties.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-4">Direct Deposit Coordination</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We coordinate ACH transfers from our trust account to your employees' banks. The process 
                  typically takes 1-2 business days, so we initiate transfers in advance to ensure employees 
                  are paid on your specified date. Your AMEX card is charged when payroll is approved, not 
                  when employees receive funds.
                </p>
                <p className="text-sm text-muted-foreground">
                  Employees receive standard direct deposits with no indication that AMEX was involved—it's 
                  completely transparent to your team.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-4">Compliance Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our system automatically checks for compliance issues before each payroll run: minimum wage 
                  violations, overtime miscalculations, contractor misclassification, and required state-specific 
                  deductions. If we detect an issue, you're alerted before processing.
                </p>
                <p className="text-sm text-muted-foreground">
                  We maintain records for 7 years and provide audit-ready reports instantly whenever needed.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-4">Year-End Tax Documents</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  W-2s, 1099s, and other year-end tax forms are generated automatically based on your payroll 
                  history. Forms are electronically filed with tax authorities and delivered to employees by 
                  required deadlines. You don't lift a finger.
                </p>
                <p className="text-sm text-muted-foreground">
                  Recipients can access forms through secure online portals, and we handle all corrections 
                  or amendments if needed.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Common Questions */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Common Questions About AMEX Payroll
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Is this legal? Does AMEX allow payroll charges?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, it's completely legal and compliant. American Express allows business cardholders to 
                  make business-related purchases, including payments to service providers. CLEVIO is the 
                  service provider processing your payroll. AMEX charges appear as payments to CLEVIO, not 
                  individual employee payments.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">What happens if AMEX payment fails?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If an AMEX charge is declined (insufficient credit, card issue, etc.), we immediately notify 
                  you and provide alternative payment options including ACH debit from your linked bank account. 
                  We ensure employees are never impacted by payment method issues.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Can I switch between AMEX and bank account payments?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. You can choose your payment method for each payroll run. If you need to preserve AMEX 
                  credit for other business expenses in a particular month, you can opt to pay via bank transfer 
                  for that specific payroll and return to AMEX the following period.
                </p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl">
                <h3 className="text-xl mb-3">Do I need a specific type of AMEX card?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Any American Express business card works—Business Gold, Business Platinum, Business Green, 
                  or co-branded business cards. Personal AMEX cards are not eligible. The higher your card's 
                  earning rate and credit limit, the more beneficial the service becomes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Start Earning Rewards on Payroll?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              See exactly how much you could earn with a personalized rewards calculation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
              >
                Calculate Your Rewards
              </Link>
              <Link
                to="/services/payroll"
                className="px-8 py-4 bg-card border border-border rounded-xl hover:bg-accent transition-all text-lg"
              >
                View Payroll Features
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
