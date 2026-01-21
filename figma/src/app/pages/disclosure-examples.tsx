import { InlineDisclosure, LearnMore, DisclaimerBox, LegalFooter, TrustBadge } from '../components/disclosures';

/**
 * This page demonstrates how to use disclosure components throughout the CLEVIO app
 * for trust-building compliance communication.
 */

export function DisclosureExamplesPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl mb-4">Disclosure Component Examples</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Best practices for implementing compliance disclosures throughout CLEVIO
        </p>
        
        {/* Example 1: Pricing Page Inline Disclosure */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">1. Pricing Page - Inline Disclosure</h2>
          <p className="text-muted-foreground mb-6">
            Subtle, reassuring context placed directly after pricing tiers.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            {/* Pricing display would be here */}
            <div className="mb-8 p-6 bg-accent/30 rounded-lg text-center">
              <div className="text-4xl mb-2" style={{ fontWeight: 600 }}>2% - 5%</div>
              <div className="text-muted-foreground">of monthly payroll volume</div>
            </div>
            
            {/* Inline disclosure */}
            <InlineDisclosure>
              <p className="mb-2">
                All CLEVIO services require a 6-month minimum commitment and at least 5 employees. 
                Centurion Payroll™ (2%) is required for all clients. Tax and Advisory tiers are optional 
                add-ons.
              </p>
              <p>
                <LearnMore triggerText="Why these requirements?">
                  <p className="mb-3">
                    <strong>6-Month Commitment:</strong> This allows us to provide consistent advisory support 
                    and ensures you receive the full benefit of our strategic planning services. It also helps 
                    us amortize the cost of your dedicated onboarding process.
                  </p>
                  <p>
                    <strong>5-Employee Minimum:</strong> Our percentage-based model is designed for growing 
                    businesses with established payroll needs. This threshold ensures the economics work for 
                    both your business and our service delivery model.
                  </p>
                </LearnMore>
              </p>
            </InlineDisclosure>
          </div>
        </section>
        
        {/* Example 2: Payroll Confirmation Modal */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">2. Payroll Modal - Disclaimer Box</h2>
          <p className="text-muted-foreground mb-6">
            Clear disclosure before financial transactions, using neutral tones.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl mb-6">Confirm Payroll Run</h3>
            
            <div className="mb-6 space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Total Payroll</span>
                <span style={{ fontWeight: 600 }}>$87,450.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">CLEVIO Service Fee (2%)</span>
                <span style={{ fontWeight: 600 }}>$1,749.00</span>
              </div>
              <div className="flex justify-between py-2 text-lg pt-2 border-t border-border">
                <span style={{ fontWeight: 600 }}>Total AMEX Charge</span>
                <span style={{ fontWeight: 600 }}>$89,199.00</span>
              </div>
            </div>
            
            <DisclaimerBox variant="subtle">
              <p>
                This amount will be charged to your American Express card ending in 1009. 
                Processing typically takes 1-2 business days. Rewards earned are based on your 
                AMEX card agreement and are not guaranteed by CLEVIO.
              </p>
            </DisclaimerBox>
          </div>
        </section>
        
        {/* Example 3: Advisory Service Description */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">3. Advisory Page - Learn More Inline</h2>
          <p className="text-muted-foreground mb-6">
            Expandable context without disrupting the main content flow.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl mb-4">Centurion Advisory™</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Strategic financial planning with licensed advisors who understand your business. 
              Our advisors maintain CFP®, CFA, or equivalent credentials and act in a fiduciary capacity. 
              {' '}<LearnMore triggerText="What does fiduciary mean?">
                <p>
                  When acting as a fiduciary, your advisor is legally obligated to put your interests first. 
                  This means they must:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Provide advice in your best interest, not theirs</li>
                  <li>Disclose any conflicts of interest</li>
                  <li>Charge transparent, reasonable fees</li>
                  <li>Avoid self-dealing or taking advantage of the advisory relationship</li>
                </ul>
                <p className="mt-3">
                  This is a higher standard than "suitability" and ensures your advisor is always 
                  working for you.
                </p>
              </LearnMore>
            </p>
            
            <InlineDisclosure className="mt-6">
              Advisory services include financial planning consultation and strategy recommendations. 
              We do not manage investment portfolios or sell investment products. 
              {' '}<LearnMore triggerText="See full scope of service">
                <div className="space-y-3">
                  <p><strong>What's Included:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Quarterly financial planning sessions</li>
                    <li>Cash flow optimization strategies</li>
                    <li>Capital deployment planning</li>
                    <li>Business structure recommendations</li>
                    <li>Tax efficiency consultation (with Centurion Tax™)</li>
                  </ul>
                  
                  <p><strong>What's Not Included:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Investment portfolio management</li>
                    <li>Individual stock recommendations</li>
                    <li>Insurance product sales</li>
                    <li>Personal (non-business) financial planning</li>
                  </ul>
                </div>
              </LearnMore>
            </InlineDisclosure>
          </div>
        </section>
        
        {/* Example 4: Signup Page Trust Badges */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">4. Signup Page - Trust Badges</h2>
          <p className="text-muted-foreground mb-6">
            Build confidence at the point of commitment with security credentials.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl mb-6">Create Your Account</h3>
            
            {/* Form would be here */}
            <div className="mb-8 space-y-4">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg"
                disabled
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <TrustBadge
                icon="shield"
                label="SOC 2 Type II Certified"
                description="Audited security controls"
              />
              <TrustBadge
                icon="lock"
                label="256-Bit Encryption"
                description="Bank-grade data protection"
              />
            </div>
            
            <InlineDisclosure>
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. 
              We will never sell your data or share it with third parties except as required to provide services.
            </InlineDisclosure>
          </div>
        </section>
        
        {/* Example 5: Dashboard Footer */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">5. Dashboard - Legal Footer</h2>
          <p className="text-muted-foreground mb-6">
            Persistent regulatory context available on every authenticated page.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <LegalFooter compact={true} />
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/compliance" className="text-primary hover:underline">
                  View Complete Disclosures
                </a>
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Example 6: AMEX Connection Notice */}
        <section className="mb-16">
          <h2 className="text-2xl mb-6">6. Onboarding - Important Notice</h2>
          <p className="text-muted-foreground mb-6">
            High-visibility disclosures during setup, using calm blue tones instead of warning red.
          </p>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <DisclaimerBox title="About American Express Verification">
              <p>
                We'll verify your American Express card to ensure it can support payroll processing. 
                This involves a small temporary authorization that will be reversed.
              </p>
              
              <p>
                <strong>What we verify:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Card is active and in good standing</li>
                <li>Sufficient credit available for payroll</li>
                <li>Card type supports commercial transactions</li>
              </ul>
              
              <p>
                Your card information is encrypted and stored securely. We are PCI DSS Level 1 compliant, 
                the highest security standard for payment processing.
              </p>
              
              <p className="mt-3">
                <LearnMore triggerText="Why do you need my AMEX card?">
                  <p>
                    CLEVIO's unique value is enabling payroll through American Express, allowing you to earn 
                    rewards on business expenses that normally provide no benefit. Your AMEX card is the 
                    payment method for payroll processing—similar to how you'd provide bank account details 
                    to a traditional payroll provider.
                  </p>
                </LearnMore>
              </p>
            </DisclaimerBox>
          </div>
        </section>
        
        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-2xl mb-8">Best Practices</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>Use Neutral Colors</h3>
              <p className="text-muted-foreground leading-relaxed">
                Avoid red warning colors for routine disclosures. Use primary blue tones for informational 
                content and reserve yellow/orange for true cautions. Red should only indicate errors or 
                critical issues.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>Layer Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Start with essential information visible by default. Use "Learn more" expandables for 
                deeper context. Link to the complete Compliance page for full legal disclosures. This 
                prevents overwhelming users while maintaining transparency.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>Context Over Legalese</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explain <em>why</em> something matters, not just what the legal requirement is. 
                "This allows us to provide consistent advisory support" is more meaningful than 
                "Service agreement requires 6-month commitment period."
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>Position Near Decisions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Place disclosures adjacent to the actions they relate to. Fees should be disclosed 
                when showing pricing. Card verification details should appear before asking for card 
                information. Timing builds trust.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="mb-3" style={{ fontWeight: 600 }}>Mobile Considerations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Accordion-style expandables work well on mobile. Keep inline disclosures concise. 
                Consider a sticky "Legal Info" link in the mobile footer that opens a drawer with 
                key disclosures and links to full policies.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
