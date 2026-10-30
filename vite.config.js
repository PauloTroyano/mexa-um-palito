import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' para o build abrir via file:// dentro do Electron
const isElectron = process.env.BUILD_TARGET === 'electron';
export default defineConfig({ plugins: [react()], base: isElectron ? './' : '/mexa-um-palito/' });
