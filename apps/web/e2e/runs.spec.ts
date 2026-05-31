import { test, expect } from '@playwright/test';

const baseUrl = process.env.TEST_BASE_URL ?? process.env.BASE_URL ?? 'http://localhost:3000';

const mockRuns = [
  {
    id: 'run-1001',
    status: 'completed',
    area: 'state',
    severity: 'high',
    duration: 180000,
    seedCount: 12500,
    cpuInstructions: 12300000,
  },
  {
    id: 'run-1002',
    status: 'failed',
    area: 'auth',
    severity: 'critical',
    duration: 240000,
    seedCount: 18200,
    cpuInstructions: 15200000,
  },
  {
    id: 'run-1003',
    status: 'running',
    area: 'budget',
    severity: 'medium',
    duration: 90000,
    seedCount: 9800,
    cpuInstructions: 8100000,
  },
];

test.describe('Runs list', () => {
  test('loads and renders the fuzzing runs list', async ({ page }) => {
    await page.route('**/api/runs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ runs: mockRuns, total: mockRuns.length }),
      });
    });

    await page.goto(`${baseUrl}/runs`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Fuzzing Runs' })).toBeVisible();
    await expect(page.getByText(`${mockRuns.length} Total Runs`)).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(mockRuns.length);
    await expect(page.getByText('#1001')).toBeVisible();
    await expect(page.getByText('#1002')).toBeVisible();
    await expect(page.getByText('critical')).toBeVisible();
  });

  test('shows an error state when the runs API fails and recovers after retry', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/runs', async (route) => {
      requestCount += 1;

      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ runs: mockRuns, total: mockRuns.length }),
      });
    });

    await page.goto(`${baseUrl}/runs`, { waitUntil: 'networkidle' });

    await expect(page.getByText('Failed to load fuzzing runs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();

    await page.getByRole('button', { name: 'Retry' }).click();

    await expect(page.getByRole('heading', { name: 'Fuzzing Runs' })).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(mockRuns.length);
  });
});
