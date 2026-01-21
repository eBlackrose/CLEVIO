import { useState, useEffect } from 'react';
import { Plus, User, AlertCircle, Check } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useUser } from '../../contexts/user-context';

interface Employee {
  id: string;
  name: string;
  email: string;
  type: 'employee' | 'contractor';
  bankStatus?: 'connected' | 'pending';
  payrollStatus?: 'active' | 'inactive';
  ssn?: string;
  ein?: string;
  bankAccount?: string;
  routingNumber?: string;
  bankName?: string;
  salary?: number;
}

interface EmployeeFormData {
  name: string;
  email: string;
  type: 'employee' | 'contractor';
  ssn: string;
  ein: string;
  bankAccount: string;
  routingNumber: string;
  bankName: string;
  bankStatus: 'connected' | 'pending';
  salary: string;
}

export function EmployeesPage() {
  const { userData, updateUserData } = useUser();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  useEffect(() => {
    if (userData?.employees && userData.employees.length > 0) {
      setEmployees(userData.employees);
    }
  }, [userData?.employees]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    type: 'employee',
    ssn: '',
    ein: '',
    bankAccount: '',
    routingNumber: '',
    bankName: '',
    bankStatus: 'pending',
    salary: '',
  });
  
  const hasMinimum = employees.length >= 5;
  
  // Open modal for adding new employee
  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      type: 'employee',
      ssn: '',
      ein: '',
      bankAccount: '',
      routingNumber: '',
      bankName: '',
      bankStatus: 'pending',
      salary: '',
    });
    setIsModalOpen(true);
  };
  
  // Open modal for editing existing employee
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      type: employee.type,
      ssn: employee.ssn || '',
      ein: employee.ein || '',
      bankAccount: employee.bankAccount || '',
      routingNumber: employee.routingNumber || '',
      bankName: employee.bankName || '',
      bankStatus: employee.bankStatus || 'pending',
      salary: employee.salary ? employee.salary.toString() : '',
    });
    setIsModalOpen(true);
  };
  
  // Validation helpers
  const validateSSN = (ssn: string): boolean => {
    const digits = ssn.replace(/\D/g, '');
    return digits.length === 9;
  };
  
  const validateEIN = (ein: string): boolean => {
    const digits = ein.replace(/\D/g, '');
    return digits.length === 9;
  };
  
  const validateRouting = (routing: string): boolean => {
    const digits = routing.replace(/\D/g, '');
    return digits.length === 9;
  };
  
  const validateBankAccount = (account: string): boolean => {
    const digits = account.replace(/\D/g, '');
    return digits.length === 4;
  };
  
  // Formatting helpers
  const formatSSN = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length >= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };
  
  const formatEIN = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    return digits;
  };
  
  const maskSSN = (ssn: string): string => {
    const digits = ssn.replace(/\D/g, '');
    if (digits.length === 9) {
      return `***-**-${digits.slice(-4)}`;
    }
    return '***-**-****';
  };
  
  const maskEIN = (ein: string): string => {
    const digits = ein.replace(/\D/g, '');
    if (digits.length === 9) {
      return `**-***${digits.slice(-4)}`;
    }
    return '**-*******';
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Validate tax ID based on type
    if (formData.type === 'employee') {
      if (!formData.ssn || !validateSSN(formData.ssn)) {
        toast.error('Please enter a valid 9-digit SSN');
        return;
      }
    } else {
      if (!formData.ein || !validateEIN(formData.ein)) {
        toast.error('Please enter a valid 9-digit EIN');
        return;
      }
    }
    
    // Validate banking info
    if (!formData.bankName.trim()) {
      toast.error('Please enter a bank name');
      return;
    }
    
    if (!formData.bankAccount || !validateBankAccount(formData.bankAccount)) {
      toast.error('Please enter the last 4 digits of the account number');
      return;
    }
    
    if (!formData.routingNumber || !validateRouting(formData.routingNumber)) {
      toast.error('Please enter a valid 9-digit routing number');
      return;
    }
    
    // Create or update employee
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp =>
        emp.id === editingEmployee.id
          ? {
              ...emp,
              name: formData.name,
              email: formData.email,
              type: formData.type,
              ssn: formData.type === 'employee' ? formData.ssn : undefined,
              ein: formData.type === 'contractor' ? formData.ein : undefined,
              bankAccount: formData.bankAccount,
              routingNumber: formData.routingNumber,
              bankName: formData.bankName,
              bankStatus: formData.bankStatus,
              salary: formData.salary ? parseFloat(formData.salary) : undefined,
            }
          : emp
      );
      
      setEmployees(updatedEmployees);
      updateUserData({ employees: updatedEmployees });
      toast.success('Team member updated successfully');
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        type: formData.type,
        bankStatus: formData.bankStatus,
        payrollStatus: 'active',
        ssn: formData.type === 'employee' ? formData.ssn : undefined,
        ein: formData.type === 'contractor' ? formData.ein : undefined,
        bankAccount: formData.bankAccount,
        routingNumber: formData.routingNumber,
        bankName: formData.bankName,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };
      
      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      updateUserData({ employees: updatedEmployees });
      toast.success('Team member added successfully');
    }
    
    // Close modal and reset form
    setIsModalOpen(false);
    setEditingEmployee(null);
  };
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl mb-2">Employees & Contractors</h1>
            <p className="text-muted-foreground">Manage your team members for payroll</p>
          </div>
          
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Add Team Member</span>
          </button>
        </div>
        
        {/* Employee/Edit Modal */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 bg-card border border-border rounded-2xl z-50">
              <Dialog.Title className="text-2xl mb-6">
                {editingEmployee ? 'Edit Team Member' : 'Add Team Member'}
              </Dialog.Title>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        type: e.target.value as 'employee' | 'contractor',
                        ssn: '',
                        ein: '',
                      })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="employee">Employee</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>
                </div>
                
                {/* Tax Information */}
                <div className="pt-4 border-t border-border space-y-4">
                  <h3 className="text-lg">Tax Information</h3>
                  
                  {formData.type === 'employee' ? (
                    <div>
                      <label className="block text-sm mb-2">Social Security Number (SSN)</label>
                      <input
                        type="text"
                        value={formData.ssn}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          ssn: formatSSN(e.target.value) 
                        })}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="***-**-****"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Format: XXX-XX-XXXX (9 digits)</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm mb-2">Employer Identification Number (EIN)</label>
                      <input
                        type="text"
                        value={formData.ein}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          ein: formatEIN(e.target.value) 
                        })}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="**-*******"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Format: XX-XXXXXXX (9 digits)</p>
                    </div>
                  )}
                </div>
                
                {/* Banking Information */}
                <div className="pt-4 border-t border-border space-y-4">
                  <h3 className="text-lg">Banking Information</h3>
                  
                  <div>
                    <label className="block text-sm mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Chase Bank"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Account Number (Last 4 digits)</label>
                      <input
                        type="text"
                        value={formData.bankAccount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData({ ...formData, bankAccount: value });
                        }}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="1234"
                        maxLength={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Routing Number</label>
                      <input
                        type="text"
                        value={formData.routingNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                          setFormData({ ...formData, routingNumber: value });
                        }}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="123456789"
                        maxLength={9}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">9 digits</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Bank Account Status</label>
                    <select
                      value={formData.bankStatus}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        bankStatus: e.target.value as 'connected' | 'pending' 
                      })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="connected">Connected</option>
                    </select>
                  </div>
                </div>
                
                {/* Compensation */}
                <div className="pt-4 border-t border-border space-y-4">
                  <h3 className="text-lg">Compensation</h3>
                  
                  <div>
                    <label className="block text-sm mb-2">
                      {formData.type === 'employee' ? 'Annual Salary' : 'Payment Amount'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="75000"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                  >
                    {editingEmployee ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        
        {/* Minimum Requirement Alert */}
        <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 ${
          hasMinimum 
            ? 'bg-primary/10 border-primary/30' 
            : 'bg-destructive/10 border-destructive/30'
        }`}>
          {hasMinimum ? (
            <>
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-1 text-primary">Minimum Requirement Met</h4>
                <p className="text-sm text-muted-foreground">
                  You have {employees.length} team member{employees.length !== 1 ? 's' : ''}. Services are now available.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-1 text-destructive">Minimum 5 Individuals Required</h4>
                <p className="text-sm text-muted-foreground">
                  You have {employees.length} of 5 required team members. Add {5 - employees.length} more to activate payroll and advisory services.
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm">Name</th>
                <th className="text-left p-4 text-sm">Type</th>
                <th className="text-left p-4 text-sm">Tax ID</th>
                <th className="text-left p-4 text-sm">Bank</th>
                <th className="text-left p-4 text-sm">Status</th>
                <th className="text-left p-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-border last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div>{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-accent rounded-full text-sm capitalize">
                      {employee.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {employee.type === 'employee' && employee.ssn 
                      ? maskSSN(employee.ssn)
                      : employee.type === 'contractor' && employee.ein
                      ? maskEIN(employee.ein)
                      : 'Not set'
                    }
                  </td>
                  <td className="p-4 text-sm">
                    {employee.bankName ? (
                      <div>
                        <div>{employee.bankName}</div>
                        <div className="text-xs text-muted-foreground">****{employee.bankAccount}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      employee.bankStatus === 'connected' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {employee.bankStatus === 'connected' ? 'Connected' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      className="text-sm text-primary hover:underline" 
                      onClick={() => handleEditClick(employee)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {employees.length === 0 && (
            <div className="p-12 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first employee or contractor to get started
              </p>
              <button 
                onClick={handleAddClick}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                Add Team Member
              </button>
            </div>
          )}
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="p-4 bg-card border border-border rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="mb-1">{employee.name}</div>
                    <span className="text-xs text-muted-foreground capitalize">{employee.type}</span>
                  </div>
                </div>
                <button 
                  className="text-sm text-primary" 
                  onClick={() => handleEditClick(employee)}
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-xs">{employee.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax ID</span>
                  <span className="text-xs">
                    {employee.type === 'employee' && employee.ssn 
                      ? maskSSN(employee.ssn)
                      : employee.type === 'contractor' && employee.ein
                      ? maskEIN(employee.ein)
                      : 'Not set'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="text-xs">
                    {employee.bankName ? `${employee.bankName} ****${employee.bankAccount}` : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`text-xs ${employee.bankStatus === 'connected' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {employee.bankStatus === 'connected' ? 'Connected' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {employees.length === 0 && (
            <div className="p-12 text-center bg-card border border-border rounded-xl">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first employee or contractor to get started
              </p>
              <button 
                onClick={handleAddClick}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                Add Team Member
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
