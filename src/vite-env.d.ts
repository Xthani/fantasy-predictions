/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin without `/api` suffix, e.g. http://localhost:8000 */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
