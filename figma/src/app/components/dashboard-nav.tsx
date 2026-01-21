import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Settings,
  Briefcase,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/dashboard/payroll', icon: DollarSign, label: 'Payroll' },
  { path: '/dashboard/employees', icon: Users, label: 'Employees & Contractors' },
  { path: '/dashboard/services', icon: Briefcase, label: 'Services & Subscriptions' },
  { path: '/dashboard/advisory', icon: Calendar, label: 'Advisory Sessions' },
  { path: '/dashboard/payments', icon: CreditCard, label: 'Payments & AMEX' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="text-2xl tracking-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CLEVIO
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground px-4 py-2">
            Services provided by licensed and insured professionals
          </p>
        </div>
        
        <div className="p-4 border-t border-border">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-muted-foreground hover:bg-accent hover:text-foreground w-full"
            onClick={() => {
              // Clear user login data
              localStorage.removeItem('userLoggedIn');
              localStorage.removeItem('userEmail');
              toast.success('Logged out successfully');
              navigate('/signin');
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="lg:ml-64 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}