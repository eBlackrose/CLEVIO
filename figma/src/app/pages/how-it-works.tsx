import { Link } from 'react-router-dom';
import { CreditCard, Users, Settings, Calendar, TrendingUp, Shield } from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: Settings,
      title: 'Create your account',
      description: 'Quick and secure signup process. We verify your business information to ensure compliance and security.',
    },
    {
      number: '02',
      icon: CreditCard,
      title: 'Add your AMEX card',
      description: 'Connect your American Express card for seamless payroll processing. Your card information is encrypted and secure.',
    },
    {
      number: '03',
      icon: Users,
      title: 'Add employees & contractors',
      description: 'Input your team members. A minimum of 5 employees or contractors is required to activate services.',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Select your service tier',
      description: 'Choose from Centurion Payroll, Centurion Tax, or Centurion Advisory. Mix and match based on your needs.',
    },
    {
      number: '05',
      icon: Shield,
      title: 'Run payroll seamlessly',
      description: 'Process payments with ease through your AMEX card. Earn rewards while managing compensation professionally.',
    },
    {
      number: '06',
      icon: Calendar,
      title: 'Schedule advisory sessions',
      description: 'Book time with licensed financial professionals and tax advisors for strategic guidance.',
    },
  ];
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl mb-6">How CLEVIO Works</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            From signup to strategic advisory, your journey with CLEVIO is streamlined and secure
          </p>
        </div>
        
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-px bg-border hidden md:block" />
              )}
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-card border-2 border-primary rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm" style={{ fontWeight: 600 }}>
                    {step.number}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link 
            to="/signup" 
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
