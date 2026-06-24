'use client';

import React from 'react';
import DatabaseMigrationIntegrationTests from '../../integrate-database-migration-integration-tests';

export default function DbMigrationsIntegrationPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <DatabaseMigrationIntegrationTests />
    </div>
  );
}
