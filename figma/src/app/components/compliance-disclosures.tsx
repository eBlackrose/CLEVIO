import { useState } from 'react';
import { Info, Shield, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { complianceCopy } from '../utils/compliance-copy';

/**
 * Compliance Disclosure Components
 * 
 * These components display legally required disclaimers and disclosures
 * in appropriate contexts throughout the application.
 */

// ============================================================================
// COMPLIANCE FOOTER
// ============================================================================

interface ComplianceFooterProps {
  variant?: 'short' | 'full';
}

export function ComplianceFooter({ variant = 'short' }: ComplianceFooterProps) {
  const [showFull, setShowFull] = useState(false);
  
  if (variant === 'full' || showFull) {
    return (
      <div className="py-8 px-6 bg-accent/30 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            {complianceCopy.disclaimers.footer.full.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
            <a href="/compliance" className="hover:text-foreground transition-colors">
              Complete Disclosures
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <span>© {new Date().getFullYear()} CLEVIO Financial Services, LLC</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-6 bg-accent/30 border-t border-border">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {complianceCopy.disclaimers.footer.short}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <button 
            onClick={() => setShowFull(true)}
            className="hover:text-foreground transition-colors underline"
          >
            View Full Disclosures
          </button>
          <span>•</span>
          <a href="/compliance" className="hover:text-foreground transition-colors">
            Compliance
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <span>•</span>
          <span>© {new Date().getFullYear()} CLEVIO Financial Services, LLC</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AMEX REWARDS DISCLAIMER
// ============================================================================

interface AmexDisclaimerProps {
  variant?: 'inline' | 'tooltip' | 'calculation';
  context?: 'pricing' | 'dashboard' | 'onboarding';
}

export function AmexDisclaimer({ variant = 'inline', context = 'pricing' }: AmexDisclaimerProps) {
  if (variant === 'tooltip') {
    return (
      <div className="max-w-xs text-xs leading-relaxed">
        {complianceCopy.disclaimers.amexRewards.tooltip}
      </div>
    );
  }
  
  if (variant === 'calculation') {
    return (
      <div className="p-4 bg-accent/50 border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {complianceCopy.disclaimers.amexRewards.calculations}
          </p>
        </div>
      </div>
    );
  }
  
  // Inline variant
  return (
    <div className="flex items-start gap-2 p-3 bg-accent/30 rounded-lg">
      <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <p className="text-sm text-muted-foreground leading-relaxed">
        {complianceCopy.disclaimers.amexRewards.inline}
      </p>
    </div>
  );
}

// ============================================================================
// NOT-A-BANK NOTICE
// ============================================================================

export function NotABankNotice() {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Important: CLEVIO is Not a Bank
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {complianceCopy.positioning.bankingServices.approved}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUBSCRIPTION CONFIRMATION MODAL
// ============================================================================

interface SubscriptionConfirmationProps {
  serviceType: 'payroll' | 'tax' | 'advisory' | 'amex';
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function SubscriptionConfirmationModal({ 
  serviceType, 
  onConfirm, 
  onCancel, 
  isOpen 
}: SubscriptionConfirmationProps) {
  const [acknowledged, setAcknowledged] = useState<boolean[]>([]);
  
  if (!isOpen) return null;
  
  const getDisclosure = () => {
    if (serviceType === 'amex') {
      return complianceCopy.subscriptionDisclosures.amexActivation;
    }
    return complianceCopy.subscriptionDisclosures.beforeActivation;
  };
  
  const disclosure = getDisclosure();
  const isServiceAgreement = serviceType !== 'amex';
  const allAcknowledged = isServiceAgreement 
    ? acknowledged.length === complianceCopy.subscriptionDisclosures.beforeActivation.items.length &&
      acknowledged.every(item => item === true)
    : acknowledged[0] === true;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-6">
          <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl mb-2">{disclosure.title}</h3>
            <p className="text-sm text-muted-foreground">
              Please review and acknowledge the following before continuing
            </p>
          </div>
        </div>
        
        {isServiceAgreement ? (
          <div className="space-y-4 mb-8">
            {complianceCopy.subscriptionDisclosures.beforeActivation.items.map((item, index) => (
              <label 
                key={index}
                className="flex items-start gap-3 p-4 bg-accent/30 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={acknowledged[index] || false}
                  onChange={(e) => {
                    const newAcknowledged = [...acknowledged];
                    newAcknowledged[index] = e.target.checked;
                    setAcknowledged(newAcknowledged);
                  }}
                  className="mt-0.5 w-5 h-5 rounded border-border"
                />
                <span className="text-sm leading-relaxed flex-1">{item}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <div className="p-4 bg-accent/30 rounded-lg mb-4">
              <p className="text-sm leading-relaxed">
                {disclosure.content}
              </p>
            </div>
            
            <label className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged[0] || false}
                onChange={(e) => setAcknowledged([e.target.checked])}
                className="mt-0.5 w-5 h-5 rounded border-border"
              />
              <span className="text-sm font-medium">
                {disclosure.acknowledgment}
              </span>
            </label>
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!allAcknowledged}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm & Continue
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          By continuing, you agree to CLEVIO's{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// TRUST BADGE WITH DISCLAIMER
// ============================================================================

interface TrustBadgeWithDisclaimerProps {
  type: 'soc2' | 'pciDss' | 'encryption' | 'cpaLicensing' | 'insurance' | 'fiduciary' | 'notABank';
  showDisclaimer?: boolean;
}

export function TrustBadgeWithDisclaimer({ type, showDisclaimer = false }: TrustBadgeWithDisclaimerProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getBadgeInfo = () => {
    switch (type) {
      case 'soc2':
        return complianceCopy.trustIndicators.security.soc2;
      case 'pciDss':
        return complianceCopy.trustIndicators.security.pciDss;
      case 'encryption':
        return complianceCopy.trustIndicators.security.encryption;
      case 'cpaLicensing':
        return complianceCopy.trustIndicators.professional.cpaLicensing;
      case 'insurance':
        return complianceCopy.trustIndicators.professional.insurance;
      case 'fiduciary':
        return complianceCopy.trustIndicators.professional.fiduciary;
      case 'notABank':
        return complianceCopy.trustIndicators.regulatory.notABank;
      default:
        return complianceCopy.trustIndicators.security.soc2;
    }
  };
  
  const badge = getBadgeInfo();
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all text-left group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-1">{badge.label}</div>
            <div className="text-sm text-muted-foreground">{badge.description}</div>
          </div>
          <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </button>
      
      {showDetails && showDisclaimer && (
        <div className="mt-2 p-3 bg-accent/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {badge.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAX SERVICE JURISDICTIONAL NOTICE
// ============================================================================

export function TaxJurisdictionalNotice() {
  return (
    <div className="p-4 bg-accent/30 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-2">Tax Services & Licensing</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{complianceCopy.disclaimers.taxServices.jurisdictional}</p>
            <p>{complianceCopy.disclaimers.taxServices.scope}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADVISORY SCOPE NOTICE
// ============================================================================

export function AdvisoryScopeNotice() {
  return (
    <div className="p-4 bg-accent/30 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-2">Advisory Services Scope</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{complianceCopy.disclaimers.advisoryServices.scope}</p>
            <p>{complianceCopy.disclaimers.advisoryServices.notInvestmentAdvice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INLINE COMPLIANCE TOOLTIP
// ============================================================================

interface ComplianceTooltipProps {
  type: 'amexEarnings' | 'taxSavings' | 'licensedProfessionals' | 'fdicInsurance' | 'fiduciaryDuty' | 'professionalLiability' | 'soc2Certification';
  children: React.ReactNode;
}

export function ComplianceTooltip({ type, children }: ComplianceTooltipProps) {
  const content = complianceCopy.tooltipDisclaimers[type];
  
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-72 z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground"></div>
      </div>
    </div>
  );
}

// ============================================================================
// AMEX NO-AFFILIATION NOTICE
// ============================================================================

export function AmexNoAffiliationNotice() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Info className="w-3 h-3 flex-shrink-0" />
      <span>{complianceCopy.positioning.amexRelationship.approved}</span>
    </div>
  );
}

// ============================================================================
// DATA OWNERSHIP NOTICE
// ============================================================================

export function DataOwnershipNotice() {
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-green-900 dark:text-green-100 mb-2">
            You Own Your Data
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
            <p>{complianceCopy.disclaimers.dataPrivacy.ownership}</p>
            <p>{complianceCopy.disclaimers.dataPrivacy.sharing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
