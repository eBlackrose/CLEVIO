import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const [selectedTiers, setSelectedTiers] = useState({
    payroll: true,
    tax: false,
    advisory: false,
  });
  
  const toggleTier = (tier: 'payroll' | 'tax' | 'advisory') => {
    setSelectedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };
  
  const totalPercentage = (
    (selectedTiers.payroll ? 2 : 0) +
    (selectedTiers.tax ? 2 : 0) +
    (selectedTiers.advisory ? 1 : 0)
  );
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-6">Centurion-Tier Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Select the services you need. Pay a simple percentage. No hidden fees.
          </p>
        </div>
        
        {/* Service Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Centurion Payroll */}
          <div 
            onClick={() => toggleTier('payroll')}
            className={`relative cursor-pointer p-8 border-2 rounded-2xl transition-all ${
              selectedTiers.payroll 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl mb-2">Centurion Payroll™</h3>
                <div className="text-4xl" style={{ fontWeight: 600 }}>2%</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedTiers.payroll ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedTiers.payroll && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Payroll processing via AMEX</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Employee & contractor management</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Automated tax withholdings</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Direct deposit & payment tracking</span>
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl mb-2">Centurion Tax™</h3>
                <div className="text-4xl" style={{ fontWeight: 600 }}>+2%</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedTiers.tax ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedTiers.tax && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Tax preparation by licensed CPAs</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Ongoing tax strategy & optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Quarterly tax planning sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>IRS audit support</span>
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl mb-2">Centurion Advisory™</h3>
                <div className="text-4xl" style={{ fontWeight: 600 }}>+1%</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedTiers.advisory ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {selectedTiers.advisory && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
            
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Financial planning & analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Strategic advisory sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Cash flow optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Growth strategy consulting</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Pricing Summary */}
        <div className="max-w-[600px] mx-auto mb-16">
          <div className="p-8 bg-card border-2 border-primary/30 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg">Your Total Rate</span>
              <div className="text-5xl" style={{ fontWeight: 600 }}>{totalPercentage}%</div>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              {selectedTiers.payroll && <div className="flex justify-between"><span>Centurion Payroll</span><span>2%</span></div>}
              {selectedTiers.tax && <div className="flex justify-between"><span>Centurion Tax</span><span>2%</span></div>}
              {selectedTiers.advisory && <div className="flex justify-between"><span>Centurion Advisory</span><span>1%</span></div>}
            </div>
            
            <Link 
              to="/signup" 
              className="block w-full text-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
        
        {/* Subscription Rules */}
        <div className="max-w-[800px] mx-auto">
          <div className="p-8 bg-accent/30 border border-border rounded-2xl">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <h3 className="text-xl">Subscription Terms</h3>
            </div>
            
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Each tier selectable independently</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>6-month minimum commitment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Automatically converts to month-to-month after initial term</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Minimum of 5 employees or contractors required</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Services and scheduling disabled until minimum is met</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
