import { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, Calendar as CalendarIcon, CreditCard, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/user-context';
import * as Dialog from '@radix-ui/react-dialog';
import { addWeeks, addDays, format, isBefore, startOfDay, isAfter } from 'date-fns';

interface PayrollSchedule {
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly/bi-weekly
  dayOfMonth?: number; // 1-31 for monthly
}

export function PayrollPage() {
  const { userData, updateUserData } = useUser();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payrollSchedule, setPayrollSchedule] = useState<PayrollSchedule>({
    frequency: 'bi-weekly',
    dayOfWeek: 5, // Friday
  });
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const employeeCount = userData?.employees?.length || 0;
  const hasMinimum = employeeCount >= 5;
  const hasAmex = !!userData?.amexCard?.last4;
  const canRunPayroll = hasMinimum && hasAmex;
  
  // Calculate minimum allowed date (2 weeks from today)
  const today = startOfDay(new Date());
  const minDate = addWeeks(today, 2);
  
  // Calculate next payroll date based on schedule
  useEffect(() => {
    if (!selectedDate) {
      const nextDate = calculateNextPayrollDate();
      setSelectedDate(nextDate);
    }
  }, [payrollSchedule]);
  
  const calculateNextPayrollDate = (): Date => {
    const baseDate = addWeeks(new Date(), 2); // Start at min 2 weeks
    
    if (payrollSchedule.frequency === 'weekly' && payrollSchedule.dayOfWeek !== undefined) {
      let date = baseDate;
      while (date.getDay() !== payrollSchedule.dayOfWeek) {
        date = addDays(date, 1);
      }
      return date;
    } else if (payrollSchedule.frequency === 'bi-weekly' && payrollSchedule.dayOfWeek !== undefined) {
      let date = baseDate;
      while (date.getDay() !== payrollSchedule.dayOfWeek) {
        date = addDays(date, 1);
      }
      return date;
    } else if (payrollSchedule.frequency === 'monthly' && payrollSchedule.dayOfMonth) {
      const nextMonth = new Date(baseDate);
      nextMonth.setDate(payrollSchedule.dayOfMonth);
      if (isBefore(nextMonth, baseDate)) {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }
      return nextMonth;
    }
    
    return baseDate;
  };
  
  const validateDate = (date: Date): boolean => {
    return !isBefore(startOfDay(date), minDate);
  };
  
  const handleDateSelect = (date: Date) => {
    if (!validateDate(date)) {
      toast.error('Please select a date at least 2 weeks in advance');
      return;
    }
    setSelectedDate(date);
    setShowDatePicker(false);
  };
  
  const calculateTotalPayroll = (): number => {
    if (!userData?.employees) return 0;
    return userData.employees.reduce((total, emp) => {
      return total + (emp.salary || 0);
    }, 0);
  };
  
  const calculateFees = (amount: number) => {
    const payrollFee = userData?.selectedTiers?.payroll ? amount * 0.02 : 0;
    const taxFee = userData?.selectedTiers?.tax ? amount * 0.02 : 0;
    const advisoryFee = userData?.selectedTiers?.advisory ? amount * 0.01 : 0;
    const totalFee = payrollFee + taxFee + advisoryFee;
    
    return {
      payroll: payrollFee,
      tax: taxFee,
      advisory: advisoryFee,
      total: totalFee,
    };
  };
  
  const totalPayroll = calculateTotalPayroll();
  const fees = calculateFees(totalPayroll);
  
  const handleRunPayroll = () => {
    if (!canRunPayroll) {
      if (!hasMinimum) {
        toast.error('Add at least 5 team members to run payroll');
      } else if (!hasAmex) {
        toast.error('Connect your AMEX card to run payroll');
      }
      return;
    }
    
    if (!selectedDate) {
      toast.error('Please select a payroll date');
      return;
    }
    
    if (!validateDate(selectedDate)) {
      toast.error('Please select a date at least 2 weeks in advance');
      return;
    }
    
    setShowConfirmModal(true);
  };
  
  const confirmPayroll = () => {
    setIsProcessing(true);
    
    // Simulate backend processing
    setTimeout(() => {
      // Save the next payroll date to UserContext
      if (selectedDate) {
        updateUserData({ 
          nextPayrollDate: selectedDate.toISOString() 
        });
      }
      
      // Simulate sending email
      console.log('📧 Email sent to chad@huzle.com:');
      console.log({
        subject: 'New Payroll Submission',
        to: 'chad@huzle.com',
        body: {
          companyName: userData?.companyName || 'Company',
          payrollDate: selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : '',
          totalAmount: `$${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          totalFees: `$${fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          employeeCount: userData?.employees?.length || 0,
          payees: userData?.employees?.map(emp => ({
            name: emp.name,
            type: emp.type,
            amount: `$${(emp.salary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            taxId: emp.type === 'employee' 
              ? emp.ssn ? `***-**-${emp.ssn.replace(/\D/g, '').slice(-4)}` : 'N/A'
              : emp.ein ? `**-***${emp.ein.replace(/\D/g, '').slice(-4)}` : 'N/A',
            bank: emp.bankName ? `${emp.bankName} ****${emp.bankAccount}` : 'N/A',
          })) || [],
        },
      });
      
      toast.success('Payroll submitted – notification sent to operations');
      
      setIsProcessing(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }, 2000);
  };
  
  const getDayName = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };
  
  // Simple date picker component
  const DatePicker = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const getDaysInMonth = () => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay();
      
      const days: (Date | null)[] = [];
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      return days;
    };
    
    const days = getDaysInMonth();
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="px-3 py-1 bg-accent rounded hover:bg-accent/70"
          >
            ←
          </button>
          <div>{monthName}</div>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="px-3 py-1 bg-accent rounded hover:bg-accent/70"
          >
            →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground p-1">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isPast = day && isBefore(startOfDay(day), minDate);
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
            
            return (
              <button
                key={i}
                onClick={() => day && handleDateSelect(day)}
                disabled={!day || isPast || undefined}
                className={`
                  aspect-square p-2 rounded text-sm transition-all
                  ${!day ? 'invisible' : ''}
                  ${isPast ? 'text-muted-foreground cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                  ${!isPast && !isSelected && day ? 'bg-card' : ''}
                `}
              >
                {day && day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Payroll</h1>
          <p className="text-muted-foreground">Process payments through your AMEX card</p>
        </div>
        
        {/* Status Alerts */}
        {!hasMinimum && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-destructive">Payroll Disabled</h4>
              <p className="text-sm text-muted-foreground">
                Add at least {5 - employeeCount} more team member{5 - employeeCount !== 1 ? 's' : ''} to activate payroll processing.
              </p>
            </div>
          </div>
        )}
        
        {!hasAmex && hasMinimum && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-destructive">AMEX Card Required</h4>
              <p className="text-sm text-muted-foreground">
                Connect your American Express card to enable payroll processing.
              </p>
            </div>
          </div>
        )}
        
        {/* Payroll Schedule */}
        <div className="mb-8 p-8 bg-card border border-border rounded-xl">
          <h3 className="text-xl mb-6">Payroll Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Frequency</label>
              <select
                value={payrollSchedule.frequency}
                onChange={(e) => setPayrollSchedule({
                  ...payrollSchedule,
                  frequency: e.target.value as 'weekly' | 'bi-weekly' | 'monthly',
                })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            {(payrollSchedule.frequency === 'weekly' || payrollSchedule.frequency === 'bi-weekly') && (
              <div>
                <label className="block text-sm mb-2">Day of Week</label>
                <select
                  value={payrollSchedule.dayOfWeek}
                  onChange={(e) => setPayrollSchedule({
                    ...payrollSchedule,
                    dayOfWeek: parseInt(e.target.value),
                  })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <option key={day} value={day}>{getDayName(day)}</option>
                  ))}
                </select>
              </div>
            )}
            
            {payrollSchedule.frequency === 'monthly' && (
              <div>
                <label className="block text-sm mb-2">Day of Month</label>
                <select
                  value={payrollSchedule.dayOfMonth}
                  onChange={(e) => setPayrollSchedule({
                    ...payrollSchedule,
                    dayOfMonth: parseInt(e.target.value),
                  })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="15">15th of month</option>
                  <option value="31">Last day of month</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Payroll */}
          <div className="p-8 bg-gradient-to-br from-card to-accent border border-border rounded-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl mb-1">Upcoming Payroll</h3>
                <p className="text-sm text-muted-foreground">Next scheduled run</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Payroll Date</div>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg hover:bg-accent/70 transition-all text-left"
                >
                  {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select date'}
                </button>
                {showDatePicker && (
                  <div className="mt-2">
                    <DatePicker />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 2 weeks in advance (earliest: {format(minDate, 'MMM dd, yyyy')})
                </p>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                <div className="text-2xl" style={{ fontWeight: 600 }}>
                  ${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Employees Included</div>
                <div className="text-lg">{employeeCount} team members</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Service Fees</div>
                <div className="text-lg text-primary">
                  ${fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRunPayroll}
              disabled={!canRunPayroll || !selectedDate}
              className={`w-full px-6 py-3 rounded-lg transition-all ${
                canRunPayroll && selectedDate
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Run Payroll Now
            </button>
          </div>
          
          {/* Payment Method */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-6">Payment Method</h3>
            
            {hasAmex ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <div className="mb-1">American Express</div>
                    <div className="text-sm text-muted-foreground">•••• •••• •••• {userData?.amexCard?.last4}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="mb-4">Fee Breakdown</h4>
                  <div className="space-y-3">
                    {userData?.selectedTiers?.payroll && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Payroll (2%)</span>
                        <span>${fees.payroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {userData?.selectedTiers?.tax && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax (2%)</span>
                        <span>${fees.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {userData?.selectedTiers?.advisory && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Advisory (1%)</span>
                        <span>${fees.advisory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span style={{ fontWeight: 600 }}>Total Fees</span>
                      <span className="text-primary" style={{ fontWeight: 600 }}>
                        ${fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg mb-2">No AMEX Card Connected</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Connect your American Express card to process payroll
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <Dialog.Root open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 bg-card border border-border rounded-2xl z-50">
            <Dialog.Title className="text-2xl mb-6">Confirm Payroll Submission</Dialog.Title>
            
            <div className="space-y-6 mb-6">
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Payroll Date</div>
                <div className="text-lg" style={{ fontWeight: 600 }}>
                  {selectedDate && format(selectedDate, 'MMMM dd, yyyy')}
                </div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total Payroll Amount</div>
                <div className="text-2xl text-primary" style={{ fontWeight: 600 }}>
                  ${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-3">Payees ({employeeCount})</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userData?.employees?.map(emp => (
                    <div key={emp.id} className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <div className="flex-1">
                        <div className="mb-1">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {emp.bankName ? `${emp.bankName} ****${emp.bankAccount}` : 'Bank not set'}
                          {' • '}
                          {emp.type === 'employee' && emp.ssn 
                            ? `***-**-${emp.ssn.replace(/\D/g, '').slice(-4)}`
                            : emp.type === 'contractor' && emp.ein
                            ? `**-***${emp.ein.replace(/\D/g, '').slice(-4)}`
                            : 'Tax ID not set'
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontWeight: 600 }}>
                          ${(emp.salary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Service Fees</span>
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    ${fees.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontWeight: 600 }}>Total Charge to AMEX</span>
                  <span className="text-xl text-primary" style={{ fontWeight: 600 }}>
                    ${(totalPayroll + fees.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayroll}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm & Submit'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      {/* Success Modal */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-card border border-border rounded-2xl z-50 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            
            <Dialog.Title className="text-2xl mb-4">Payroll Successfully Submitted</Dialog.Title>
            
            <p className="text-muted-foreground mb-6">
              All payments have been submitted and will be distributed to employees within 1-2 business days.
            </p>
            
            <div className="p-4 bg-accent rounded-lg mb-6 text-left">
              <div className="text-sm text-muted-foreground mb-1">Reference Number</div>
              <div className="font-mono">
                CLV-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}-{Math.floor(Math.random() * 900000 + 100000)}
              </div>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Done
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}