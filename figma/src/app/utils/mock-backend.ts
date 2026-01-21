/**
 * Mock Backend API for Development
 * 
 * This file provides mock implementations of backend API endpoints.
 * In production, these would be replaced with actual backend API calls.
 */

// Development logging
const isDev = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in-memory for development)
const mockUsers = new Map<string, { password: string; firstName: string; lastName: string; companyName: string }>();

// Pre-populate with demo account
mockUsers.set('demo@clevio.online', {
  password: 'demo1234',
  firstName: 'Demo',
  lastName: 'User',
  companyName: 'CLEVIO Demo Company'
});

// Mock 2FA codes (in-memory for development)
const mock2FACodes = new Map<string, { code: string; expires: number }>();

// Debug helper to view current state
(window as any).CLEVIO_DEBUG = {
  viewUsers: () => {
    console.log('👥 Mock Users:', Array.from(mockUsers.keys()));
    return Array.from(mockUsers.entries());
  },
  view2FACodes: () => {
    console.log('🔐 Active 2FA Codes:');
    const codes = Array.from(mock2FACodes.entries());
    codes.forEach(([email, data]) => {
      const timeLeft = data.expires - Date.now();
      console.log(`  ${email}: ${data.code} (expires in ${Math.round(timeLeft / 1000)}s)`);
    });
    return codes;
  },
  clearCodes: () => {
    mock2FACodes.clear();
    console.log('🗑️ All 2FA codes cleared');
  }
};

console.log('💡 Debug helpers available: window.CLEVIO_DEBUG.viewUsers(), window.CLEVIO_DEBUG.view2FACodes()');

/**
 * Mock API: User Signup
 */
export async function mockSignup(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}) {
  console.group('🔧 Mock API: /api/user/signup');
  debugLog('Request data:', { ...data, password: '[REDACTED]' });
  
  await delay(800); // Simulate network delay
  debugLog('Network delay completed (800ms)');

  // Check if user already exists
  if (mockUsers.has(data.email)) {
    console.warn('❌ User already exists:', data.email);
    console.groupEnd();
    return {
      ok: false,
      status: 400,
      json: async () => ({ message: 'Email already registered' }),
    };
  }

  // Store user
  mockUsers.set(data.email, {
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    companyName: data.companyName,
  });

  debugLog('✅ User created successfully:', data.email);
  debugLog('Total users in mock database:', mockUsers.size);
  console.groupEnd();

  return {
    ok: true,
    status: 200,
    json: async () => ({ message: 'Account created successfully' }),
  };
}

/**
 * Mock API: User Login (sends 2FA code)
 */
export async function mockLogin(data: { email: string; password: string }) {
  console.group('🔧 Mock API: /api/user/login');
  debugLog('Request data:', { email: data.email, password: '[REDACTED]' });
  
  await delay(1000); // Simulate network delay
  debugLog('Network delay completed (1000ms)');

  const user = mockUsers.get(data.email);
  debugLog('User lookup result:', user ? 'Found' : 'Not found');

  // Check credentials
  if (!user || user.password !== data.password) {
    console.warn('❌ Invalid credentials for:', data.email);
    console.groupEnd();
    return {
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid email or password' }),
    };
  }

  // 2FA DISABLED - Direct login
  console.log('✅ Login successful (2FA disabled for development)');
  console.log(`   User: ${user.firstName} ${user.lastName}`);
  console.log(`   Company: ${user.companyName}`);
  console.groupEnd();

  return {
    ok: true,
    status: 200,
    json: async () => ({ 
      message: 'Login successful',
      user: {
        email: data.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName
      },
      token: 'mock-jwt-token-' + Date.now() // Mock JWT token
    }),
  };
}

/**
 * Mock API: Verify 2FA Code
 */
