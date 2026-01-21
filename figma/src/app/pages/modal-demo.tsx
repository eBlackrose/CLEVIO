import { useState } from 'react';
import { 
  PayrollConfirmationModal, 
  SuccessModal, 
  ErrorModal, 
  CommitmentModal 
} from '../components/modals';

export function ModalDemoPage() {
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  
  const samplePayrollData = {
    amount: '$15,250.00',
    employeeCount: 8,
    amexLast4: '1234',
    fees: {
      payroll: '$305.00',
      tax: '$305.00',
      advisory: '$152.50',
    },
    totalFee: '$762.50',
    date: 'December 31, 2025',
  };
  
  const handlePayrollConfirm = () => {
    setShowPayrollModal(false);
    // Simulate processing delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };
  
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl mb-4">CLEVIO Modal System</h1>
          <p className="text-muted-foreground">
            Reusable confirmation and notification modals for financial actions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Payroll Confirmation */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-3">Payroll Confirmation</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Shows payment details, fee breakdown, and AMEX card information
            </p>
            <button
              onClick={() => setShowPayrollModal(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              View Modal
            </button>
          </div>
          
          {/* Success Modal */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-3">Success State</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Confirms successful completion with timestamp and reference number
            </p>
            <button
              onClick={() => setShowSuccessModal(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              View Modal
            </button>
          </div>
          
          {/* Error Modal */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-3">Error State</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Displays errors with calm explanation and action to resolve
            </p>
            <button
              onClick={() => setShowErrorModal(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              View Modal
            </button>
          </div>
          
          {/* Warning Modal */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-3">Warning State</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Shows warnings or blocked states with helpful guidance
            </p>
            <button
              onClick={() => setShowWarningModal(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              View Modal
            </button>
          </div>
          
          {/* Commitment Modal */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-3">Service Commitment</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Discloses 6-month commitment terms before service activation
            </p>
            <button
              onClick={() => setShowCommitmentModal(true)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              View Modal
            </button>
          </div>
        </div>
        
        {/* Design System Notes */}
        <div className="mt-12 p-8 bg-card border border-border rounded-xl">
          <h2 className="text-2xl mb-6">Modal Design System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="mb-4" style={{ fontWeight: 600 }}>Visual Features</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Dark overlay with backdrop blur for focus</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Centered cards with large typography</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Smooth animations on enter/exit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Minimal copy, maximum clarity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Mobile-responsive with full-screen on small devices</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4" style={{ fontWeight: 600 }}>Usage Guidelines</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use PayrollConfirmationModal for payment confirmations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>SuccessModal shows completion with reference numbers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>ErrorModal for blocked states with resolution actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>CommitmentModal for service agreements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>All modals prevent body scroll when open</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Instances */}
      <PayrollConfirmationModal
        isOpen={showPayrollModal}
        onClose={() => setShowPayrollModal(false)}
        onConfirm={handlePayrollConfirm}
        data={samplePayrollData}
      />
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Payroll Successfully Processed"
        message="All payments have been submitted and will be distributed to employees within 1-2 business days."
        timestamp={new Date().toLocaleString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })}
        referenceNumber="CLV-2025-12-21-847392"
        actionLabel="Return to Dashboard"
      />
      
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Minimum Employees Required"
        message="You currently have 3 team members. A minimum of 5 employees or contractors is required to run payroll and access advisory services."
        actionLabel="Add Team Members"
        onAction={() => {
          setShowErrorModal(false);
          // Navigate to employees page
        }}
        severity="error"
      />
      
      <ErrorModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="AMEX Card Verification Required"
        message="Please verify your American Express card to continue processing payroll. This is a one-time security measure to protect your account."
        actionLabel="Verify Card"
        onAction={() => {
          setShowWarningModal(false);
          // Navigate to payment settings
        }}
        severity="warning"
      />
      
      <CommitmentModal
        isOpen={showCommitmentModal}
        onClose={() => setShowCommitmentModal(false)}
        onAccept={() => {
          setShowCommitmentModal(false);
          // Activate service
        }}
        serviceName="Centurion Tax™"
        fee="+2%"
        commitmentMonths={6}
      />
    </div>
  );
}
