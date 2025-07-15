declare module '*.module.css';
declare module 'lodash.debounce';

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // ... add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
