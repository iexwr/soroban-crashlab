"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { FuzzingRun } from "./types";

function DashboardContent() {
  const [runs, setRuns] = useState<FuzzingRun[]>([]);
  const [dataState, setDataState] = useState<"loading" | "error" | "success">("loading");

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const load = async () => {
      setDataState("loading");
      try {
        const res = await fetch("/api/runs", { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRuns(data.runs ?? []);
          setDataState("success");
        }
      } catch {
        if (!cancelled) setDataState("error");
      }
    };
    void load();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [fetchAttempt]);

  const totalRuns = runs.length;
  const runningRuns = runs.filter((r) => r.status === "running").length;
  const failedRuns = runs.filter((r) => r.status === "failed").length;
  const completedRuns = runs.filter((r) => r.status === "completed").length;
  const criticalRuns = runs.filter((r) => r.severity === "critical").length;
  const recentRuns = runs.slice(0, 5);

  return (
    <div className="container-full page-padding fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="heading-page">Dashboard</h1>
          <p className="text-meta mt-0.5 sm:mt-1">Fuzzing campaign overview</p>
        </div>
        <Link href="/runs" className="btn-primary text-xs sm:text-sm px-3 sm:px-6 h-9 sm:h-10">
          <span className="hidden sm:inline">View All Runs</span>
          <span className="sm:hidden">Runs</span>
          <span className="text-sm">→</span>
        </Link>
      </div>

      {dataState === "error" && (
        <div className="card card-padding mb-4 sm:mb-6" style={{ borderLeft: '4px solid #CC1016' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">⚠</span>
            <div>
              <p className="font-semibold" style={{ color: '#CC1016' }}>Connection Error</p>
              <p className="text-meta">Could not reach the backend API.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total Runs', value: dataState === "loading" ? '...' : totalRuns, color: 'var(--text-primary)' },
          { label: 'Running', value: dataState === "loading" ? '...' : runningRuns, color: '#0A66C2' },
          { label: 'Completed', value: dataState === "loading" ? '...' : completedRuns, color: '#057642' },
          { label: 'Failed', value: dataState === "loading" ? '...' : failedRuns, color: '#CC1016' },
          { label: 'Critical', value: dataState === "loading" ? '...' : criticalRuns, color: '#C37D16' },
        ].map((stat) => (
          <div key={stat.label} className="card card-padding stat-card" style={{ padding: '12px 8px' }}>
            <div className="stat-value" style={{ color: stat.color, fontSize: 'clamp(18px, 4vw, 24px)' }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {dataState === "loading" && (
        <div className="card card-padding flex items-center justify-center py-8 sm:py-12">
          <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
          <span className="text-meta">Loading data...</span>
          </div>
        </div>
      )}

      {dataState === "success" && (
        <>
          <div className="section">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="heading-section">Recent Runs</h2>
              <Link href="/runs" className="link text-xs sm:text-sm">View all</Link>
            </div>
            <div className="card table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Area</th>
                    <th className="hidden sm:table-cell">Severity</th>
                    <th className="hidden sm:table-cell">Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.id}>
                      <td className="code-text text-meta">{run.id}</td>
                      <td><span className={`badge badge-${run.status}`}>{run.status}</span></td>
                      <td>{run.area}</td>
                      <td className="hidden sm:table-cell" style={{ color: run.severity === 'critical' ? '#C37D16' : 'var(--text-primary)' }}>{run.severity}</td>
                      <td className="hidden sm:table-cell text-meta">{run.duration.toLocaleString()}ms</td>
                      <td><Link href={`/runs/${run.id}`} className="link text-xs sm:text-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 section">
            <div className="card card-padding">
              <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: 'var(--text-secondary)' }}>Quick Actions</h3>
              <div className="flex flex-col gap-1 sm:gap-2">
                {[
                  { href: '/runs', label: 'Browse all runs' },
                  { href: '/analytics', label: 'View analytics and charts' },
                  { href: '/triage', label: 'Failure triage board' },
                  { href: '/integrations', label: 'Manage integrations' },
                ].map((action) => (
                  <Link key={action.href} href={action.href} className="btn-ghost justify-between text-xs sm:text-sm rounded-lg" style={{ height: 'auto', padding: '8px 10px sm:10px 12px' }}>
                    <span>{action.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="card card-padding">
              <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: 'var(--text-secondary)' }}>System Status</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: 'Backend Status', value: dataState === "success" ? 'Online' : 'Offline', color: dataState === "success" ? '#057642' : '#CC1016' },
                  { label: 'Data Source', value: process.env.NEXT_PUBLIC_API_URL ? 'Remote API' : 'Mock Data' },
                  { label: 'Environment', value: process.env.NEXT_PUBLIC_VERCEL_ENV || 'Development' },
                  { label: 'Smart Contract', value: 'Compiled to WASM (7.4KB)' },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between items-center py-0.5 sm:py-1">
                    <span className="text-meta">{info.label}</span>
                    <span className="text-xs sm:text-sm font-medium" style={{ color: info.color || 'var(--text-primary)' }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="container-full page-padding flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0A66C2', borderTopColor: 'transparent' }} />
          <span className="text-meta">Loading...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
