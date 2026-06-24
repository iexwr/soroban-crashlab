import { NextResponse } from 'next/server';

/**
 * Attempts to forward a request to a remote backend API.
 * Falls back to the fallback handler if the backend is unavailable or not configured.
 *
 * @param backendUrl - The base URL of the remote backend (e.g. from process.env)
 * @param path - The path to forward to (e.g. '/runs')
 * @param options - Fetch options
 * @param fallback - Handler to call if no backend is configured or the request fails
 */
export async function tryBackend<T>(
  backendUrl: string | undefined,
  path: string,
  options: RequestInit,
  fallback: () => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}${path}`, {
        ...options,
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
      return NextResponse.json(
        { error: 'Upstream error', statusCode: res.status },
        { status: res.status },
      );
    } catch {
      return NextResponse.json(
        { error: 'Backend unavailable', statusCode: 503 },
        { status: 503 },
      );
    }
  }
  return fallback();
}
