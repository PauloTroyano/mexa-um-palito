import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' para o build abrir via file:// dentro do Electron
export default defineConfig({ plugins: [react()], base: './' });
