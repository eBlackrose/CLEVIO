import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  type: 'employee' | 'contractor';
  bankStatus?: 'connected' | 'pending';
  payrollStatus?: 'active' | 'inactive';
  // Secure fields
  ssn?: string; // For employees (masked in display)
  ein?: string; // For contractors (masked in display)
  bankAccount?: string; // Last 4 digits
  routingNumber?: string; // Full routing number
  bankName?: string;
  salary?: number; // Annual salary or hourly rate
}

interface AdvisorySession {
  id: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  advisor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  link?: string;
}

interface UserData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  ein?: string;
  businessAddress?: string;
  phone?: string;
  employees?: Employee[];
  amexCard?: {
    last4: string;
    name: string;
    expiry?: string;
  };
  selectedTiers?: {
    payroll: boolean;
    tax: boolean;
    advisory: boolean;
  };
  advisorySessions?: AdvisorySession[];
  nextPayrollDate?: string | null; // ISO date string or null
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'clevio_user_data';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(() => {
    // Initialize from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Persist to localStorage whenever userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [userData]);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => {
      if (!prev) return data as UserData;
      return { ...prev, ...data };
    });
  };
  
  const clearUserData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserDataState(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, updateUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}