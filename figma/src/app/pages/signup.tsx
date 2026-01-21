import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../config/api';

// Development logging helper
const isDev = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

const debugError = (...args: any[]) => {
  if (isDev) {
    console.error(...args);
  }
};

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (step < 3) {
      debugLog(`📝 Signup: Moving to step ${step + 1}`);
      setStep(step + 1);
    } else {
      // Final submission - call backend API
      console.group('📝 CLEVIO Signup Debug');
      debugLog('Signup attempt:', {
        email: formData.email,
        companyName: formData.companyName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        timestamp: new Date().toISOString(),
      });
      
      setIsLoading(true);
      
      try {
        debugLog('📤 Sending signup request to /api/user/signup...');
        
        const requestBody = {
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        
        debugLog('Request payload:', { ...requestBody, password: '[REDACTED]' });
        
        const response = await apiFetch('/api/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        debugLog('📥 Signup response received:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        });

        const data = await response.json();
        debugLog('Response data:', data);

        if (response.ok) {
          // Success - redirect to signin
          console.log('✅ Account created successfully for:', formData.email);
          
          toast.success('Account created successfully!', {
            description: 'Please sign in to continue',
          });
          
          debugLog('Redirecting to /signin in 1000ms...');
          
          setTimeout(() => {
            debugLog('Navigation executing to /signin');
            navigate('/signin');
          }, 1000);
        } else {
          // Error from backend
          const errorMessage = data.message || 'Failed to create account. Please try again.';
          
          console.error('❌ Signup failed:', {
            status: response.status,
            message: errorMessage,
            data,
          });
          
          setError(errorMessage);
          toast.error('Signup failed', {
            description: errorMessage,
          });
          
          if (isDev) {
            toast.error('Debug Info', {
              description: `Status: ${response.status} - ${errorMessage}`,
            });
          }
          
          // Go back to first step if there's an error
          debugLog('Returning to step 1 due to error');
          setStep(1);
        }
      } catch (err: any) {
        // Network or unexpected error
        console.error('❌ Network error during signup:', err);
        debugError('Exception details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
        
        const errorMessage = 'Unable to connect to server. Please try again.';
        setError(errorMessage);
        toast.error('Connection error', {
          description: errorMessage,
        });
        
        if (isDev) {
          toast.error('Debug: Network Error', {
            description: err.message || 'Unknown error',
          });
        }
        
        setStep(1);
      } finally {
        setIsLoading(false);
        console.groupEnd();
        debugLog('Signup attempt completed');
      }
    }
  };
  
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[500px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Create Account</h1>
          <p className="text-muted-foreground">
            Join CLEVIO and transform your payroll and financial operations
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                s <= step ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'
              }`}>
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block mb-2 text-sm">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your Company Inc."
                  required
                  autoComplete="organization"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Must be at least 8 characters
                </p>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-sm">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John"
                  required
                  autoComplete="given-name"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Doe"
                  required
                  autoComplete="family-name"
                />
              </div>
            </>
          )}
          
          {step === 3 && (
            <div className="text-center py-8">
              <Check className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Ready to get started!</h3>
              <p className="text-muted-foreground mb-8">
                Click continue to create your CLEVIO account
              </p>
              
              {/* Summary */}
              <div className="bg-accent rounded-lg p-6 text-left mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Owner</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{formData.firstName} {formData.lastName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading
              ? 'Creating account...'
              : step < 3
              ? 'Continue'
              : 'Complete Setup'}
          </button>
          
          {step > 1 && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setStep(step - 1);
                setError(null);
              }}
              className="w-full px-8 py-4 bg-card border border-border rounded-lg hover:bg-accent transition-all"
            >
              Back
            </button>
          )}
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}