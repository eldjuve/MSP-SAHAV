/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOSERVER_URL?: string;
  readonly VITE_NAV_CONFIG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
