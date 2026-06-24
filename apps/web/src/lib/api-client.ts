import { FuzzingRun, CrashEvent, SignatureFrequency, CrashTrendPoint } from '../app/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function apiUrl(path: string): string {
  return `${API_BASE}/api${path}`;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  runs: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<{ runs: FuzzingRun[]; total: number }>(`/runs${qs}`);
    },
    get: (id: string) => apiFetch<FuzzingRun>(`/runs/${encodeURIComponent(id)}`),
  },
  analytics: {
    trends: () => apiFetch<{ trends: CrashTrendPoint[]; signatures: SignatureFrequency[] }>('/runs/trends'),
    events: () => apiFetch<{ events: CrashEvent[] }>('/runs/events'),
  },
  webhooks: {
    list: () => apiFetch<{ webhooks: unknown[] }>('/webhooks'),
  },
  integrations: {
    list: () => apiFetch<{ integrations: unknown[] }>('/integrations'),
  },
};

export async function fetchRuns(): Promise<{ runs: FuzzingRun[]; total: number }> {
  try {
    if (API_BASE) {
      return await api.runs.list();
    }
  } catch {
    // fall through to mock
  }
  const { buildMockRuns } = await import('../app/mockRuns');
  const runs = buildMockRuns();
  return { runs, total: runs.length };
}

export async function fetchRun(id: string): Promise<FuzzingRun | null> {
  try {
    if (API_BASE) {
      return await api.runs.get(id);
    }
  } catch {
    // fall through to mock
  }
  const { buildMockRuns } = await import('../app/mockRuns');
  const runs = buildMockRuns();
  return runs.find((r) => r.id === id) ?? null;
}
