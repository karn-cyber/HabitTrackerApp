import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                success: resolve(__dirname, 'success.html'),
                bundles: resolve(__dirname, 'ai-video-bundles.html'),
            },
        },
    },
});
