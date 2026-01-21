import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, TrendingUp, DollarSign, Users, Shield, CreditCard, Lock, Award, Target, Zap, Globe } from 'lucide-react';

const pitchScreens = [
  {
    id: 1,
    type: 'vision',
    title: 'Payroll is a Financial Strategy Lever',
    subtitle: 'Not just an expense',
    content: null,
  },
  {
    id: 2,
    type: 'problem',
    title: 'The Problem',
    subtitle: 'Traditional payroll is a dead-end expense',
    points: [
      'Zero cash flow optimization',
      'No rewards or benefits',
      'Disconnected from financial strategy',
      'Missed float opportunities',
    ],
  },
  {
    id: 3,
    type: 'problem-deep',
    title: '$10.8 Trillion',
    subtitle: 'Annual US payroll spend going unrewarded',
    content: 'Most businesses treat payroll as a cost center. We see it as capital deployment.',
  },
  {
    id: 4,
    type: 'solution',
    title: 'CLEVIO',
    subtitle: 'AMEX-Powered Payroll + Licensed Financial Advisory',
    points: [
      'Run payroll through American Express',
      'Access licensed CPAs and advisors',
      'Strategic financial planning',
      'Simple percentage-based fees',
    ],
  },
  {
    id: 5,
    type: 'solution-visual',
    title: 'The CLEVIO Stack',
    layers: [
      { label: 'AMEX Payment Rails', description: 'Enterprise card processing' },
      { label: 'Payroll Engine', description: 'Compliance & automation' },
      { label: 'Advisory Layer', description: 'Licensed professionals' },
      { label: 'Client Dashboard', description: 'Premium experience' },
    ],
  },
  {
    id: 6,
    type: 'market',
    title: 'Market',
    subtitle: '33M small businesses in the United States',
    segments: [
      { name: 'Primary Target', size: '5-50 employees', value: '$180B TAM', description: 'Growth-stage SMBs' },
      { name: 'Ideal Customer', profile: 'Founder/CFO', pain: 'Cash flow optimization', willingness: 'Premium services' },
    ],
  },
  {
    id: 7,
    type: 'revenue',
    title: 'Revenue Model',
    subtitle: 'Transparent percentage fees',
    tiers: [
      { name: 'Centurion Payroll™', fee: '2%', description: 'AMEX-powered processing', required: true },
      { name: 'Centurion Tax™', fee: '+2%', description: 'Licensed CPA services', required: false },
      { name: 'Centurion Advisory™', fee: '+1%', description: 'Strategic consulting', required: false },
    ],
  },
  {
    id: 8,
    type: 'unit-economics',
    title: 'Unit Economics',
    subtitle: 'Average customer at 10 employees',
    metrics: [
      { label: 'Avg Payroll/Month', value: '$75,000', growth: null },
      { label: 'Base Revenue (2%)', value: '$1,500/mo', growth: null },
      { label: 'Upsell to Tax+Advisory (60%)', value: '+$2,250/mo', growth: null },
      { label: 'Total ARPU', value: '$3,750/mo', growth: null },
      { label: 'Annual Contract Value', value: '$45,000', highlight: true },
    ],
  },
  {
    id: 9,
    type: 'moat',
    title: 'Defensibility',
    subtitle: 'Three compounding moats',
    moats: [
      { icon: 'CreditCard', title: 'AMEX Partnership', description: 'Exclusive payment rail integration' },
      { icon: 'Shield', title: 'Regulatory Licensing', description: 'Licensed CPAs and advisors in all 50 states' },
      { icon: 'Lock', title: 'Financial Data Moat', description: 'Deep integration into business finance operations' },
    ],
  },
  {
    id: 10,
    type: 'trust',
    title: 'Trust Infrastructure',
    subtitle: 'Bank-grade security & compliance',
    credentials: [
      { label: 'SOC 2 Type II', status: 'Certified' },
      { label: 'PCI DSS Level 1', status: 'Compliant' },
      { label: 'State Licensing', status: '50 States' },
      { label: 'E&O Insurance', status: '$5M Coverage' },
    ],
  },
  {
    id: 11,
    type: 'traction',
    title: 'Early Traction',
    subtitle: 'Pre-launch metrics',
    stats: [
      { value: '1,200+', label: 'Waitlist signups' },
      { value: '47', label: 'Beta customers' },
      { value: '$2.4M', label: 'Monthly payroll volume' },
      { value: '98%', label: 'NPS score' },
    ],
  },
  {
    id: 12,
    type: 'vision-closing',
    title: 'Every Dollar Works Harder',
    subtitle: 'Building the financial operating system for modern businesses',
    cta: 'CLEVIO',
  },
];