export async function mockVerify2FA(data: { email: string; code: string }) {
  console.group('🔧 Mock API: /api/user/verify-2fa');
  debugLog('Request data:', data);
  
  // Show all codes currently in Map BEFORE lookup
  console.log('📋 All 2FA codes in Map BEFORE verification:');
  console.log('   Map size:', mock2FACodes.size);
  mock2FACodes.forEach((value, key) => {
    console.log(`   ${key}: ${value.code} (expires in ${Math.round((value.expires - Date.now()) / 1000)}s)`);
  });
  
  console.log('🔍 Looking up code for email:', `"${data.email}"`);
  console.log('   Email type:', typeof data.email);
  console.log('   Email length:', data.email?.length);
  
  await delay(600); // Simulate network delay
  debugLog('Network delay completed (600ms)');

  const stored = mock2FACodes.get(data.email);
  debugLog('Stored 2FA code lookup:', stored ? 'Found' : 'Not found');

  // Check if code exists and is valid
  if (!stored) {
    console.warn('❌ No 2FA code found for:', data.email);
    
    // Additional debugging
    console.log('🔍 Debugging why code was not found:');
    const allEmails = Array.from(mock2FACodes.keys());
    console.log('   Emails in Map:', allEmails);
    console.log('   Requested email:', data.email);
    console.log('   Exact match exists?', mock2FACodes.has(data.email));
    
    // Check for similar emails (in case of whitespace issues)
    allEmails.forEach(email => {
      const similarity = email.trim().toLowerCase() === data.email?.trim().toLowerCase();
      console.log(`   "${email}" vs "${data.email}": similar? ${similarity}`);
    });
    
    console.groupEnd();
    return {
      ok: false,
      status: 400,
      json: async () => ({ message: 'No verification code sent. Please sign in again.' }),
    };
  }

  // Check if code expired
  const now = Date.now();
  const timeRemaining = stored.expires - now;
  debugLog('Code expiry check:', {
    now: new Date(now).toISOString(),
    expires: new Date(stored.expires).toISOString(),
    timeRemainingMs: timeRemaining,
    isExpired: timeRemaining <= 0,
  });

  if (now > stored.expires) {
    mock2FACodes.delete(data.email);
    console.warn('❌ Code expired for:', data.email);
    console.groupEnd();
    return {
      ok: false,
      status: 400,
      json: async () => ({ message: 'Verification code expired. Please sign in again.' }),
    };
  }

  // Normalize codes for comparison (trim whitespace, ensure string type)
  const submittedCode = String(data.code || '').trim();
  const expectedCode = String(stored.code || '').trim();
  
  // Check if code matches
  console.log('🔍 Code Comparison Debug:');
  console.log('   Submitted code:', `"${submittedCode}"`, `(length: ${submittedCode.length}, type: ${typeof submittedCode})`);
  console.log('   Expected code:', `"${expectedCode}"`, `(length: ${expectedCode.length}, type: ${typeof expectedCode})`);
  console.log('   Match result:', submittedCode === expectedCode);

  if (submittedCode !== expectedCode) {
    console.warn('❌ Invalid code submitted for:', data.email);
    console.groupEnd();
    return {
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid verification code' }),
    };
  }

  // Success - clear code
  mock2FACodes.delete(data.email);
  debugLog('✅ 2FA verification successful for:', data.email);
  debugLog('Code cleared from storage');
  console.groupEnd();

  return {
    ok: true,
    status: 200,
    json: async () => ({ message: 'Verification successful' }),
  };
}

/**
 * Intercept fetch calls to /api/* and route to mock functions
 */
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Only intercept /api/* calls
  if (url.startsWith('/api/')) {
    console.group('🌐 Mock Backend Interceptor');
    debugLog('Intercepted request to:', url);
    debugLog('Method:', init?.method || 'GET');
    
    try {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      debugLog('Request body parsed successfully');

      let result;
      
      if (url === '/api/user/signup') {
        debugLog('Routing to mockSignup()');
        result = await mockSignup(body);
      } else if (url === '/api/user/login') {
        debugLog('Routing to mockLogin()');
        result = await mockLogin(body);
      } else if (url === '/api/user/verify-2fa') {
        debugLog('Routing to mockVerify2FA()');
        result = await mockVerify2FA(body);
      } else {
        // Unknown endpoint
        console.warn('⚠️ Unknown API endpoint:', url);
        result = {
          ok: false,
          status: 404,
          json: async () => ({ message: 'Endpoint not found' }),
        };
      }

      debugLog('Response status:', result.status);
      console.groupEnd();

      // Create a mock Response object
      return new Response(JSON.stringify(await result.json()), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('❌ Mock API error:', error);
      console.groupEnd();
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Pass through all other requests
  return originalFetch(input, init);
};

console.log('\n🚀 ═══════════════════════════════════════');
console.log('   CLEVIO Mock Backend API Initialized');
console.log('   Environment: Development');
console.log('   Endpoints: /api/user/signup, /api/user/login, /api/user/verify-2fa');
console.log('   Debug logging: ENABLED');
console.log('═══════════════════════════════════════\n');
debugLog('📝 Test user credentials will be logged to console');