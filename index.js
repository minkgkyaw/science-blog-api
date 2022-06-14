import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import consola from 'consola'
;(async () => {
  try {
    await esbuild.build({
      entryPoints: ['./src/app.js'],
      bundle: true,
      outfile: './out/server.js',
      define: { DEBUG: 'true' },
      write: true,
      platform: 'node',
      format: 'iife',
      minify: true,
      target: ['es2020', 'node14'],
      watch: {
        onRebuild: err => {
          if (err)
            return consola.error(`Something went wrong on rebuilding esbuild!\n${err.message}`)
          return consola.info('Rebuild succeed.')
        },
      },
      metafile: true,
      incremental: true,
      publicPath: './public',
      plugins: [nodeExternalsPlugin()],
    })
    return consola.success('Ebuild success')
  } catch (err) {
    return consola.error(`Something went wrong on building esbuild! \n${err.message}`)
  }
})()