export function PitchPage() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextScreen();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevScreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);
  
  const nextScreen = () => {
    if (currentScreen < pitchScreens.length - 1) {
      setDirection('forward');
      setCurrentScreen(currentScreen + 1);
    }
  };
  
  const prevScreen = () => {
    if (currentScreen > 0) {
      setDirection('backward');
      setCurrentScreen(currentScreen - 1);
    }
  };
  
  const goToScreen = (index: number) => {
    setDirection(index > currentScreen ? 'forward' : 'backward');
    setCurrentScreen(index);
  };
  
  const screen = pitchScreens[currentScreen];
  
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      CreditCard,
      Shield,
      Lock,
      TrendingUp,
      DollarSign,
      Users,
      Award,
      Target,
      Zap,
      Globe,
    };
    const Icon = icons[iconName] || Shield;
    return <Icon className="w-12 h-12 text-primary" />;
  };
  
  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Main Screen */}
      <div className="h-screen flex items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] w-full">
          {/* Vision Screen */}
          {screen.type === 'vision' && (
            <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl lg:text-9xl leading-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Payroll is a
                  </span>
                </h1>
                <h1 className="text-6xl md:text-8xl lg:text-9xl leading-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Financial Strategy
                  </span>
                </h1>
                <h1 className="text-6xl md:text-8xl lg:text-9xl leading-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Lever
                  </span>
                </h1>
              </div>
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto">
                {screen.subtitle}
              </p>
            </div>
          )}
          
          {/* Problem Screens */}
          {screen.type === 'problem' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground max-w-3xl">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                {screen.points?.map((point, i) => (
                  <div key={i} className="p-8 bg-accent/30 border border-border rounded-2xl backdrop-blur-sm">
                    <p className="text-2xl">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {screen.type === 'problem-deep' && (
            <div className="text-center space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-8">
                <h2 className="text-8xl md:text-9xl text-primary" style={{ fontWeight: 600, fontFamily: 'CLEVIO, Inter, sans-serif' }}>
                  {screen.title}
                </h2>
                <p className="text-3xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              <p className="text-2xl max-w-3xl mx-auto leading-relaxed">{screen.content}</p>
            </div>
          )}
          
          {/* Solution Screens */}
          {screen.type === 'solution' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="text-center space-y-6">
                <h2 className="text-7xl md:text-8xl text-primary mb-6" style={{ fontWeight: 600, fontFamily: 'CLEVIO, Inter, sans-serif' }}>
                  {screen.title}
                </h2>
                <p className="text-3xl max-w-4xl mx-auto">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {screen.points?.map((point, i) => (
                  <div key={i} className="p-8 bg-gradient-to-br from-accent/30 to-accent/10 border border-primary/30 rounded-2xl backdrop-blur-sm">
                    <p className="text-2xl">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {screen.type === 'solution-visual' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <h2 className="text-5xl md:text-7xl text-center mb-16" style={{ fontWeight: 600 }}>{screen.title}</h2>
              
              <div className="max-w-4xl mx-auto space-y-4">
                {screen.layers?.map((layer, i) => (
                  <div key={i} className="p-8 bg-gradient-to-r from-primary/20 to-primary/5 border-l-4 border-primary rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl mb-2" style={{ fontWeight: 600 }}>{layer.label}</h3>
                        <p className="text-xl text-muted-foreground">{layer.description}</p>
                      </div>
                      <div className="text-6xl text-primary/30" style={{ fontWeight: 600 }}>{i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Market Screen */}
          {screen.type === 'market' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-3xl text-primary">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
                {screen.segments?.map((segment, i) => (
                  <div key={i} className="p-10 bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-primary/30 rounded-2xl space-y-6">
                    <h3 className="text-4xl mb-6" style={{ fontWeight: 600 }}>{segment.name}</h3>
                    {segment.size && (
                      <div>
                        <div className="text-muted-foreground mb-2">Target Size</div>
                        <div className="text-3xl">{segment.size}</div>
                      </div>
                    )}
                    {segment.value && (
                      <div>
                        <div className="text-muted-foreground mb-2">Market Value</div>
                        <div className="text-3xl text-primary" style={{ fontWeight: 600 }}>{segment.value}</div>
                      </div>
                    )}
                    {segment.profile && (
                      <div>
                        <div className="text-muted-foreground mb-2">Decision Maker</div>
                        <div className="text-2xl">{segment.profile}</div>
                      </div>
                    )}
                    {segment.description && (
                      <div>
                        <div className="text-muted-foreground mb-2">Description</div>
                        <div className="text-2xl">{segment.description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Revenue Model */}
          {screen.type === 'revenue' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
                {screen.tiers?.map((tier, i) => (
                  <div key={i} className={`p-8 rounded-2xl border-2 ${tier.required ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-border'}`}>
                    <div className="text-center space-y-6">
                      {tier.required && (
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full mb-4">
                          Required
                        </span>
                      )}
                      <h3 className="text-2xl mb-3" style={{ fontWeight: 600 }}>{tier.name}</h3>
                      <div className="text-6xl text-primary mb-4" style={{ fontWeight: 600 }}>{tier.fee}</div>
                      <p className="text-lg text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Unit Economics */}
          {screen.type === 'unit-economics' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {screen.metrics?.map((metric, i) => (
                  <div key={i} className={`p-8 rounded-2xl border-2 flex items-center justify-between ${
                    metric.highlight 
                      ? 'bg-gradient-to-r from-primary/20 to-primary/5 border-primary' 
                      : 'bg-accent/20 border-border'
                  }`}>
                    <div className="text-2xl text-muted-foreground">{metric.label}</div>
                    <div className={`text-4xl ${metric.highlight ? 'text-primary' : ''}`} style={{ fontWeight: 600 }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Moat */}
          {screen.type === 'moat' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {screen.moats?.map((moat, i) => (
                  <div key={i} className="p-10 bg-gradient-to-br from-accent/30 to-accent/10 border border-primary/30 rounded-2xl text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      {getIcon(moat.icon)}
                    </div>
                    <h3 className="text-3xl" style={{ fontWeight: 600 }}>{moat.title}</h3>
                    <p className="text-xl text-muted-foreground leading-relaxed">{moat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Trust */}
          {screen.type === 'trust' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {screen.credentials?.map((cred, i) => (
                  <div key={i} className="p-10 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-2xl flex items-center justify-between">
                    <div className="text-2xl text-muted-foreground">{cred.label}</div>
                    <div className="text-3xl text-primary" style={{ fontWeight: 600 }}>{cred.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Traction */}
          {screen.type === 'traction' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl mb-4" style={{ fontWeight: 600 }}>{screen.title}</h2>
                <p className="text-2xl text-muted-foreground">{screen.subtitle}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {screen.stats?.map((stat, i) => (
                  <div key={i} className="p-10 bg-gradient-to-br from-accent/30 to-accent/10 border border-primary/30 rounded-2xl text-center space-y-4">
                    <div className="text-6xl text-primary mb-4" style={{ fontWeight: 600 }}>{stat.value}</div>
                    <div className="text-xl text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Closing Vision */}
          {screen.type === 'vision-closing' && (
            <div className="text-center space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="space-y-8">
                <h1 className="text-7xl md:text-9xl leading-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    {screen.title}
                  </span>
                </h1>
                <p className="text-3xl text-muted-foreground max-w-3xl mx-auto">{screen.subtitle}</p>
              </div>
              
              <div className="pt-12">
                <div className="text-7xl md:text-8xl text-primary mb-8" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                  {screen.cta}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-6 py-4 bg-card/80 backdrop-blur-xl border border-border rounded-full">
          <button
            onClick={prevScreen}
            disabled={currentScreen === 0}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {pitchScreens.map((_, i) => (
              <button
                key={i}
                onClick={() => goToScreen(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentScreen 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextScreen}
            disabled={currentScreen === pitchScreens.length - 1}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Screen Counter */}
      <div className="fixed top-8 right-8 text-sm text-muted-foreground font-mono">
        {String(currentScreen + 1).padStart(2, '0')} / {String(pitchScreens.length).padStart(2, '0')}
      </div>
      
      {/* Keyboard Hint */}
      <div className="fixed bottom-8 right-8 text-xs text-muted-foreground hidden md:block">
        Use ← → or Space to navigate
      </div>
    </div>
  );
}
