import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.osta',
  appName: 'OSTA',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
