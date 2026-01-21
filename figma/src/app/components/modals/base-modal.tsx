import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BaseModal({ 
  isOpen, 
  onClose, 
  children, 
  showClose = true,
  size = 'md' 
}: BaseModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Dark Overlay */}
        <Dialog.Overlay 
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        />
        
        {/* Modal Content */}
        <Dialog.Content 
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] md:w-full ${sizeClasses[size]} data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}
          aria-describedby={undefined}
        >
          {/* Hidden title for accessibility */}
          <Dialog.Title className="sr-only">Modal</Dialog.Title>
          
          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {showClose && (
              <Dialog.Close asChild>
                <button 
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-accent hover:bg-accent/70 flex items-center justify-center transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            )}
            
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}