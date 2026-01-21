/**
 * API Configuration
 * 
 * Controls whether to use the mock backend or real backend server.
 * 
 * TO ENABLE REAL EMAIL SENDING:
 * 1. Set USE_REAL_BACKEND = true (DONE)
 * 2. Start the backend server: cd server && npm run dev
 * 3. Make sure EMAIL_MODE is configured in server/.env
 */

// Set to true to use real backend with email sending
export const USE_REAL_BACKEND = true;

// Backend API URL (only used when USE_REAL_BACKEND is true)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Get the full API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  if (USE_REAL_BACKEND) {
    // Use real backend server
    return `${API_BASE_URL}${endpoint}`;
  } else {
    // Use mock backend (intercepted by mock-backend.ts)
    return endpoint;
  }
}

/**
 * API fetch wrapper with automatic URL handling and JWT authentication
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  // Get JWT token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Add Authorization header if token exists
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (USE_REAL_BACKEND) {
    console.log(`🌐 Real Backend API: ${options?.method || 'GET'} ${url}`, token ? '🔐 [Authenticated]' : '🔓 [Anonymous]');
  } else {
    console.log(`🔧 Mock Backend API: ${options?.method || 'GET'} ${endpoint}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}
