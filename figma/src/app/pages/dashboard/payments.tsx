import { CreditCard, Download, DollarSign } from 'lucide-react';

export function PaymentsPage() {
  const hasAmex = false; // Mock data
  
  // Empty billing history - will only populate when actual payments are made
  const billingHistory: Array<{
    id: string;
    date: string;
    description: string;
    amount: string;
    status: string;
  }> = [];
  
  const feeBreakdown = [
    { service: 'Centurion Payroll', percentage: '2%', amount: '$0.00' },
    { service: 'Centurion Tax', percentage: '0%', amount: '$0.00' },
    { service: 'Centurion Advisory', percentage: '0%', amount: '$0.00' },
  ];
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Payments & AMEX</h1>
          <p className="text-muted-foreground">Manage your payment method and billing</p>
        </div>
        
        {/* AMEX Card Management */}
        <div className="mb-8 p-8 bg-card border border-border rounded-xl">
          <h3 className="text-xl mb-6">American Express Card</h3>
          
          {hasAmex ? (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1 flex items-center gap-4 p-6 bg-gradient-to-r from-accent to-accent/50 rounded-xl">
                <CreditCard className="w-12 h-12 text-primary" />
                <div>
                  <div className="mb-1">American Express Platinum</div>
                  <div className="text-2xl tracking-wider" style={{ fontWeight: 600 }}>•••• •••• •••• 1234</div>
                  <div className="text-sm text-muted-foreground mt-1">Expires 12/27</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all">
                  Update Card
                </button>
                <button className="px-6 py-3 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg mb-2">No AMEX Card Connected</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your American Express card to enable payroll processing
              </p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                Connect AMEX Card
              </button>
            </div>
          )}
        </div>
        
        {/* Fee Breakdown */}
        <div className="mb-8 p-8 bg-gradient-to-br from-card to-accent border border-border rounded-xl">
          <h3 className="text-xl mb-6">Current Fee Breakdown</h3>
          
          <div className="space-y-4 mb-6">
            {feeBreakdown.map((fee, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-lg">
                <div>
                  <div className="mb-1">{fee.service}</div>
                  <div className="text-sm text-muted-foreground">Monthly percentage</div>
                </div>
                <div className="text-right">
                  <div className="text-xl text-primary" style={{ fontWeight: 600 }}>{fee.percentage}</div>
                  <div className="text-sm text-muted-foreground">{fee.amount}/mo</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="text-lg">Total Monthly Fee</div>
            <div className="text-2xl text-primary" style={{ fontWeight: 600 }}>2%</div>
          </div>
        </div>
        
        {/* Billing History */}
        <div className="p-8 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Billing History</h3>
            <button className="text-sm text-primary hover:underline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm">Date</th>
                  <th className="text-left p-4 text-sm">Description</th>
                  <th className="text-left p-4 text-sm">Amount</th>
                  <th className="text-left p-4 text-sm">Status</th>
                  <th className="text-left p-4 text-sm">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{item.description}</td>
                    <td className="p-4">{item.amount}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {billingHistory.map((item) => (
              <div key={item.id} className="p-4 bg-accent rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="mb-1">{item.description}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                    {item.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg" style={{ fontWeight: 600 }}>{item.amount}</div>
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {billingHistory.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg mb-2">No Billing History</h4>
              <p className="text-sm text-muted-foreground">
                Your billing history will appear here once you start using CLEVIO services
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}