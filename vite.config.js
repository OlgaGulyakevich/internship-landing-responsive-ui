import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/** @type {import('vite').UserConfig} */
export default ({ command }) => ({
  plugins: [
    VitePluginSvgSpritemap('img/sprite/*.svg', {
      styles: false,
      injectSVGOnDev: true,
      output: {
        filename: '__spritemap.svg',
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'img/**/*',
          dest: 'img'
        }
      ]
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|svg)$/i,
      includePublic: false,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                convertPathData: {
                  floatPrecision: 2,
                  forceAbsolutePath: false,
                  utilizeAbsolute: false,
                },
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                cleanupIds: false,
              },
            },
          },
          'removeDimensions',
        ],
      },
      png: {
        // https://sharp.pixelplumbing.com/api-output#png
        quality: 80,
        palette: true
      },
      jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
        progressive: true
      },
      jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
        progressive: true
      },
      // Cache assets in cacheLocation. When enabled, reads and writes asset files with their hash suffix from the specified path.
      cache: true,
      cacheLocation: './.cache',
    }),
  ],
  css: {
    devSourcemap: true
  },
  publicDir: 'public',
  root: './source',
  build: {
    outDir: '../dist',
  },
  // Base path: dev uses root, production uses GitHub Pages subdirectory
  base: command === 'serve' ? '/' : '/internship-landing-responsive-ui/',
  server: {
    port: 3000,
  }
});
