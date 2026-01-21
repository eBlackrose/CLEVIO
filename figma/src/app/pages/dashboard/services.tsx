import { useState, useEffect } from 'react';
import { Check, Lock } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { toast } from 'sonner';
import { useUser } from '../../contexts/user-context';
import { CommitmentModal } from '../../components/modals';

interface Service {
  id: string;
  name: string;
  description: string;
  fee: string;
  features: string[];
  active: boolean;
  commitment: string;
  startDate?: string;
}

export function ServicesPage() {
  const { userData, updateUserData } = useUser();
  
  const [services, setServices] = useState<Service[]>([
    {
      id: 'payroll',
      name: 'Centurion Payroll™',
      description: 'AMEX-powered payroll processing for your team',
      fee: '2%',
      features: [
        'Payroll processing via AMEX',
        'Employee & contractor management',
        'Automated tax withholdings',
        'Direct deposit & payment tracking',
      ],
      active: userData?.selectedTiers?.payroll || true,
      commitment: '6-Month Commitment',
      startDate: 'Nov 1, 2025',
    },
    {
      id: 'tax',
      name: 'Centurion Tax™',
      description: 'Tax preparation and strategic planning',
      fee: '+2%',
      features: [
        'Tax preparation by licensed CPAs',
        'Ongoing tax strategy & optimization',
        'Quarterly tax planning sessions',
        'IRS audit support',
      ],
      active: userData?.selectedTiers?.tax || false,
      commitment: '6-Month Commitment',
    },
    {
      id: 'advisory',
      name: 'Centurion Advisory™',
      description: 'Strategic financial consulting and planning',
      fee: '+1%',
      features: [
        'Financial planning & analysis',
        'Strategic advisory sessions',
        'Cash flow optimization',
        'Growth strategy consulting',
      ],
      active: userData?.selectedTiers?.advisory || false,
      commitment: '6-Month Commitment',
    },
  ]);
  
  // Sync services with userData
  useEffect(() => {
    setServices(prev => prev.map(service => {
      if (service.id === 'payroll') return { ...service, active: userData?.selectedTiers?.payroll || true };
      if (service.id === 'tax') return { ...service, active: userData?.selectedTiers?.tax || false };
      if (service.id === 'advisory') return { ...service, active: userData?.selectedTiers?.advisory || false };
      return service;
    }));
  }, [userData?.selectedTiers]);
  
  const [pendingService, setPendingService] = useState<Service | null>(null);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  
  const totalFee = services.reduce((sum, service) => {
    if (!service.active) return sum;
    const feeNum = parseInt(service.fee.replace(/[^0-9]/g, ''));
    return sum + feeNum;
  }, 0);
  
  const toggleService = (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    
    // If service is active and under commitment, cannot disable
    if (service.active && service.commitment.includes('6-Month')) {
      return;
    }
    
    // If activating, show commitment modal
    if (!service.active) {
      setPendingService(service);
      setShowCommitmentModal(true);
    } else {
      // Deactivate directly if no commitment
      setServices(services.map(s => 
        s.id === id ? { ...s, active: false } : s
      ));
    }
  };
  
  const handleCommitmentAccept = () => {
    if (pendingService) {
      const updatedServices = services.map(s => 
        s.id === pendingService.id 
          ? { ...s, active: true, startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } 
          : s
      );
      setServices(updatedServices);
      
      // Update user context
      updateUserData({
        selectedTiers: {
          payroll: updatedServices.find(s => s.id === 'payroll')?.active || true,
          tax: updatedServices.find(s => s.id === 'tax')?.active || false,
          advisory: updatedServices.find(s => s.id === 'advisory')?.active || false,
        }
      });
      
      toast.success(`${pendingService.name} activated successfully`);
    }
    setShowCommitmentModal(false);
    setPendingService(null);
  };
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Services & Subscriptions</h1>
          <p className="text-muted-foreground">Manage your Centurion tier subscriptions</p>
        </div>
        
        {/* Total Fee Card */}
        <div className="mb-8 p-8 bg-gradient-to-br from-card to-accent border-2 border-primary/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg text-muted-foreground mb-2">Your Total Monthly Rate</h3>
              <div className="text-5xl mb-4" style={{ fontWeight: 600 }}>{totalFee}%</div>
              <p className="text-sm text-muted-foreground">
                {services.filter(s => s.active).length} active tier{services.filter(s => s.active).length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        {/* Service Cards */}
        <div className="space-y-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`p-8 border-2 rounded-2xl transition-all ${
                service.active 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl">{service.name}</h3>
                    {service.active && service.commitment.includes('6-Month') && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Under Contract
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm mb-6">
                    <div>
                      <span className="text-muted-foreground">Fee: </span>
                      <span className="text-primary" style={{ fontWeight: 600 }}>{service.fee}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Commitment: </span>
                      <span>{service.commitment}</span>
                    </div>
                    {service.startDate && (
                      <div>
                        <span className="text-muted-foreground">Start Date: </span>
                        <span>{service.startDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Switch.Root
                  checked={service.active}
                  onCheckedChange={() => toggleService(service.id)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    service.active ? 'bg-primary' : 'bg-muted'
                  }`}
                  disabled={service.active && service.commitment.includes('6-Month')}
                >
                  <Switch.Thumb className="block w-6 h-6 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-7" />
                </Switch.Root>
              </div>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {service.active && service.commitment.includes('6-Month') && (
                <div className="mt-6 p-4 bg-accent/50 rounded-lg flex items-start gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This service is under a 6-month commitment and cannot be disabled until {new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Commitment Modal */}
      {pendingService && (
        <CommitmentModal
          isOpen={showCommitmentModal}
          onClose={() => {
            setShowCommitmentModal(false);
            setPendingService(null);
          }}
          onAccept={handleCommitmentAccept}
          serviceName={pendingService.name}
          fee={pendingService.fee}
          commitmentMonths={6}
        />
      )}
    </div>
  );
}