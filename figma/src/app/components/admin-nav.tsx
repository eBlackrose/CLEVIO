import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Calendar, Menu, X, AlertCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('clevio_admin_auth');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };
  
  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/clients', label: 'Client Accounts', icon: Users },
    { path: '/admin/compliance', label: 'Compliance', icon: Shield, badge: 3 },
    { path: '/admin/advisory', label: 'Advisory Queue', icon: Calendar, badge: 18 },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Top Admin Bar */}
      <div className="bg-destructive/10 border-b border-destructive/30 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-destructive" style={{ fontWeight: 600 }}>INTERNAL OPERATIONS DASHBOARD</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span>Operations Team Access</span>
            <span>•</span>
            <span>Logged in as: admin@clevio.com</span>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar + Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card min-h-[calc(100vh-57px)]">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/admin" className="block">
              <div className="text-2xl tracking-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  CLEVIO
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Operations</div>
            </Link>
          </div>
          
          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-destructive/20 text-destructive'
                    }`} style={{ fontWeight: 600 }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Back to Main Site */}
          <div className="p-4 border-t border-border">
            <Link
              to="/"
              className="block w-full px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-center text-sm"
            >
              Exit to Main Site
            </Link>
          </div>
          
          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-center text-sm"
            >
              <LogOut className="w-4 h-4 mr-2 inline-block" />
              Logout
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] overflow-auto">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl tracking-tight" style={{ fontFamily: 'CLEVIO, Inter, sans-serif', fontWeight: 600 }}>
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  CLEVIO
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-[57px] z-50 bg-background">
              <nav className="p-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-destructive/20 text-destructive'
                        }`} style={{ fontWeight: 600 }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
                
                <Link
                  to="/"
                  className="block w-full px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-center text-sm mt-6"
                >
                  Exit to Main Site
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-center text-sm mt-6"
                >
                  <LogOut className="w-4 h-4 mr-2 inline-block" />
                  Logout
                </button>
              </nav>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}