import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/user-context';
import { OnboardingProgress } from '../components/onboarding-progress';
import { Shield, CreditCard, Users, Briefcase, Check, Lock, ArrowRight } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  type: 'employee' | 'contractor';
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Step 2: AMEX Card
  const [amexData, setAmexData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const amexComplete = amexData.cardNumber.length === 15 && amexData.expiry && amexData.cvv && amexData.name;
  
  // Step 3: Employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', type: 'employee' as 'employee' | 'contractor' });
  const employeesComplete = employees.length >= 5;
  
  // Step 4: Services
  const [selectedTiers, setSelectedTiers] = useState({
    payroll: true, // Required
    tax: false,
    advisory: false,
  });
  
  const totalFee = (
    (selectedTiers.payroll ? 2 : 0) +
    (selectedTiers.tax ? 2 : 0) +
    (selectedTiers.advisory ? 1 : 0)
  );
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      setEmployees([...employees, { ...newEmployee, id: Date.now().toString() }]);
      setNewEmployee({ name: '', email: '', type: 'employee' });
    }
  };
  
  const removeEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };
  
  const completeOnboarding = () => {
    // Save all onboarding data to user context
    updateUserData({
      employees: employees.map(emp => ({
        ...emp,
        bankStatus: 'pending' as const,
        payrollStatus: 'inactive' as const,
      })),
      amexCard: {
        last4: amexData.cardNumber.slice(-4),
        name: amexData.name,
        expiry: amexData.expiry,
      },
      selectedTiers,
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return amexComplete;
      case 3:
        return employeesComplete;
      case 4:
        return selectedTiers.payroll; // Payroll is required
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-[900px] mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl tracking-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLEVIO
            </span>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Step Content */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-8">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center max-w-[600px] mx-auto">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl md:text-4xl mb-4">Let's Activate Your CLEVIO Account</h1>
              <p className="text-lg text-muted-foreground mb-8">
                We'll guide you through a few quick steps to set up your AMEX-powered payroll and connect you with licensed financial professionals.
              </p>
              
              <div className="space-y-4 mb-12 text-left">
                <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="mb-1">Bank-Level Security</div>
                    <p className="text-sm text-muted-foreground">
                      Your information is encrypted and protected with SOC 2 Type II certification
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="mb-1">Licensed Professionals</div>
                    <p className="text-sm text-muted-foreground">
                      All services provided by licensed and insured CPAs and financial advisors
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-accent rounded-lg">
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="mb-1">Transparent Pricing</div>
                    <p className="text-sm text-muted-foreground">
                      Simple percentage-based fees with no hidden costs
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                This process takes about 5 minutes
              </p>
            </div>
          )}
          
          {/* Step 2: AMEX Card */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <CreditCard className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl md:text-3xl mb-1">Connect Your AMEX Card</h2>
                  <p className="text-muted-foreground">Securely add your American Express for payroll processing</p>
                </div>
              </div>
              
              <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <div className="mb-1 text-primary">Your card details are secure</div>
                  <p className="text-muted-foreground">
                    We use PCI-compliant encryption. Your information is never stored in plain text.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={amexData.name}
                    onChange={(e) => setAmexData({ ...amexData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Card Number</label>
                  <input
                    type="text"
                    value={amexData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 15);
                      setAmexData({ ...amexData, cardNumber: value });
                    }}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="374245455400126"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground mt-2">American Express cards are 15 digits</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={amexData.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setAmexData({ ...amexData, expiry: value });
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">CVV</label>
                    <input
                      type="text"
                      value={amexData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setAmexData({ ...amexData, cvv: value });
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                {amexComplete && (
                  <div className="p-4 bg-accent rounded-lg flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="mb-1">American Express</div>
                      <div className="text-sm text-muted-foreground">
                        •••• •••• •••• {amexData.cardNumber.slice(-4)}
                      </div>
                    </div>
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 3: Employees */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl md:text-3xl mb-1">Add Your Team</h2>
                  <p className="text-muted-foreground">Minimum of 5 employees or contractors required</p>
                </div>
              </div>
              
              <div className={`mb-8 p-4 border rounded-lg flex items-start gap-3 ${
                employeesComplete 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-accent border-border'
              }`}>
                <div className="flex-1">
                  <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>
                    {employees.length} of 5 added
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {employeesComplete 
                      ? 'Minimum requirement met. You can continue.' 
                      : `Add ${5 - employees.length} more to continue`
                    }
                  </p>
                </div>
                {employeesComplete && <Check className="w-6 h-6 text-primary" />}
              </div>
              
              {/* Add Employee Form */}
              <div className="mb-8 p-6 bg-accent rounded-lg">
                <h3 className="mb-4">Add Team Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Email"
                  />
                  <select
                    value={newEmployee.type}
                    onChange={(e) => setNewEmployee({ ...newEmployee, type: e.target.value as 'employee' | 'contractor' })}
                    className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="employee">Employee</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>
                <button
                  onClick={addEmployee}
                  disabled={!newEmployee.name || !newEmployee.email}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  Add to List
                </button>
              </div>
              
              {/* Employee List */}
              {employees.length > 0 && (
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="mb-1">{employee.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span>{employee.email}</span>
                          <span className="px-2 py-1 bg-accent rounded text-xs capitalize">{employee.type}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEmployee(employee.id)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Service Tiers */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Briefcase className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl md:text-3xl mb-1">Select Your Centurion Tiers</h2>
                  <p className="text-muted-foreground">Choose the services that fit your needs</p>
                </div>
              </div>
              
              <div className="mb-8 p-6 bg-gradient-to-br from-card to-accent border-2 border-primary/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Your Total Rate</div>
                    <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>{totalFee}%</div>
                    <p className="text-sm text-muted-foreground">per payroll cycle</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {/* Payroll (Required) */}
                <div className="p-6 border-2 border-primary bg-primary/5 rounded-xl cursor-not-allowed">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl">Centurion Payroll™</h3>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        AMEX-powered payroll processing for your team
                      </p>
                      <div className="text-2xl text-primary" style={{ fontWeight: 600 }}>2%</div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* Tax (Optional) */}
                <div
                  onClick={() => setSelectedTiers({ ...selectedTiers, tax: !selectedTiers.tax })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTiers.tax 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl mb-2">Centurion Tax™</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tax preparation and strategic planning by licensed CPAs
                      </p>
                      <div className="text-2xl text-primary" style={{ fontWeight: 600 }}>+2%</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedTiers.tax ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selectedTiers.tax && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </div>
                
                {/* Advisory (Optional) */}
                <div
                  onClick={() => setSelectedTiers({ ...selectedTiers, advisory: !selectedTiers.advisory })}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTiers.advisory 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl mb-2">Centurion Advisory™</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Strategic financial consulting and planning
                      </p>
                      <div className="text-2xl text-primary" style={{ fontWeight: 600 }}>+1%</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedTiers.advisory ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selectedTiers.advisory && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Each tier requires a 6-month minimum commitment, then converts to month-to-month billing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={completeOnboarding}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <span>Complete Setup</span>
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Disabled State Message */}
        {!canProceed() && currentStep > 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {currentStep === 2 && 'Please complete all AMEX card fields to continue'}
              {currentStep === 3 && `Add ${5 - employees.length} more team member${5 - employees.length !== 1 ? 's' : ''} to continue`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}