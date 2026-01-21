import { BaseModal } from './base-modal';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  actionLabel,
  onAction,
  severity = 'error',
}: ErrorModalProps) {
  const severityStyles = {
    error: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      borderColor: 'border-destructive/30',
    },
    warning: {
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-500/30',
    },
    info: {
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/30',
    },
  };
  
  const style = severityStyles[severity];
  
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-8 md:p-12 text-center">
        {/* Error Icon */}
        <div className={`w-20 h-20 rounded-full ${style.iconBg} flex items-center justify-center mx-auto mb-6`}>
          <AlertCircle className={`w-12 h-12 ${style.iconColor}`} strokeWidth={2.5} />
        </div>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl mb-4">{title}</h2>
        
        {/* Message */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full px-8 py-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
          >
            {actionLabel && onAction ? 'Cancel' : 'Dismiss'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
