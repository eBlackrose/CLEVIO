import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Shield, FileText, Users, CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { useAdminData, ComplianceIssue } from '../../contexts/admin-data-context';

export function AdminCompliance() {
  const { adminData, updateComplianceIssue, addComplianceIssue, deleteComplianceIssue } = useAdminData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterType, setFilterType] = useState<'all' | 'employee_minimum' | 'amex_verification' | 'contract_expiry' | 'advisory_overdue'>('all');
  
  // Form state for create modal
  const [newIssue, setNewIssue] = useState({
    clientName: '',
    type: 'employee_minimum' as ComplianceIssue['type'],
    severity: 'medium' as ComplianceIssue['severity'],
    description: '',
  });
  
  const issues = adminData.complianceIssues;
  
  const filteredIssues = issues.filter(issue => {
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
    const matchesType = filterType === 'all' || issue.type === filterType;
    const matchesStatus = issue.status !== 'resolved'; // Only show non-resolved
    return matchesSeverity && matchesType && matchesStatus;
  });
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'employee_minimum': return <Users className="w-5 h-5" />;
      case 'amex_verification': return <CreditCard className="w-5 h-5" />;
      case 'contract_expiry': return <FileText className="w-5 h-5" />;
      case 'advisory_overdue': return <Clock className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'employee_minimum': return 'Employee Minimum';
      case 'amex_verification': return 'AMEX Verification';
      case 'contract_expiry': return 'Contract Expiry';
      case 'advisory_overdue': return 'Advisory Overdue';
      default: return type;
    }
  };
  
  const handleMarkAcknowledged = (id: string) => {
    updateComplianceIssue(id, { status: 'acknowledged' });
    toast.success('Issue marked as acknowledged');
  };
  
  const handleMarkResolved = (id: string, clientName: string) => {
    updateComplianceIssue(id, { status: 'resolved' });
    toast.success(`Issue resolved for ${clientName}`);
  };
  
  const handleEscalate = (issue: ComplianceIssue) => {
    updateComplianceIssue(issue.id, { severity: 'critical' });
    toast.warning(`Issue escalated to critical for ${issue.clientName}`);
  };
  
  const handleCreateIssue = () => {
    if (!newIssue.clientName || !newIssue.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const today = new Date();
    addComplianceIssue({
      clientId: `client-${Date.now()}`,
      clientName: newIssue.clientName,
      type: newIssue.type,
      severity: newIssue.severity,
      description: newIssue.description,
      detected: today.toISOString().split('T')[0],
      daysOpen: 0,
      status: 'open',
    });
    
    toast.success(`Compliance issue created for ${newIssue.clientName}`);
    setShowCreateModal(false);
    setNewIssue({
      clientName: '',
      type: 'employee_minimum',
      severity: 'medium',
      description: '',
    });
  };
  
  const complianceStats = {
    open: issues.filter(i => i.status === 'open').length,
    acknowledged: issues.filter(i => i.status === 'acknowledged').length,
    critical: issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length,
    avgDaysOpen: issues.length > 0 
      ? Math.round(issues.filter(i => i.status !== 'resolved').reduce((sum, i) => sum + i.daysOpen, 0) / issues.filter(i => i.status !== 'resolved').length)
      : 0,
  };
  
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Compliance Monitoring</h1>
            <p className="text-muted-foreground">Track and resolve compliance issues across all clients</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Issue
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Open Issues</div>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>{complianceStats.open}</div>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Acknowledged</div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>{complianceStats.acknowledged}</div>
          </div>
          
          <div className="p-6 bg-card border border-destructive/50 rounded-xl bg-destructive/5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Critical</div>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-3xl text-destructive mb-1" style={{ fontWeight: 600 }}>{complianceStats.critical}</div>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Avg Days Open</div>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>
              {complianceStats.avgDaysOpen || 'N/A'}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Types</option>
            <option value="employee_minimum">Employee Minimum</option>
            <option value="amex_verification">AMEX Verification</option>
            <option value="contract_expiry">Contract Expiry</option>
            <option value="advisory_overdue">Advisory Overdue</option>
          </select>
        </div>
        
        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className={`p-6 rounded-xl border-2 ${
              issue.severity === 'critical' ? 'border-destructive/50 bg-destructive/5' :
              issue.severity === 'high' ? 'border-orange-500/50 bg-orange-500/5' :
              'border-border bg-card'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    issue.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                    issue.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {getTypeIcon(issue.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg" style={{ fontWeight: 600 }}>{issue.clientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs uppercase ${getSeverityColor(issue.severity)}`} style={{ fontWeight: 600 }}>
                        {issue.severity}
                      </span>
                      <span className="px-3 py-1 bg-accent text-xs rounded-full">
                        {getTypeLabel(issue.type)}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">{issue.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div>
                        <span className="text-foreground" style={{ fontWeight: 600 }}>Detected:</span> {issue.detected}
                      </div>
                      <div>
                        <span className="text-foreground" style={{ fontWeight: 600 }}>Days Open:</span> {issue.daysOpen}
                      </div>
                      <div>
                        <span className="text-foreground" style={{ fontWeight: 600 }}>Status:</span>{' '}
                        <span className={`capitalize ${
                          issue.status === 'resolved' ? 'text-primary' :
                          issue.status === 'acknowledged' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {issue.status === 'open' && (
                  <button 
                    onClick={() => handleMarkAcknowledged(issue.id)}
                    className="px-4 py-2 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-sm"
                  >
                    Mark Acknowledged
                  </button>
                )}
                {issue.severity !== 'critical' && (
                  <button 
                    onClick={() => handleEscalate(issue)}
                    className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/30 transition-all text-sm"
                  >
                    Escalate Issue
                  </button>
                )}
                {issue.status !== 'resolved' && (
                  <button 
                    onClick={() => handleMarkResolved(issue.id, issue.clientName)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm ml-auto"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredIssues.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl mb-2">No Compliance Issues</h3>
            <p className="text-muted-foreground">
              {issues.length === 0 
                ? 'No compliance issues detected. All clients are currently compliant.' 
                : 'All clients are currently compliant with the selected filters.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Create Issue Modal */}
      <Dialog.Root open={showCreateModal} onOpenChange={setShowCreateModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border border-border rounded-xl p-6 z-50">
            <Dialog.Title className="text-2xl mb-2" style={{ fontWeight: 600 }}>
              Create Compliance Issue
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mb-6">
              Manually create a compliance issue for tracking
            </Dialog.Description>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Client Name *</label>
                <input
                  type="text"
                  value={newIssue.clientName}
                  onChange={(e) => setNewIssue({ ...newIssue, clientName: e.target.value })}
                  placeholder="Enter client name"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Issue Type *</label>
                <select
                  value={newIssue.type}
                  onChange={(e) => setNewIssue({ ...newIssue, type: e.target.value as ComplianceIssue['type'] })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="employee_minimum">Employee Minimum</option>
                  <option value="amex_verification">AMEX Verification</option>
                  <option value="contract_expiry">Contract Expiry</option>
                  <option value="advisory_overdue">Advisory Overdue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Severity *</label>
                <select
                  value={newIssue.severity}
                  onChange={(e) => setNewIssue({ ...newIssue, severity: e.target.value as ComplianceIssue['severity'] })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Description *</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  placeholder="Describe the compliance issue"
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIssue}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                Create Issue
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
