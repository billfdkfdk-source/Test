import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // 解决 index.css 404 的核心
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // 保持你的路径别名一致
    },
  },
})
