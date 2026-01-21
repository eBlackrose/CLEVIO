/**
 * API Client Tests
 * Tests the API fetch wrapper and error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('should make GET request with query params', async () => {
    const mockResponse = { data: 'test' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Dynamic import to ensure mock is applied
    const { apiFetch } = await import('../utils/api-client');

    const result = await apiFetch('/api/test', {
      params: { id: '123' },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test?id=123'),
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  it('should make POST request with body', async () => {
    const mockResponse = { success: true };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { apiFetch } = await import('../utils/api-client');

    const body = { name: 'Test' };
    await apiFetch('/api/test', {
      method: 'POST',
      body,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      })
    );
  });

  it('should throw error on non-ok response', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad Request' }),
    });

    const { apiFetch } = await import('../utils/api-client');

    await expect(apiFetch('/api/test')).rejects.toThrow();
  });

  it('should throw error on network failure', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));

    const { apiFetch } = await import('../utils/api-client');

    await expect(apiFetch('/api/test')).rejects.toThrow('Network error');
  });
});
