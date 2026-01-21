import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Bug } from 'lucide-react';
import { apiFetch } from '../config/api';
import { useUser } from '../contexts/user-context';

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

export function SignInPage() {
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  const [searchParams] = useSearchParams();
  const showDebug = searchParams.get('debug') === 'true';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<{
    lastAttempt?: string;
    lastResponse?: any;
    localStorageState?: any;
  }>({});
  
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // Update debug info
  const updateDebugInfo = (updates: Partial<typeof debugInfo>) => {
    if (isDev) {
      setDebugInfo(prev => ({ ...prev, ...updates }));
    }
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Trigger shake animation
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.group('🔐 CLEVIO Login Debug');
    debugLog('Login attempt initiated:', {
      email,
      timestamp: new Date().toISOString(),
      hasPassword: !!password,
    });
    
    updateDebugInfo({
      lastAttempt: new Date().toISOString(),
      localStorageState: {
        userLoggedIn: localStorage.getItem('userLoggedIn'),
        userEmail: localStorage.getItem('userEmail'),
      },
    });

    setIsLoading(true);

    try {
      debugLog('📤 Sending login request to /api/user/login...');
      
      const requestBody = { email, password };
      debugLog('Request payload:', { email, passwordLength: password.length });
      
      // Call backend API for login
      const response = await apiFetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      debugLog('📥 Login response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      const data = await response.json();
      debugLog('Response data:', data);
      
      updateDebugInfo({ lastResponse: { endpoint: '/api/user/login', status: response.status, data } });

      if (response.ok) {
        // Check if login returned user data (2FA disabled) or just a message (2FA enabled)
        if (data.user && data.token) {
          // Direct login without 2FA
          console.log('✅ Login successful (2FA bypassed for development)');
          debugLog('User data received:', data.user);
          
          // Store user session
          localStorage.setItem('clevio_user', JSON.stringify(data.user));
          localStorage.setItem('clevio_token', data.token);
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          
          debugLog('✓ localStorage.clevio_user =', data.user);
          debugLog('✓ localStorage.clevio_token = [token set]');
          debugLog('✓ localStorage.userLoggedIn = true');
          debugLog('✓ localStorage.userEmail =', email);
          
          toast.success('Welcome to CLEVIO!', {
            description: `Signed in as ${data.user.firstName} ${data.user.lastName}`,
          });
          
          // Redirect to dashboard
          debugLog('Redirecting to dashboard...');
          navigate('/dashboard');
          
        } else {
          // 2FA flow (legacy - not currently used)
          console.log('✅ 2FA code requested successfully');
          debugLog('2FA flow initiated for:', email);
          
          toast.success('Verification code sent to your email', {
            description: `Check ${email} for your 6-digit code`,
          });
          
          if (isDev) {
            toast.info('Development Mode', {
              description: 'Check console for 2FA code',
            });
          }
          
          setShow2FA(true);
          setResendCooldown(60);
          
          debugLog('2FA UI state updated:', { show2FA: true, cooldown: 60 });
          
          // Auto-focus code input
          setTimeout(() => {
            codeRef.current?.focus();
            debugLog('Auto-focused 2FA code input');
          }, 100);
        }
      } else {
        // Error - invalid credentials
        const errorMessage = data.message || 'Invalid email or password';
        
        console.error('❌ Login failed:', {
          status: response.status,
          message: errorMessage,
          data,
        });
        
        setError(errorMessage);
        toast.error('Sign in failed', {
          description: errorMessage,
        });
        
        if (isDev) {
          toast.error('Debug Info', {
            description: `Status: ${response.status} - ${errorMessage}`,
          });
        }
        
        triggerShake();
        debugLog('Error state set, form shake triggered');
      }
    } catch (err: any) {
      // Network or unexpected error
      console.error('❌ Network error during login:', err);
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
      
      updateDebugInfo({ lastResponse: { error: err.message } });
      triggerShake();
    } finally {
      setIsLoading(false);
      console.groupEnd();
      debugLog('Login attempt completed, loading state cleared');
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.group('🔐 CLEVIO 2FA Verification Debug');
    debugLog('2FA verification attempt:', {
      email,
      code: verificationCode,
      codeLength: verificationCode.length,
      timestamp: new Date().toISOString(),
    });

    setIsVerifying(true);

    try {
      debugLog('📤 Sending 2FA verification request to /api/user/verify-2fa...');
      
      const requestBody = { email, code: verificationCode };
      debugLog('Request payload:', requestBody);
      
      const response = await apiFetch('/api/user/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      debugLog('📥 2FA verification response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      const data = await response.json();
      debugLog('Response data:', data);
      
      updateDebugInfo({ lastResponse: { endpoint: '/api/user/verify-2fa', status: response.status, data } });

      if (response.ok) {
        // Success - log in user
        console.log('✅ 2FA verification successful!');
        
        debugLog('Setting localStorage flags...');
        localStorage.setItem('userLoggedIn', 'true');
        debugLog('✓ localStorage.userLoggedIn = true');
        
        localStorage.setItem('userEmail', email);
        debugLog('✓ localStorage.userEmail =', email);
        
        updateDebugInfo({
          localStorageState: {
            userLoggedIn: localStorage.getItem('userLoggedIn'),
            userEmail: localStorage.getItem('userEmail'),
          },
        });
        
        console.log('🎉 User logged in successfully:', email);
        
        // Fetch user data from backend
        debugLog('Fetching user data from backend...');
        await refreshUserData();
        
        toast.success('Welcome back!', {
          description: 'Redirecting to your dashboard...',
        });
        
        debugLog('Redirecting to /dashboard in 500ms...');
        
        setTimeout(() => {
          debugLog('Navigation executing to /dashboard');
          navigate('/dashboard');
        }, 500);
      } else {
        // Invalid or expired code
        const errorMessage = data.message || 'Invalid or expired code';
        
        console.error('❌ 2FA verification failed:', {
          status: response.status,
          message: errorMessage,
          data,
        });
        
        setError(errorMessage);
        toast.error('Verification failed', {
          description: errorMessage,
        });
        
        if (isDev) {
          toast.error('Debug Info', {
            description: `Status: ${response.status} - ${errorMessage}`,
          });
        }
        
        setVerificationCode('');
        triggerShake();
        codeRef.current?.focus();
        
        debugLog('Code cleared, form shake triggered, input refocused');
      }
    } catch (err: any) {
      console.error('❌ Network error during 2FA verification:', err);
      debugError('Exception details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      
      const errorMessage = 'Unable to verify code. Please try again.';
      setError(errorMessage);
      toast.error('Connection error', {
        description: errorMessage,
      });
      
      if (isDev) {
        toast.error('Debug: Network Error', {
          description: err.message || 'Unknown error',
        });
      }
      
      updateDebugInfo({ lastResponse: { error: err.message } });
      triggerShake();
    } finally {
      setIsVerifying(false);
      console.groupEnd();
      debugLog('2FA verification completed, verifying state cleared');
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      debugLog('Resend blocked: cooldown active', { remaining: resendCooldown });
      return;
    }

    console.group('🔁 CLEVIO Resend Code Debug');
    debugLog('Resending verification code for:', email);

    try {
      debugLog('📤 Sending resend request to /api/user/login...');
      
      const response = await apiFetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      debugLog('📥 Resend response received:', {
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        console.log('✅ New verification code sent');
        
        toast.success('New verification code sent', {
          description: 'Check your email for the new code',
        });
        setResendCooldown(60);
        
        debugLog('Cooldown reset to 60 seconds');
      } else {
        console.error('❌ Failed to resend code');
        
        toast.error('Failed to resend code', {
          description: 'Please try signing in again',
        });
      }
    } catch (err: any) {
      console.error('❌ Network error during resend:', err);
      
      toast.error('Connection error', {
        description: 'Unable to resend code',
      });
    } finally {
      console.groupEnd();
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[450px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your CLEVIO account
          </p>
        </div>
        
        {/* Debug Panel (only visible with ?debug=true) */}
        {showDebug && isDev && (
          <div className="mb-6 p-4 bg-accent border border-primary/20 rounded-lg text-xs">
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Debug Panel</h3>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-muted-foreground mb-1">Last Attempt:</p>
                <p className="font-mono">{debugInfo.lastAttempt || 'None'}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">Last Response:</p>
                <pre className="font-mono bg-background p-2 rounded overflow-x-auto">
                  {JSON.stringify(debugInfo.lastResponse, null, 2) || 'None'}
                </pre>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">localStorage State:</p>
                <pre className="font-mono bg-background p-2 rounded overflow-x-auto">
                  {JSON.stringify(debugInfo.localStorageState, null, 2) || 'None'}
                </pre>
              </div>
            </div>
          </div>
        )}
        
        <form 
          onSubmit={show2FA ? handleVerify2FA : handleSignIn} 
          className={`space-y-6 transition-all ${shake ? 'animate-shake' : ''}`}
        >
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block mb-2 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={show2FA}
              className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error && !show2FA
                  ? 'border-destructive focus:ring-destructive/50'
                  : 'border-border focus:ring-primary/50'
              } ${show2FA ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>
          
          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Password</label>
              {!show2FA && (
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={show2FA}
              className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error && !show2FA
                  ? 'border-destructive focus:ring-destructive/50'
                  : 'border-border focus:ring-primary/50'
              } ${show2FA ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {/* 2FA Code Field (appears after initial login) */}
          {show2FA && (
            <div className="animate-fadeIn">
              <label className="block mb-2 text-sm">Verification Code</label>
              <p className="text-sm text-muted-foreground mb-3">
                Enter the 6-digit code sent to <span className="text-foreground">{email}</span>
              </p>
              <input
                type="text"
                ref={codeRef}
                value={verificationCode}
                onChange={(e) => {
                  const newCode = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(newCode);
                  if (isDev) {
                    debugLog('2FA code input changed:', { length: newCode.length, value: newCode });
                  }
                }}
                className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 transition-all text-center text-2xl tracking-widest ${
                  error
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="000000"
                maxLength={6}
                required
                autoComplete="one-time-code"
              />
              
              {/* Resend Code Button */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className={`text-sm transition-all ${
                    resendCooldown > 0
                      ? 'text-muted-foreground cursor-not-allowed'
                      : 'text-primary hover:underline'
                  }`}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'}
                </button>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isVerifying || (show2FA && verificationCode.length !== 6)}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isLoading || isVerifying) && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {isLoading
              ? 'Signing in...'
              : isVerifying
              ? 'Verifying...'
              : show2FA
              ? 'Verify Code'
              : 'Sign In'}
          </button>

          {/* Back to Login (if 2FA shown) */}
          {show2FA && (
            <button
              type="button"
              onClick={() => {
                debugLog('Returning to login form from 2FA');
                setShow2FA(false);
                setVerificationCode('');
                setError(null);
                setResendCooldown(0);
              }}
              className="w-full px-8 py-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-sm"
            >
              Back to Sign In
            </button>
          )}
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Create Account
          </Link>
        </p>
        
        {/* Debug Link (only in development) */}
        {isDev && !showDebug && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/signin?debug=true" className="underline">
              Enable Debug Panel
            </Link>
          </p>
        )}
      </div>
      
      {/* Shake Animation CSS */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}