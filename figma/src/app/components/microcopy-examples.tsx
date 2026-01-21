import { AlertCircle, Info, Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { microcopy } from '../utils/microcopy';

/**
 * Microcopy Component Examples
 * Demonstrates how to implement CLEVIO's microcopy system in UI components
 */

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 text-center z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground"></div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR MESSAGE COMPONENT
// ============================================================================

interface ErrorMessageProps {
  error: {
    message: string;
    resolution: string;
  };
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-red-900 dark:text-red-100 mb-1">
            {error.message}
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">
            {error.resolution}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOCKED STATE COMPONENT
// ============================================================================

interface LockedStateProps {
  lockedState: {
    title: string;
    description: string;
    action: string;
  };
  onAction: () => void;
}

export function LockedState({ lockedState, onAction }: LockedStateProps) {
  return (
    <div className="p-8 bg-accent/30 border border-border rounded-xl text-center">
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl mb-3">{lockedState.title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
        {lockedState.description}
      </p>
      <button
        onClick={onAction}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        {lockedState.action}
      </button>
    </div>
  );
}

// ============================================================================
// HELPER TEXT WITH TOOLTIP
// ============================================================================

interface FieldWithHelperProps {
  label: string;
  helperText: string;
  tooltipText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWithHelper({ label, helperText, tooltipText, required, children }: FieldWithHelperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
          </Tooltip>
        )}
      </div>
      {children}
      <p className="text-xs text-muted-foreground">{helperText}</p>
    </div>
  );
}

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

interface EmptyStateProps {
  emptyState: {
    title: string;
    description: string;
    action: string | null;
  };
  onAction?: () => void;
}

export function EmptyState({ emptyState, onAction }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl mb-3">{emptyState.title}</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        {emptyState.description}
      </p>
      {emptyState.action && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {emptyState.action}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// SUCCESS MESSAGE COMPONENT
// ============================================================================

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-green-900 dark:text-green-100">
            {message}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LOADING STATE COMPONENT
// ============================================================================

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Loader2 className="w-5 h-5 text-primary animate-spin" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}

// ============================================================================
// CONFIRMATION DIALOG COMPONENT
// ============================================================================

interface ConfirmationDialogProps {
  confirmation: {
    title: string;
    message: string;
    confirm: string;
    cancel: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function ConfirmationDialog({ confirmation, onConfirm, onCancel, isOpen }: ConfirmationDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl mb-4">{confirmation.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {confirmation.message}
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
          >
            {confirmation.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {confirmation.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE USAGE PAGE
// ============================================================================

export function MicrocopyExamplesPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl mb-4">CLEVIO Microcopy System</h1>
          <p className="text-xl text-muted-foreground">
            Examples of consistent, trust-building copy throughout the application
          </p>
        </div>
        
        {/* Buttons */}
        <section>
          <h2 className="text-2xl mb-6">Button Copy</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {microcopy.buttons.createAccount}
              </button>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {microcopy.buttons.addAmexCard}
              </button>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {microcopy.buttons.confirmPayroll}
              </button>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {microcopy.buttons.scheduleAdvisory}
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                {microcopy.buttons.cancel}
              </button>
              <button className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                {microcopy.buttons.reviewLater}
              </button>
              <button className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                {microcopy.buttons.notNow}
              </button>
            </div>
          </div>
        </section>
        
        {/* Error States */}
        <section>
          <h2 className="text-2xl mb-6">Error Messages</h2>
          <div className="space-y-4">
            <ErrorMessage error={microcopy.errors.cardDeclined} />
            <ErrorMessage error={microcopy.errors.employeeMissingBankInfo} />
            <ErrorMessage error={microcopy.errors.invalidCredentials} />
          </div>
        </section>
        
        {/* Locked States */}
        <section>
          <h2 className="text-2xl mb-6">Locked States</h2>
          <div className="space-y-6">
            <LockedState 
              lockedState={microcopy.lockedStates.minimumEmployees}
              onAction={() => console.log('Add employees')}
            />
            <LockedState 
              lockedState={microcopy.lockedStates.requiresTaxTier}
              onAction={() => console.log('Add tax service')}
            />
          </div>
        </section>
        
        {/* Form Fields with Helper Text & Tooltips */}
        <section>
          <h2 className="text-2xl mb-6">Helper Text & Tooltips</h2>
          <div className="space-y-6">
            <FieldWithHelper
              label="American Express Card Number"
              helperText={microcopy.helperText.amexCardNumber}
              tooltipText={microcopy.tooltips.whyAmexRequired}
              required
            >
              <input
                type="text"
                placeholder="XXXX XXXXXX XXXXX"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg"
              />
            </FieldWithHelper>
            
            <FieldWithHelper
              label="Business EIN"
              helperText={microcopy.helperText.businessEIN}
              tooltipText={microcopy.tooltips.minimumEmployees}
              required
            >
              <input
                type="text"
                placeholder="XX-XXXXXXX"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg"
              />
            </FieldWithHelper>
            
            <FieldWithHelper
              label="Monthly Payroll Volume"
              helperText="Your total monthly employee payroll before taxes"
              tooltipText={microcopy.tooltips.serviceFeePricing}
            >
              <input
                type="text"
                placeholder="$75,000"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg"
              />
            </FieldWithHelper>
          </div>
        </section>
        
        {/* Empty States */}
        <section>
          <h2 className="text-2xl mb-6">Empty States</h2>
          <div className="bg-card border border-border rounded-xl">
            <EmptyState 
              emptyState={microcopy.emptyStates.noEmployees}
              onAction={() => console.log('Add employee')}
            />
          </div>
        </section>
        
        {/* Success Messages */}
        <section>
          <h2 className="text-2xl mb-6">Success Messages</h2>
          <div className="space-y-4">
            <SuccessMessage message={microcopy.success.employeeAdded} />
            <SuccessMessage message={microcopy.success.amexCardVerified} />
            <SuccessMessage message={microcopy.success.payrollProcessed} />
          </div>
        </section>
        
        {/* Loading States */}
        <section>
          <h2 className="text-2xl mb-6">Loading States</h2>
          <div className="space-y-4 bg-card border border-border rounded-xl p-6">
            <LoadingState message={microcopy.loading.processingPayroll} />
            <LoadingState message={microcopy.loading.verifyingCard} />
            <LoadingState message={microcopy.loading.calculatingTaxes} />
          </div>
        </section>
        
        {/* Confirmation Dialogs */}
        <section>
          <h2 className="text-2xl mb-6">Confirmation Dialogs</h2>
          <p className="text-muted-foreground mb-4">
            Example confirmation copy (dialog not shown - see microcopy.ts for full text):
          </p>
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <div>
              <div className="font-semibold mb-2">Process Payroll:</div>
              <div className="text-sm text-muted-foreground">
                "{microcopy.confirmations.processPayroll.message}"
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Switch Payment Method:</div>
              <div className="text-sm text-muted-foreground">
                "{microcopy.confirmations.switchPaymentMethod.message}"
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
