/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOSERVER_URL?: string;
  readonly VITE_NAV_CONFIG?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_ICON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
