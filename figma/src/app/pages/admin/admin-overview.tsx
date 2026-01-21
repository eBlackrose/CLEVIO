import { TrendingUp, Users, CreditCard, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useAdmin } from '../../contexts/admin-context';

interface MetricCard {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  status?: 'normal' | 'warning' | 'critical';
}

export function AdminOverview() {
  const { adminData, customers, alerts } = useAdmin();
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };
  
  const metrics: MetricCard[] = [
    {
      label: 'Active Clients',
      value: String(adminData.activeClients),
      change: adminData.activeClients > 0 ? `${adminData.activeClients} total` : 'No clients yet',
      trend: adminData.activeClients > 0 ? 'up' : undefined,
      icon: Users,
      status: 'normal',
    },
    {
      label: 'Monthly AMEX Volume',
      value: formatCurrency(adminData.monthlyAmexVolume),
      change: adminData.monthlyAmexVolume > 0 ? 'Based on active clients' : 'No volume yet',
      trend: adminData.monthlyAmexVolume > 0 ? 'up' : undefined,
      icon: CreditCard,
      status: 'normal',
    },
    {
      label: 'Total Employees Managed',
      value: String(adminData.totalEmployeesManaged),
      change: adminData.totalEmployeesManaged > 0 ? `Across ${adminData.activeClients} clients` : 'No employees yet',
      trend: adminData.totalEmployeesManaged > 0 ? 'up' : undefined,
      icon: Users,
      status: 'normal',
    },
    {
      label: 'Revenue (Current Month)',
      value: formatCurrency(adminData.revenue),
      change: adminData.revenue > 0 ? 'From tier fees' : 'No revenue yet',
      trend: adminData.revenue > 0 ? 'up' : undefined,
      icon: DollarSign,
      status: 'normal',
    },
    {
      label: 'Compliance Flags',
      value: String(adminData.complianceFlags),
      change: adminData.complianceFlags > 0 ? 'Requires attention' : 'All compliant',
      icon: AlertCircle,
      status: adminData.complianceFlags > 0 ? 'warning' : 'normal',
    },
    {
      label: 'Advisory Queue',
      value: String(adminData.advisoryQueue),
      change: adminData.advisoryQueue > 0 ? `${adminData.advisoryQueue} scheduled` : 'No sessions',
      icon: Calendar,
      status: 'normal',
    },
  ];
  
  // Get top 5 clients by employee count
  const topClients = customers
    .filter(c => c.status === 'active')
    .sort((a, b) => b.employees.length - a.employees.length)
    .slice(0, 5)
    .map(c => {
      const tiers = [];
      if (c.selectedTiers.payroll) tiers.push('Payroll');
      if (c.selectedTiers.tax) tiers.push('Tax');
      if (c.selectedTiers.advisory) tiers.push('Advisory');
      
      // Calculate monthly volume
      const employeeCount = c.employees.length;
      const avgSalary = 75000;
      const monthlyPayroll = (employeeCount * avgSalary) / 12;
      
      return {
        name: c.companyName,
        employees: employeeCount,
        volume: formatCurrency(monthlyPayroll),
        tier: tiers.join(' + ') || 'No tiers',
      };
    });
  
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time operational metrics and alerts</p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  metric.status === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : metric.status === 'critical'
                    ? 'bg-destructive/10 border-destructive/30'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-8 h-8 ${
                    metric.status === 'warning'
                      ? 'text-yellow-600'
                      : metric.status === 'critical'
                      ? 'text-destructive'
                      : 'text-primary'
                  }`} />
                  {metric.trend && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      metric.trend === 'up'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-destructive/20 text-destructive'
                    }`} style={{ fontWeight: 600 }}>
                      {metric.trend === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                
                <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                {metric.change && (
                  <div className={`text-xs ${
                    metric.status === 'warning'
                      ? 'text-yellow-600'
                      : metric.status === 'critical'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}>
                    {metric.change}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Alerts and Top Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ fontWeight: 600 }}>Recent Alerts</h2>
              <span className="px-3 py-1 bg-destructive/20 text-destructive text-sm rounded-full" style={{ fontWeight: 600 }}>
                {alerts.length}
              </span>
            </div>
            
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'critical'
                        ? 'bg-destructive/10 border-destructive/30'
                        : alert.severity === 'high'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-accent border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">{alert.customerName}</div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        alert.severity === 'critical'
                          ? 'bg-destructive/20 text-destructive'
                          : alert.severity === 'high'
                          ? 'bg-red-500/20 text-red-600'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : 'bg-muted text-muted-foreground'
                      }`} style={{ fontWeight: 600 }}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.issue}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">No alerts</p>
                <p className="text-sm text-muted-foreground">All systems operating normally</p>
              </div>
            )}
          </div>
          
          {/* Top Clients */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ fontWeight: 600 }}>Top Clients</h2>
              <span className="text-sm text-muted-foreground">By employee count</span>
            </div>
            
            {topClients.length > 0 ? (
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{client.name}</div>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded" style={{ fontWeight: 600 }}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="text-xs">Employees:</span>
                        <div className="font-medium text-foreground">{client.employees}</div>
                      </div>
                      <div>
                        <span className="text-xs">Monthly Volume:</span>
                        <div className="font-medium text-foreground">{client.volume}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {client.tier}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">No clients yet</p>
                <p className="text-sm text-muted-foreground">Add your first client to get started</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Empty State (only shown when no data) */}
        {adminData.activeClients === 0 && (
          <div className="mt-8 p-12 bg-card border border-dashed border-border rounded-xl text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>Welcome to CLEVIO Admin</h3>
            <p className="text-muted-foreground mb-6">
              Your dashboard is ready. Add your first client to start tracking metrics.
            </p>
            <a
              href="/admin/clients"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Add First Client
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
