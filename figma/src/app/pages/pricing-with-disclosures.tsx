import { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InlineDisclosure, LearnMore, DisclaimerBox } from '../components/disclosures';

export function PricingWithDisclosuresPage() {
  const [selectedTiers, setSelectedTiers] = useState({
    payroll: true,
    tax: false,
    advisory: false,
  });
  
  const toggleTier = (tier: 'payroll' | 'tax' | 'advisory') => {
    // Payroll is required
    if (tier === 'payroll') return;
    setSelectedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };
  
  const totalPercentage = (
    (selectedTiers.payroll ? 2 : 0) +
    (selectedTiers.tax ? 2 : 0) +
    (selectedTiers.advisory ? 1 : 0)
  );
  
  // Example calculation
  const examplePayroll = 75000;
  const totalFee = examplePayroll * (totalPercentage / 100);
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-6">Centurion-Tier Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Transparent percentage-based fees. No surprises, no hidden costs.
          </p>
        </div>
        
        {/* Service Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Centurion Payroll */}
          <div className="relative p-8 border-2 border-primary bg-primary/5 rounded-2xl">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full" style={{ fontWeight: 600 }}>
                Required
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl mb-2">Centurion Payroll™</h3>
              <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>2%</div>
              <p className="text-sm text-muted-foreground">of monthly payroll volume</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">AMEX-powered payment processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Automated tax calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Direct deposit coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Compliance monitoring</span>
              </li>
            </ul>
          </div>
          
          {/* Centurion Tax */}
          <div 
            onClick={() => toggleTier('tax')}
            className={`relative cursor-pointer p-8 border-2 rounded-2xl transition-all ${
              selectedTiers.tax 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl mb-2">Centurion Tax™</h3>
                <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>+2%</div>
                <p className="text-sm text-muted-foreground">additional fee</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedTiers.tax ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedTiers.tax && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Licensed CPA support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Quarterly tax filings</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Annual return preparation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Tax planning consultation</span>
              </li>
            </ul>
          </div>
          
          {/* Centurion Advisory */}
          <div 
            onClick={() => toggleTier('advisory')}
            className={`relative cursor-pointer p-8 border-2 rounded-2xl transition-all ${
              selectedTiers.advisory 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl mb-2">Centurion Advisory™</h3>
                <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>+1%</div>
                <p className="text-sm text-muted-foreground">additional fee</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedTiers.advisory ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedTiers.advisory && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Licensed financial advisor</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Strategic planning sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Cash flow optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Capital deployment guidance</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Example Calculation */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-12">
          <h3 className="text-2xl mb-6">Example Monthly Cost</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Monthly Payroll</div>
              <div className="text-3xl mb-6" style={{ fontWeight: 600 }}>
                ${examplePayroll.toLocaleString()}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Centurion Payroll (2%)</span>
                  <span style={{ fontWeight: 600 }}>${(examplePayroll * 0.02).toLocaleString()}</span>
                </div>
                {selectedTiers.tax && (
                  <div className="flex justify-between text-sm">
                    <span>Centurion Tax (+2%)</span>
                    <span style={{ fontWeight: 600 }}>${(examplePayroll * 0.02).toLocaleString()}</span>
                  </div>
                )}
                {selectedTiers.advisory && (
                  <div className="flex justify-between text-sm">
                    <span>Centurion Advisory (+1%)</span>
                    <span style={{ fontWeight: 600 }}>${(examplePayroll * 0.01).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="p-6 bg-primary/10 border border-primary/30 rounded-xl">
                <div className="text-sm text-muted-foreground mb-2">Your Total Service Fee</div>
                <div className="text-4xl text-primary mb-1" style={{ fontWeight: 600 }}>
                  ${totalFee.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalPercentage}% of monthly payroll
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Inline Disclosures */}
        <div className="mb-12">
          <InlineDisclosure className="max-w-3xl mx-auto">
            <p className="mb-3">
              <strong>Service Requirements:</strong> All CLEVIO clients must maintain a minimum of 5 employees 
              and commit to a 6-month service period. Centurion Payroll™ is required for all accounts. 
              Tax and Advisory tiers are optional add-ons that can be added or removed at renewal.
            </p>
            
            <p className="mb-3">
              <LearnMore triggerText="Why these requirements?">
                <div className="space-y-3">
                  <p>
                    <strong>6-Month Commitment:</strong> This commitment period allows us to provide meaningful 
                    advisory support and strategic planning. It also ensures you receive the full benefit of our 
                    onboarding process and relationship development with your dedicated professionals.
                  </p>
                  <p>
                    <strong>5-Employee Minimum:</strong> Our percentage-based pricing model is designed for 
                    growing businesses with established payroll operations. This threshold ensures the service 
                    economics work effectively for both your business and our delivery model.
                  </p>
                  <p>
                    Early termination fees may apply if service is discontinued before the commitment period ends. 
                    See <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> for details.
                  </p>
                </div>
              </LearnMore>
            </p>
            
            <p>
              <strong>About AMEX Rewards:</strong> While CLEVIO enables AMEX-powered payroll, the specific 
              rewards you earn depend on your American Express card agreement. Earning rates, categories, 
              and benefits are determined solely by AMEX and are not guaranteed by CLEVIO. 
              {' '}<LearnMore triggerText="Learn about rewards">
                <p className="mb-3">
                  Different American Express cards offer different reward structures. Common examples include:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>1-2 points per dollar on general business purchases</li>
                  <li>Bonus points in specific categories (advertising, shipping, etc.)</li>
                  <li>Cash back percentages on certain card products</li>
                  <li>Membership Rewards points that can be transferred to travel partners</li>
                </ul>
                <p>
                  Review your specific AMEX card's rewards program terms to understand what you'll earn 
                  on payroll processing. CLEVIO cannot control, guarantee, or modify AMEX earning rates.
                </p>
              </LearnMore>
            </p>
          </InlineDisclosure>
        </div>
        
        {/* Disclaimer Box */}
        <div className="mb-12">
        <DisclaimerBox variant="subtle">
          <p>
            CLEVIO is a financial services platform operated by CLEVIO Financial Services, LLC. We are not a bank. 
            Payment processing services are provided through partner financial institutions. Tax services are 
            provided by licensed CPAs maintaining active state credentials and professional liability insurance. 
            Financial advisory services are provided by licensed advisors acting in a fiduciary capacity.
          </p>
          <p className="mt-3">
            View our complete <Link to="/compliance" className="text-primary hover:underline">compliance disclosures</Link> 
            {' '}for detailed information about licensing, insurance, and regulatory oversight.
          </p>
        </DisclaimerBox>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
          >
            Get Started
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            Questions about pricing? <a href="mailto:sales@clevio.com" className="text-primary hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
