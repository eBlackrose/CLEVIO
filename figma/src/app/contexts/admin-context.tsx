import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  type: 'employee' | 'contractor';
  bankStatus?: 'connected' | 'pending';
  ssn?: string;
  ein?: string;
  bankAccount?: string;
  routingNumber?: string;
  bankName?: string;
  salary?: number;
}

interface Customer {
  id: string;
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  ein?: string;
  businessAddress?: string;
  phone?: string;
  employees: Employee[];
  amexCard?: {
    last4: string;
    name: string;
    expiry?: string;
  };
  selectedTiers: {
    payroll: boolean;
    tax: boolean;
    advisory: boolean;
  };
  status: 'active' | 'locked' | 'pending';
  complianceStatus: 'compliant' | 'warning' | 'critical';
  createdAt: string;
  lastPayroll?: string;
}

interface Alert {
  id: string;
  customerId: string;
  customerName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  createdAt: string;
}

interface AdminData {
  activeClients: number;
  monthlyAmexVolume: number;
  totalEmployeesManaged: number;
  revenue: number;
  complianceFlags: number;
  advisoryQueue: number;
  lastUpdated: string;
}

interface AdminContextType {
  isAdminLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  verify2FA: (code: string, expectedCode: string) => boolean;
  logout: () => void;
  adminData: AdminData;
  updateAdminData: (data: Partial<AdminData>) => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  generate2FACode: () => string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = 'chad@huzle.com';
const ADMIN_PASSWORD = 'AtlantaAtlanta1!2@3#';
const ADMIN_STORAGE_KEY = 'clevio_admin_auth';
const ADMIN_DATA_KEY = 'clevio_admin_data';
const CUSTOMERS_KEY = 'clevio_admin_customers';
const ALERTS_KEY = 'clevio_admin_alerts';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored === 'true';
  });

  const [adminData, setAdminDataState] = useState<AdminData>(() => {
    const stored = localStorage.getItem(ADMIN_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Start with zero/empty metrics
    return {
      activeClients: 0,
      monthlyAmexVolume: 0,
      totalEmployeesManaged: 0,
      revenue: 0,
      complianceFlags: 0,
      advisoryQueue: 0,
      lastUpdated: new Date().toISOString(),
    };
  });

  const [customers, setCustomersState] = useState<Customer[]>(() => {
    const stored = localStorage.getItem(CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [alerts, setAlertsState] = useState<Alert[]>(() => {
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist admin auth state
  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Persist admin data
  useEffect(() => {
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));
  }, [adminData]);

  // Persist customers
  useEffect(() => {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    
    // Auto-update metrics based on customers
    const activeCount = customers.filter(c => c.status === 'active').length;
    const totalEmployees = customers.reduce((sum, c) => sum + c.employees.length, 0);
    const complianceFlags = customers.filter(c => c.complianceStatus === 'critical' || c.complianceStatus === 'warning').length;
    
    // Calculate monthly volume (rough estimate based on employees and tiers)
    const monthlyVolume = customers.reduce((sum, c) => {
      if (c.status !== 'active') return sum;
      const employeeCount = c.employees.length;
      const avgSalary = 75000; // Rough estimate
      const monthlyPayroll = (employeeCount * avgSalary) / 12;
      return sum + monthlyPayroll;
    }, 0);
    
    // Calculate revenue (sum of tier percentages)
    const revenue = customers.reduce((sum, c) => {
      if (c.status !== 'active') return sum;
      const employeeCount = c.employees.length;
      const avgSalary = 75000;
      const monthlyPayroll = (employeeCount * avgSalary) / 12;
      const tierPercent = 
        (c.selectedTiers.payroll ? 2 : 0) +
        (c.selectedTiers.tax ? 2 : 0) +
        (c.selectedTiers.advisory ? 1 : 0);
      return sum + (monthlyPayroll * tierPercent / 100);
    }, 0);
    
    setAdminDataState(prev => ({
      ...prev,
      activeClients: activeCount,
      totalEmployeesManaged: totalEmployees,
      monthlyAmexVolume: monthlyVolume,
      revenue: revenue,
      complianceFlags: complianceFlags,
      lastUpdated: new Date().toISOString(),
    }));
  }, [customers]);

  // Persist alerts
  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const login = (email: string, password: string): boolean => {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  };

  const generate2FACode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const verify2FA = (code: string, expectedCode: string): boolean => {
    return code === expectedCode;
  };

  const completeLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const updateAdminData = (data: Partial<AdminData>) => {
    setAdminDataState(prev => ({
      ...prev,
      ...data,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const addCustomer = (customer: Customer) => {
    setCustomersState(prev => [...prev, customer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomersState(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomersState(prev => prev.filter(c => c.id !== id));
    // Remove related alerts
    setAlertsState(prev => prev.filter(a => a.customerId !== id));
  };

  const addAlert = (alert: Alert) => {
    setAlertsState(prev => [...prev, alert]);
  };

  const removeAlert = (id: string) => {
    setAlertsState(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        login,
        verify2FA,
        logout,
        adminData,
        updateAdminData,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        alerts,
        addAlert,
        removeAlert,
        generate2FACode,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
