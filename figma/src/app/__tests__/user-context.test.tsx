/**
 * UserContext Tests
 * Tests user state management and authentication flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '../contexts/user-context';
import React from 'react';

// Mock the API client
vi.mock('../utils/api-client', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '../utils/api-client';

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide initial null user state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    expect(result.current.userData).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set user data', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      companyName: 'Test Co',
      employees: [],
      subscriptions: [],
    };

    act(() => {
      result.current.setUserData(mockUser as any);
    });

    expect(result.current.userData).toEqual(mockUser);
    expect(localStorage.getItem('userLoggedIn')).toBe('true');
    expect(localStorage.getItem('userEmail')).toBe('test@example.com');
  });

  it('should clear user data', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    // Set user first
    act(() => {
      result.current.setUserData({
        id: 1,
        email: 'test@example.com',
      } as any);
    });

    // Clear user
    act(() => {
      result.current.clearUserData();
    });

    expect(result.current.userData).toBeNull();
    expect(localStorage.getItem('userLoggedIn')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });

  it('should refresh user data from API', async () => {
    const mockApiResponse = {
      id: 1,
      email: 'test@example.com',
      company: {
        id: 1,
        name: 'Test Company',
      },
      employees: [],
      subscriptions: [],
      payrollSchedule: null,
      advisorySessions: [],
      amexCard: null,
      billingHistory: [],
    };

    (apiFetch as any).mockResolvedValue(mockApiResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    // Set initial user with email
    act(() => {
      result.current.setUserData({
        id: 1,
        email: 'test@example.com',
      } as any);
    });

    // Refresh data
    await act(async () => {
      await result.current.refreshUserData();
    });

    await waitFor(() => {
      expect(result.current.userData?.companyName).toBe('Test Company');
    });

    expect(apiFetch).toHaveBeenCalledWith(
      '/api/user/me',
      expect.objectContaining({
        params: { email: 'test@example.com' },
      })
    );
  });

  it('should handle API error gracefully', async () => {
    (apiFetch as any).mockRejectedValue(new Error('Network error'));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UserProvider>{children}</UserProvider>
    );

    const { result } = renderHook(() => useUser(), { wrapper });

    // Set initial user
    act(() => {
      result.current.setUserData({
        id: 1,
        email: 'test@example.com',
      } as any);
    });

    // Try to refresh (should fail gracefully)
    await act(async () => {
      await result.current.refreshUserData();
    });

    // User data should still exist (not cleared on error)
    expect(result.current.userData).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });
});
