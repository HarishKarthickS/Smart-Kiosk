import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // If specific dependencies cause issues, you can exclude them from optimization:
  optimizeDeps: {
    exclude: ['chunk-L6NIQNSU', 'chunk-66BPO7BD', 'chunk-LMEBRK3L']
  }
});
