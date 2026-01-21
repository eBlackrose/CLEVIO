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

  it('should make GET request', async () => {
    const mockResponse = { data: 'test' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      status: 200,
    });

    // Dynamic import to ensure mock is applied
    const { apiFetch } = await import('../config/api');

    await apiFetch('/api/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test'),
      expect.any(Object)
    );
  });

  it('should make POST request with body', async () => {
    const mockResponse = { success: true };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      status: 200,
    });

    const { apiFetch } = await import('../config/api');

    await apiFetch('/api/test', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should throw error on non-ok response', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad Request' }),
    });

    const { apiFetch } = await import('../config/api');

    await expect(apiFetch('/api/test')).rejects.toThrow();
  });

  it('should throw error on network failure', async () => {
    (fetch as any).mockRejectedValue(new Error('Network error'));

    const { apiFetch } = await import('../config/api');

    await expect(apiFetch('/api/test')).rejects.toThrow();
  });
});
