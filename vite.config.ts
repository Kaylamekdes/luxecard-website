import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// public/ is Vite's designated pass-through folder: everything in it is
// copied to dist/ byte-for-byte, untouched by any plugin or asset
// pipeline, which is exactly what public/og-image.png (the WhatsApp/social
// link preview image) needs — it must stay pixel-for-pixel 1200x630 to
// match the og:image:width/height meta tags in index.html, or previews
// render blurry/stretched. If an image-optimization plugin is ever added
// to this config, either scope it away from public/ entirely, or add an
// explicit exclude for og-image.png.
export default defineConfig({
  plugins: [react()],
})
