import { useApp } from '@/stores/app'
import { useUser } from '@/stores/user'

interface StoreType {
  loading: boolean
  app: ReturnType<typeof useApp>
  user: ReturnType<typeof useUser>
}

declare global {
  interface Window {
    $store: StoreType
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: StoreType
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: StoreType
  }
}