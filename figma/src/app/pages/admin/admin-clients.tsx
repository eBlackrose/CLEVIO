import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useAdmin } from '../../contexts/admin-context';

export function AdminClients() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState<typeof customers[0] | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<typeof customers[0] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Mask SSN
  const maskSSN = (ssn: string): string => {
    const digits = ssn.replace(/\D/g, '');
    if (digits.length === 9) {
      return `***-**-${digits.slice(-4)}`;
    }
    return '***-**-****';
  };
  
  // Mask EIN
  const maskEIN = (ein: string): string => {
    const digits = ein.replace(/\D/g, '');
    if (digits.length === 9) {
      return `**-***${digits.slice(-4)}`;
    }
    return '**-*******';
  };
  
  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteCustomer(id);
      toast.success('Customer deleted successfully');
    }
  };
  
  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCustomer = {
      id: Date.now().toString(),
      companyName: formData.get('companyName') as string,
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      ein: formData.get('ein') as string,
      businessAddress: formData.get('businessAddress') as string,
      phone: formData.get('phone') as string,
      employees: [],
      selectedTiers: {
        payroll: formData.get('payroll') === 'on',
        tax: formData.get('tax') === 'on',
        advisory: formData.get('advisory') === 'on',
      },
      status: 'active' as const,
      complianceStatus: 'compliant' as const,
      createdAt: new Date().toISOString(),
    };
    
    addCustomer(newCustomer);
    setIsAddModalOpen(false);
    toast.success('Customer added successfully');
  };
  
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Client Accounts</h1>
            <p className="text-muted-foreground">Manage customer data and access</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Add Customer</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        {/* Clients Table */}
        {filteredCustomers.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm">Company Name</th>
                    <th className="text-left p-4 text-sm">Services</th>
                    <th className="text-left p-4 text-sm">Employees</th>
                    <th className="text-left p-4 text-sm">Status</th>
                    <th className="text-left p-4 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const services = [];
                    if (customer.selectedTiers.payroll) services.push('Payroll');
                    if (customer.selectedTiers.tax) services.push('Tax');
                    if (customer.selectedTiers.advisory) services.push('Advisory');
                    
                    return (
                      <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{customer.companyName}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {services.map((service) => (
                              <span key={service} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                                {service}
                              </span>
                            ))}
                            {services.length === 0 && (
                              <span className="text-sm text-muted-foreground">No services</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{customer.employees.length}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            customer.status === 'active'
                              ? 'bg-primary/20 text-primary'
                              : customer.status === 'locked'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-yellow-500/20 text-yellow-600'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingCustomer(customer)}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id, customer.companyName)}
                              className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 bg-card border border-dashed border-border rounded-xl text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl mb-2">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Add your first customer to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                Add Customer
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Add Customer Modal */}
      <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 bg-card border border-border rounded-2xl z-50">
            <Dialog.Title className="text-2xl mb-6">Add New Customer</Dialog.Title>
            
            <form onSubmit={handleAddCustomer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Acme Inc"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="contact@acme.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">EIN</label>
                  <input
                    type="text"
                    name="ein"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="12-3456789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Business Address</label>
                <input
                  type="text"
                  name="businessAddress"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-3">Services</label>
                <div className="space-y-2">
                  {[
                    { name: 'payroll', label: 'Centurion Payroll™ (2%)' },
                    { name: 'tax', label: 'Centurion Tax™ (2%)' },
                    { name: 'advisory', label: 'Centurion Advisory™ (1%)' },
                  ].map((service) => (
                    <label key={service.name} className="flex items-center gap-3 p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/70">
                      <input type="checkbox" name={service.name} className="w-5 h-5" />
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      {/* View Customer Modal */}
      <Dialog.Root open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 bg-card border border-border rounded-2xl z-50">
            {viewingCustomer && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl">{viewingCustomer.companyName}</Dialog.Title>
                  <button
                    onClick={() => setViewingCustomer(null)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-lg mb-3 font-medium">Company Information</h3>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Company Name</div>
                        <div className="text-sm">{viewingCustomer.companyName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Email</div>
                        <div className="text-sm">{viewingCustomer.email}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contact</div>
                        <div className="text-sm">{viewingCustomer.firstName} {viewingCustomer.lastName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Phone</div>
                        <div className="text-sm">{viewingCustomer.phone || 'Not set'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">EIN</div>
                        <div className="text-sm">{viewingCustomer.ein ? maskEIN(viewingCustomer.ein) : 'Not set'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Status</div>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          viewingCustomer.status === 'active'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {viewingCustomer.status}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-muted-foreground mb-1">Business Address</div>
                        <div className="text-sm">{viewingCustomer.businessAddress || 'Not set'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Services */}
                  <div>
                    <h3 className="text-lg mb-3 font-medium">Active Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingCustomer.selectedTiers.payroll && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded">Centurion Payroll (2%)</span>
                      )}
                      {viewingCustomer.selectedTiers.tax && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded">Centurion Tax (2%)</span>
                      )}
                      {viewingCustomer.selectedTiers.advisory && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded">Centurion Advisory (1%)</span>
                      )}
                    </div>
                  </div>
                  
                  {/* AMEX Card */}
                  {viewingCustomer.amexCard && (
                    <div>
                      <h3 className="text-lg mb-3 font-medium">AMEX Card</h3>
                      <div className="p-4 bg-accent rounded-lg">
                        <div className="text-sm">•••• •••• •••• {viewingCustomer.amexCard.last4}</div>
                        <div className="text-xs text-muted-foreground mt-1">{viewingCustomer.amexCard.name}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Employees */}
                  <div>
                    <h3 className="text-lg mb-3 font-medium">Team Members ({viewingCustomer.employees.length})</h3>
                    {viewingCustomer.employees.length > 0 ? (
                      <div className="space-y-3">
                        {viewingCustomer.employees.map((emp) => (
                          <div key={emp.id} className="p-4 bg-accent rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{emp.name}</div>
                              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded capitalize">
                                {emp.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>Email: {emp.email}</div>
                              <div>
                                Tax ID: {emp.type === 'employee' && emp.ssn 
                                  ? maskSSN(emp.ssn)
                                  : emp.type === 'contractor' && emp.ein
                                  ? maskEIN(emp.ein)
                                  : 'Not set'
                                }
                              </div>
                              {emp.bankName && (
                                <>
                                  <div>Bank: {emp.bankName}</div>
                                  <div>Account: ****{emp.bankAccount}</div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-accent border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                        No team members added yet
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
