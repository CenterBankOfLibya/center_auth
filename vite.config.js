import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,        // listen on all addresses (0.0.0.0)
    port: 5173,        // default Vite port
    strictPort: false, // pick next if taken
    allowedHosts: ['cblwebsite'],
  },
})