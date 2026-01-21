import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ComplianceIssue {
  id: string;
  clientId: string;
  clientName: string;
  type: 'employee_minimum' | 'amex_verification' | 'contract_expiry' | 'advisory_overdue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected: string;
  daysOpen: number;
  status: 'open' | 'acknowledged' | 'resolved';
}

export interface AdvisorySession {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  advisorName: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
  type: 'initial' | 'quarterly' | 'annual' | 'adhoc';
  notes?: string;
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  isFullDay: boolean;
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  createdAt: string;
}

interface AdminData {
  complianceIssues: ComplianceIssue[];
  advisorySessions: AdvisorySession[];
  blockedDates: BlockedDate[];
}

interface AdminDataContextType {
  adminData: AdminData;
  addComplianceIssue: (issue: Omit<ComplianceIssue, 'id'>) => void;
  updateComplianceIssue: (id: string, updates: Partial<ComplianceIssue>) => void;
  deleteComplianceIssue: (id: string) => void;
  addAdvisorySession: (session: Omit<AdvisorySession, 'id'>) => void;
  updateAdvisorySession: (id: string, updates: Partial<AdvisorySession>) => void;
  deleteAdvisorySession: (id: string) => void;
  addBlockedDate: (blocked: Omit<BlockedDate, 'id' | 'createdAt'>) => void;
  removeBlockedDate: (id: string) => void;
  isDateBlocked: (date: string, time?: string) => boolean;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const STORAGE_KEY = 'clevio_admin_data';

const defaultAdminData: AdminData = {
  complianceIssues: [],
  advisorySessions: [],
  blockedDates: [],
};

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [adminData, setAdminData] = useState<AdminData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultAdminData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
  }, [adminData]);

  const addComplianceIssue = (issue: Omit<ComplianceIssue, 'id'>) => {
    const newIssue: ComplianceIssue = {
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAdminData(prev => ({
      ...prev,
      complianceIssues: [...prev.complianceIssues, newIssue],
    }));
  };

  const updateComplianceIssue = (id: string, updates: Partial<ComplianceIssue>) => {
    setAdminData(prev => ({
      ...prev,
      complianceIssues: prev.complianceIssues.map(issue =>
        issue.id === id ? { ...issue, ...updates } : issue
      ),
    }));
  };

  const deleteComplianceIssue = (id: string) => {
    setAdminData(prev => ({
      ...prev,
      complianceIssues: prev.complianceIssues.filter(issue => issue.id !== id),
    }));
  };

  const addAdvisorySession = (session: Omit<AdvisorySession, 'id'>) => {
    const newSession: AdvisorySession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setAdminData(prev => ({
      ...prev,
      advisorySessions: [...prev.advisorySessions, newSession],
    }));
  };

  const updateAdvisorySession = (id: string, updates: Partial<AdvisorySession>) => {
    setAdminData(prev => ({
      ...prev,
      advisorySessions: prev.advisorySessions.map(session =>
        session.id === id ? { ...session, ...updates } : session
      ),
    }));
  };

  const deleteAdvisorySession = (id: string) => {
    setAdminData(prev => ({
      ...prev,
      advisorySessions: prev.advisorySessions.filter(session => session.id !== id),
    }));
  };

  const addBlockedDate = (blocked: Omit<BlockedDate, 'id' | 'createdAt'>) => {
    const newBlocked: BlockedDate = {
      ...blocked,
      id: `blocked-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setAdminData(prev => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlocked],
    }));
  };

  const removeBlockedDate = (id: string) => {
    setAdminData(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(blocked => blocked.id !== id),
    }));
  };

  const isDateBlocked = (date: string, time?: string): boolean => {
    return adminData.blockedDates.some(blocked => {
      if (blocked.date !== date) return false;
      
      if (blocked.isFullDay) return true;
      
      if (time && blocked.startTime && blocked.endTime) {
        return time >= blocked.startTime && time <= blocked.endTime;
      }
      
      return false;
    });
  };

  return (
    <AdminDataContext.Provider
      value={{
        adminData,
        addComplianceIssue,
        updateComplianceIssue,
        deleteComplianceIssue,
        addAdvisorySession,
        updateAdvisorySession,
        deleteAdvisorySession,
        addBlockedDate,
        removeBlockedDate,
        isDateBlocked,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
}
