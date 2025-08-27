import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 0.0.0.0 바인드 → 같은 와이파이에서 접속 가능
    port: 5173,
  },
})
