import { BaseModal } from './base-modal';
import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react';

interface PayrollData {
  amount: string;
  employeeCount: number;
  amexLast4: string;
  fees: {
    payroll: string;
    tax?: string;
    advisory?: string;
  };
  totalFee: string;
  date: string;
}

interface PayrollConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PayrollData;
  isProcessing?: boolean;
}

export function PayrollConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  data,
  isProcessing = false,
}: PayrollConfirmationModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showClose={!isProcessing}>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-3">Confirm Payroll</h2>
          <p className="text-muted-foreground">
            Review details before processing payment
          </p>
        </div>
        
        {/* Amount Card */}
        <div className="mb-8 p-6 bg-gradient-to-br from-accent to-accent/50 rounded-xl text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Payroll Amount</div>
          <div className="text-5xl mb-2" style={{ fontWeight: 600 }}>
            {data.amount}
          </div>
          <div className="text-sm text-muted-foreground">
            Payment Date: {data.date}
          </div>
        </div>
        
        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Employees */}
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">Employees Included</span>
            </div>
            <span style={{ fontWeight: 600 }}>{data.employeeCount}</span>
          </div>
          
          {/* AMEX Card */}
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-sm">Payment Method</span>
            </div>
            <span style={{ fontWeight: 600 }}>AMEX ••{data.amexLast4}</span>
          </div>
        </div>
        
        {/* Fee Breakdown */}
        <div className="mb-8 p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg">Fee Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Centurion Payroll (2%)</span>
              <span>{data.fees.payroll}</span>
            </div>
            
            {data.fees.tax && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Centurion Tax (+2%)</span>
                <span>{data.fees.tax}</span>
              </div>
            )}
            
            {data.fees.advisory && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Centurion Advisory (+1%)</span>
                <span>{data.fees.advisory}</span>
              </div>
            )}
            
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span style={{ fontWeight: 600 }}>Total Fees</span>
              <span className="text-lg text-primary" style={{ fontWeight: 600 }}>{data.totalFee}</span>
            </div>
          </div>
        </div>
        
        {/* Grand Total */}
        <div className="mb-8 p-6 bg-primary/10 border-2 border-primary/30 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-lg">Total Charge to AMEX</span>
            <span className="text-2xl text-primary" style={{ fontWeight: 600 }}>
              ${(parseFloat(data.amount.replace(/[$,]/g, '')) + parseFloat(data.totalFee.replace(/[$,]/g, ''))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Confirm & Run Payroll'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
