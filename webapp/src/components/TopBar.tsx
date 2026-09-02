const INCOIS_URL = 'https://incois.gov.in/portal/stormsurge/webgis.jsp';

export function TopBar() {
  return (
    <div class="bg-gray-100 px-5 py-2.5 flex items-center justify-between h-16 shrink-0 relative">
      <img src="/img/mspy.png" alt="MSP" class="h-full max-w-[50%] object-contain" />
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
