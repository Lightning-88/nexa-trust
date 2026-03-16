import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '.prisma/client/default': './node_modules/.prisma/client/default.js',
      'dotenv/config': './node_modules/dotenv/config.js',
    },
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: './src/server.ts',
        },
      },
    },
  },
  plugins: [
    devtools(),
    nitro({ minify: true }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
