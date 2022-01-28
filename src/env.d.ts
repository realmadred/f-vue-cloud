/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT: number
    readonly VITE_OPEN: boolean
    readonly VITE_PUBLIC_PATH: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}