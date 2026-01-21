import { BaseModal } from './base-modal';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  timestamp?: string;
  referenceNumber?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  timestamp,
  referenceNumber,
  actionLabel = 'Done',
  onAction,
}: SuccessModalProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };
  
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-8 md:p-12 text-center">
        {/* Success Icon with Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
            
            {/* Icon */}
            <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl mb-4">{title}</h2>
        
        {/* Message */}
        {message && (
          <p className="text-lg text-muted-foreground mb-8">
            {message}
          </p>
        )}
        
        {/* Details */}
        {(timestamp || referenceNumber) && (
          <div className="mb-8 p-6 bg-accent rounded-xl space-y-3">
            {timestamp && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processed At</span>
                <span style={{ fontWeight: 600 }}>{timestamp}</span>
              </div>
            )}
            
            {referenceNumber && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reference Number</span>
                <span style={{ fontWeight: 600 }} className="font-mono">
                  {referenceNumber}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <button
          onClick={handleAction}
          className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
        >
          {actionLabel}
        </button>
      </div>
    </BaseModal>
  );
}
