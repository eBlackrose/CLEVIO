import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '../../contexts/admin-context';
import * as Dialog from '@radix-ui/react-dialog';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login, verify2FA, generate2FACode } = useAdmin();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check credentials
    const isValid = login(email, password);
    
    if (isValid) {
      // Generate 2FA code
      const code = generate2FACode();
      setGeneratedCode(code);
      
      // Simulate sending email
      console.log(`🔐 2FA Code sent to ${email}: ${code}`);
      toast.success(`2FA code sent to ${email}`, {
        description: `Code: ${code} (Check console in production)`,
      });
      
      // Show 2FA modal
      setShow2FAModal(true);
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password',
      });
    }
    
    setIsLoading(false);
  };
  
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify code
    const isValid = verify2FA(twoFACode, generatedCode);
    
    if (isValid) {
      toast.success('Login successful', {
        description: 'Welcome to CLEVIO Admin',
      });
      
      // Set logged in state
      localStorage.setItem('clevio_admin_auth', 'true');
      
      // Redirect to admin
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } else {
      toast.error('Invalid code', {
        description: 'Please check the 6-digit code and try again',
      });
      setTwoFACode('');
    }
    
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl mb-2">CLEVIO Admin</h1>
          <p className="text-muted-foreground">Secure administrative portal</p>
        </div>
        
        {/* Login Form */}
        <div className="p-8 bg-card border border-border rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="admin@clevio.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Continue to 2FA'}
            </button>
          </form>
          
          {/* Info Box */}
          <div className="mt-6 p-4 bg-accent border border-border rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="mb-1">Admin Access Only</p>
              <p className="text-muted-foreground text-xs">
                This portal is restricted to authorized CLEVIO administrators. All login attempts are logged.
              </p>
            </div>
          </div>
        </div>
        
        {/* Demo Credentials (remove in production) */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-yellow-600/80">Email: chad@huzle.com</p>
          <p className="text-xs text-yellow-600/80">Password: AtlantaAtlanta1!2@3#</p>
        </div>
      </div>
      
      {/* 2FA Modal */}
      <Dialog.Root open={show2FAModal} onOpenChange={setShow2FAModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-card border border-border rounded-2xl z-50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <Dialog.Title className="text-2xl mb-2">Two-Factor Authentication</Dialog.Title>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
            
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Verification Code</label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setTwoFACode(value);
                  }}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Code expires in 5 minutes
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFACode('');
                  }}
                  className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || twoFACode.length !== 6}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </div>
            </form>
            
            {/* Demo Code Display */}
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-600 text-center">
                Demo Code: {generatedCode}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
