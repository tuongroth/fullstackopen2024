import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',   // Output directory for production build
    assetsDir: '',    // Directory for assets like images or fonts
    sourcemap: false, // Disable sourcemaps for production
    minify: true      // Minify JavaScript, CSS, and HTML
  }
});
