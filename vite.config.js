import { defineConfig } from 'vite';

const isolationHeaders = (res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
};

export default defineConfig({
  // Relative asset paths keep the build deployable under a subpath too.
  base: './',
  plugins: [{
    name: 'docmind-webgpu-isolation-headers',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        isolationHeaders(res);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        isolationHeaders(res);
        next();
      });
    }
  }],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2022',
    chunkSizeWarningLimit: 1800
  }
});
