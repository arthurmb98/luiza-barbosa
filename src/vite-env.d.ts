/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ADS_ID?: string
  readonly VITE_GOOGLE_ADS_CONVERSION_LABEL?: string
  readonly VITE_GOOGLE_ADS_ANAMNESIS_CONVERSION_LABEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
