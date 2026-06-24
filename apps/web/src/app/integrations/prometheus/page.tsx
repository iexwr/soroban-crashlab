'use client';

import React from 'react';

import MetricsExportToPrometheus from '../../integrate-metrics-export-to-prometheus';

export default function PrometheusPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <MetricsExportToPrometheus />
    </div>
  );
}
