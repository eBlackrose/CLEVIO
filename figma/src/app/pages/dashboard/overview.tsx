import { Calendar, Users, Briefcase, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/user-context';

export function DashboardOverview() {
  const { userData } = useUser();
  
  // Get data from user context
  const employeeCount = userData?.employees?.length || 0;
  const activeTiers = [
    userData?.selectedTiers?.payroll && 'Centurion Payroll',
    userData?.selectedTiers?.tax && 'Centurion Tax',
    userData?.selectedTiers?.advisory && 'Centurion Advisory',
  ].filter(Boolean);
  
  // Fixed: Advisory is 1%, not 2%
  const monthlyFee = (
    (userData?.selectedTiers?.payroll ? 2 : 0) +
    (userData?.selectedTiers?.tax ? 2 : 0) +
    (userData?.selectedTiers?.advisory ? 1 : 0)
  );
  
  const hasMinimumEmployees = employeeCount >= 5;
  const hasAmex = !!userData?.amexCard?.last4;
  const hasFirstEmployee = employeeCount > 0;
  const hasRunPayroll = false; // TODO: Add flag in userData when payroll is run
  
  // Check if company profile is complete
  const isCompanyProfileComplete = !!(
    userData?.ein && 
    userData?.businessAddress && 
    userData?.phone
  );
  
  // Determine payroll date display logic
  const getPayrollDateInfo = () => {
    // Error conditions - check these first
    if (!hasAmex) {
      return {
        display: 'N/A',
        subtitle: 'Connect AMEX card to enable payroll',
        isError: true,
      };
    }
    
    if (!isCompanyProfileComplete) {
      return {
        display: 'N/A',
        subtitle: 'Complete company profile to enable payroll',
        isError: true,
      };
    }
    
    if (!hasMinimumEmployees) {
      return {
        display: 'N/A',
        subtitle: 'Add 5 team members to enable payroll',
        isError: true,
      };
    }
    
    // No errors, check if date is set
    if (userData?.nextPayrollDate) {
      try {
        const date = new Date(userData.nextPayrollDate);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        return {
          display: formattedDate,
          subtitle: 'Next Payroll Date',
          isError: false,
        };
      } catch (e) {
        return {
          display: 'N/A',
          subtitle: 'Set payroll date to schedule',
          isError: false,
        };
      }
    }
    
    // No date set, no errors
    return {
      display: 'N/A',
      subtitle: 'Set payroll date to schedule',
      isError: false,
    };
  };
  
  const payrollDateInfo = getPayrollDateInfo();
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Overview</h1>
          <p className="text-muted-foreground">Your CLEVIO dashboard at a glance</p>
        </div>
        
        {/* Status Alerts */}
        {!hasMinimumEmployees && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">Action Required: Add More Team Members</h4>
              <p className="text-sm text-muted-foreground">
                You currently have {employeeCount} team member{employeeCount !== 1 ? 's' : ''}. 
                A minimum of 5 employees or contractors is required to activate payroll and advisory services.
              </p>
              <Link to="/dashboard/employees" className="inline-block mt-3 text-sm text-primary hover:underline">
                Add Team Members →
              </Link>
            </div>
          </div>
        )}
        
        {!hasAmex && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1">Connect Your AMEX Card</h4>
              <p className="text-sm text-muted-foreground">
                An American Express card is required to process payroll. Add your card to get started.
              </p>
              <Link to="/dashboard/settings" className="inline-block mt-3 text-sm text-primary hover:underline">
                Add AMEX Card →
              </Link>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className={`p-6 border rounded-xl ${
            payrollDateInfo.isError 
              ? 'bg-destructive/5 border-destructive/30' 
              : 'bg-card border-border'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <Calendar className={`w-8 h-8 ${
                payrollDateInfo.isError ? 'text-destructive' : 'text-primary'
              }`} />
            </div>
            <div className={`text-2xl mb-1 ${
              payrollDateInfo.display === 'N/A' ? 'text-muted-foreground' : ''
            }`} style={{ fontWeight: 600 }}>
              {payrollDateInfo.display}
            </div>
            <p className={`text-sm ${
              payrollDateInfo.isError ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {payrollDateInfo.subtitle}
            </p>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <Users className="w-8 h-8 text-primary" />
              {!hasMinimumEmployees && (
                <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs rounded">
                  Below Minimum
                </span>
              )}
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>
              {employeeCount}
            </div>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{activeTiers.length}</div>
            <p className="text-sm text-muted-foreground">Active Centurion Tier{activeTiers.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{monthlyFee}%</div>
            <p className="text-sm text-muted-foreground">Current Monthly Fee</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-gradient-to-br from-card to-accent border border-border rounded-xl">
            <h3 className="text-xl mb-2">Get Started</h3>
            <p className="text-muted-foreground mb-6">
              Complete your setup to unlock all CLEVIO features
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasFirstEmployee ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {hasFirstEmployee && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${hasFirstEmployee ? 'text-muted-foreground line-through' : ''}`}>
                  Add your first team member
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasMinimumEmployees ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {hasMinimumEmployees && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${hasMinimumEmployees ? 'text-muted-foreground line-through' : ''}`}>
                  Reach 5 team members minimum
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isCompanyProfileComplete ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {isCompanyProfileComplete && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <span className={`text-sm ${isCompanyProfileComplete ? 'text-muted-foreground line-through' : ''}`}>
                    Complete company profile
                  </span>
                  {!isCompanyProfileComplete && (
                    <div className="mt-1">
                      <Link to="/dashboard/settings" className="text-xs text-yellow-600 hover:underline">
                        Add required details →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasAmex ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {hasAmex && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${hasAmex ? 'text-muted-foreground line-through' : ''}`}>
                  Connect your AMEX card
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasRunPayroll ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {hasRunPayroll && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm ${hasRunPayroll ? 'text-muted-foreground line-through' : ''}`}>
                  Run your first payroll
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-2">Active Services</h3>
            <p className="text-muted-foreground mb-6">
              Your current Centurion tier subscriptions
            </p>
            
            <div className="space-y-4">
              {userData?.selectedTiers?.payroll && (
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <span>Centurion Payroll</span>
                  <span className="text-sm text-primary">2%</span>
                </div>
              )}
              
              {userData?.selectedTiers?.tax && (
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <span>Centurion Tax</span>
                  <span className="text-sm text-primary">2%</span>
                </div>
              )}
              
              {userData?.selectedTiers?.advisory && (
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <span>Centurion Advisory</span>
                  <span className="text-sm text-primary">1%</span>
                </div>
              )}
              
              {activeTiers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No active services. Visit Services & Subscriptions to get started.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}