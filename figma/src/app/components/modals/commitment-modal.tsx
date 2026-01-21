import { BaseModal } from './base-modal';
import { Lock, AlertCircle, Check } from 'lucide-react';

interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  serviceName: string;
  fee: string;
  commitmentMonths?: number;
}

export function CommitmentModal({
  isOpen,
  onClose,
  onAccept,
  serviceName,
  fee,
  commitmentMonths = 6,
}: CommitmentModalProps) {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + commitmentMonths);
  
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-3">Service Commitment</h2>
          <p className="text-muted-foreground">
            Review the terms before activating
          </p>
        </div>
        
        {/* Service Card */}
        <div className="mb-8 p-6 bg-gradient-to-br from-accent to-accent/50 border border-border rounded-xl">
          <div className="text-center mb-4">
            <h3 className="text-2xl mb-2">{serviceName}</h3>
            <div className="text-4xl text-primary" style={{ fontWeight: 600 }}>{fee}</div>
            <p className="text-sm text-muted-foreground mt-2">per payroll cycle</p>
          </div>
        </div>
        
        {/* Commitment Details */}
        <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="mb-2" style={{ fontWeight: 600 }}>
                {commitmentMonths}-Month Minimum Commitment
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By activating this service, you agree to maintain it for a minimum of {commitmentMonths} months. 
                Your commitment period will end on <strong>{endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Terms List */}
        <div className="mb-8 space-y-3">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              You will be charged the {fee} fee on each payroll cycle
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Service cannot be canceled during the {commitmentMonths}-month commitment period
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              After {commitmentMonths} months, service converts to month-to-month billing
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              You may cancel anytime after the commitment period ends
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Accept & Activate
          </button>
        </div>
        
        {/* Fine Print */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By accepting, you agree to CLEVIO's Terms of Service and understand the commitment period.
        </p>
      </div>
    </BaseModal>
  );
}
