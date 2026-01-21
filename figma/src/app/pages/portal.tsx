import { Link } from 'react-router-dom';
import { Lock, Users, Calendar, TrendingUp, FileText } from 'lucide-react';

export function PortalPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <Lock className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl mb-6">Customer Portal</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Preview of what awaits you inside the CLEVIO platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Payroll Dashboard */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-card to-accent backdrop-blur-3xl opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-12 h-12 text-primary/30" />
            </div>
            <div className="relative p-8 backdrop-blur-sm">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl mb-2">Payroll Dashboard</h3>
              <p className="text-muted-foreground">
                Manage employees, run payroll, and track payments
              </p>
            </div>
          </div>
          
          {/* Subscription Overview */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-card to-accent backdrop-blur-3xl opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-12 h-12 text-primary/30" />
            </div>
            <div className="relative p-8 backdrop-blur-sm">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl mb-2">Subscription Overview</h3>
              <p className="text-muted-foreground">
                View and manage your Centurion service tiers
              </p>
            </div>
          </div>
          
          {/* Advisory Scheduling */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-card to-accent backdrop-blur-3xl opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-12 h-12 text-primary/30" />
            </div>
            <div className="relative p-8 backdrop-blur-sm">
              <Calendar className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl mb-2">Advisory Scheduling</h3>
              <p className="text-muted-foreground">
                Book sessions with financial and tax professionals
              </p>
            </div>
          </div>
          
          {/* Financial Analytics */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-card to-accent backdrop-blur-3xl opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-12 h-12 text-primary/30" />
            </div>
            <div className="relative p-8 backdrop-blur-sm">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl mb-2">Financial Analytics</h3>
              <p className="text-muted-foreground">
                Track spending, rewards earned, and financial metrics
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-8">
            Create an account to unlock full access to the CLEVIO platform
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
