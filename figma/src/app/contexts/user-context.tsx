import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../config/api';

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
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'clevio_user_data';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(() => {
    // Initialize from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from backend
  const refreshUserData = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/user/me`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform backend data to match UserData interface
        const transformedData: UserData = {
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          companyName: data.company?.name || '',
          ein: data.company?.ein || undefined,
          businessAddress: data.company?.businessAddress || undefined,
          phone: data.company?.phone || undefined,
          employees: data.company?.employees?.map((emp: any) => ({
            id: emp.id,
            name: emp.fullName,
            email: emp.email,
            type: emp.type,
            bankStatus: emp.accountLast4 ? 'connected' : 'pending',
            payrollStatus: emp.status === 'active' ? 'active' : 'inactive',
            ssn: emp.ssnLast4 ? `***-**-${emp.ssnLast4}` : undefined,
            bankAccount: emp.accountLast4 || undefined,
            routingNumber: emp.routingNumber || undefined,
            bankName: emp.bankName || undefined,
            salary: emp.salary || undefined,
          })) || [],
          amexCard: data.amexCard ? {
            last4: data.amexCard.last4,
            name: data.amexCard.cardName,
            expiry: data.amexCard.expiryMonth && data.amexCard.expiryYear 
              ? `${data.amexCard.expiryMonth}/${data.amexCard.expiryYear}`
              : undefined,
          } : undefined,
          selectedTiers: data.company?.subscriptions ? {
            payroll: data.company.subscriptions.payrollEnabled,
            tax: data.company.subscriptions.taxEnabled,
            advisory: data.company.subscriptions.advisoryEnabled,
          } : {
            payroll: false,
            tax: false,
            advisory: false,
          },
          advisorySessions: data.advisorySessions?.map((session: any) => ({
            id: session.id,
            type: session.type,
            date: new Date(session.date).toISOString().split('T')[0],
            time: session.time,
            duration: session.duration,
            advisor: session.advisor,
            status: session.status,
            link: session.meetingLink,
          })) || [],
          nextPayrollDate: data.company?.payrollSchedule?.nextPayrollDate || null,
        };
        
        setUserDataState(transformedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const email = localStorage.getItem('userEmail');
    
    if (isLoggedIn && email && !userData) {
      refreshUserData();
    }
  }, []);

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
    localStorage.removeItem('authToken'); // Clear JWT token
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    setUserDataState(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, updateUserData, clearUserData, refreshUserData, isLoading }}>
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