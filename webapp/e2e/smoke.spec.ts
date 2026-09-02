import { test, expect } from '@playwright/test';

// Deliberately independent of a live GeoServer: NAV_ITEMS renders
// regardless of whether nav.json's discovery resolves, so this only
// exercises the static shell (branding, nav labels, map tools) rather than
// GeoServer-backed content. See docs/Technical/data_formats.md for what a
// GeoServer-dependent check would need (the demo-geoserver stack running).
test('renders the top bar branding and nav shell', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Marine Spatial Planning')).toBeVisible();
  await expect(page.getByRole('link', { name: /INCOIS Services/ })).toBeVisible();

  for (const label of ['Data Repository', 'Status Indicators', 'Conflicts & Compatibilities']) {
    await expect(page.getByText(label)).toBeVisible();
  }

  await expect(page.getByRole('button', { name: 'Layers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Legend' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Basemaps' })).toBeVisible();
});
