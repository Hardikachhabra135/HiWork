import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// If .env is in admin panel, use '.', otherwise fall back to parent directory
const dir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.resolve('.');
const envDir = fs.existsSync(path.resolve(dir, '.env'))
  ? dir
  : path.resolve(dir, '..');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir,
  build: {
    outDir: 'dist',
  },
});

