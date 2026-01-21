import { ReactNode, useState } from 'react';
import { Info, ChevronDown, Shield, FileText, Lock, Award } from 'lucide-react';

interface InlineDisclosureProps {
  children: ReactNode;
  className?: string;
}

export function InlineDisclosure({ children, className = '' }: InlineDisclosureProps) {
  return (
    <div className={`text-sm text-muted-foreground leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

interface ExpandableDisclosureProps {
  title: string;
  summary?: string;
  children: ReactNode;
  icon?: 'info' | 'shield' | 'file' | 'lock' | 'award';
  defaultExpanded?: boolean;
}

export function ExpandableDisclosure({ 
  title, 
  summary, 
  children, 
  icon = 'info',
  defaultExpanded = false 
}: ExpandableDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const icons = {
    info: Info,
    shield: Shield,
    file: FileText,
    lock: Lock,
    award: Award,
  };
  
  const Icon = icons[icon];
  
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 lg:p-6 flex items-start gap-4 hover:bg-accent/50 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-2" style={{ fontWeight: 600 }}>{title}</h3>
              {summary && !isExpanded && (
                <p className="text-sm text-muted-foreground">{summary}</p>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-2 border-t border-border">
          <div className="pl-14 text-sm leading-relaxed text-muted-foreground space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface LearnMoreProps {
  children: ReactNode;
  triggerText?: string;
}

export function LearnMore({ children, triggerText = 'Learn more' }: LearnMoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="inline">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary hover:underline text-sm inline-flex items-center gap-1"
      >
        {triggerText}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-accent/50 rounded-lg border border-border text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

interface TrustBadgeProps {
  icon: 'shield' | 'lock' | 'award' | 'file';
  label: string;
  description: string;
}

export function TrustBadge({ icon, label, description }: TrustBadgeProps) {
  const icons = {
    shield: Shield,
    lock: Lock,
    award: Award,
    file: FileText,
  };
  
  const Icon = icons[icon];
  
  return (
    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="mb-1" style={{ fontWeight: 600 }}>{label}</div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface DisclaimerBoxProps {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'subtle';
}

export function DisclaimerBox({ children, title, variant = 'default' }: DisclaimerBoxProps) {
  return (
    <div className={`p-5 lg:p-6 rounded-xl border ${
      variant === 'subtle' 
        ? 'bg-accent/30 border-border' 
        : 'bg-card border-border'
    }`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-primary" />
          <h4 style={{ fontWeight: 600 }}>{title}</h4>
        </div>
      )}
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

interface LegalFooterProps {
  compact?: boolean;
}

export function LegalFooter({ compact = false }: LegalFooterProps) {
  return (
    <div className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed space-y-3`}>
      <p>
        CLEVIO is a financial services platform operated by CLEVIO Financial Services, LLC. 
        CLEVIO is not a bank. Banking services are provided by our partner financial institutions, 
        Members FDIC.
      </p>
      
      {!compact && (
        <>
          <p>
            Tax advisory services are provided by licensed CPAs and tax professionals. 
            Financial advisory services are provided by licensed financial advisors. 
            All professionals maintain appropriate state licensing and insurance coverage.
          </p>
          
          <p>
            CLEVIO operates with SOC 2 Type II certification and maintains PCI DSS Level 1 compliance. 
            Professional liability insurance coverage of $5,000,000 is maintained for all advisory services.
          </p>
        </>
      )}
    </div>
  );
}
