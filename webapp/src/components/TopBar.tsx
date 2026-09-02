const INCOIS_URL = 'https://incois.gov.in/portal/stormsurge/webgis.jsp';

// Baked in at build time, the same way VITE_GEOSERVER_URL/VITE_NAV_CONFIG
// override their own defaults — lets a different deployment ship its own
// branding without a source change.
const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? 'Marine Spatial Planning';
const APP_ICON = import.meta.env.VITE_APP_ICON ?? '/img/india.png';

export function TopBar() {
  return (
    <div class="bg-gray-100 px-5 py-2.5 flex items-center justify-between h-16 shrink-0 relative">
      <div class="flex items-center gap-3 h-full min-w-0">
        <img src={APP_ICON} alt="" class="h-full object-contain" />
        <span class="text-xl font-semibold text-msp-darker truncate">{APP_TITLE}</span>
      </div>
      <a
        href={INCOIS_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="INCOIS Services"
        class="flex items-center gap-2 text-sm font-semibold text-[#36383a] hover:opacity-80"
      >
        <img src="/img/incois.png" alt="INCOIS" class="h-9 w-9 object-contain" />
        INCOIS Services
      </a>
    </div>
  );
}
