import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'test',
  globalStyle: 'src/globals/app.scss',
  plugins: [
    sass({
      injectGlobalPaths: [
        "src/globals/app.scss"
      ]
    })
  ],
  outputTargets: [
    {
      // type: 'dist-hydrate-script',
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      prerenderLocations: [
        { path: '/button' }
      ],
      serviceWorker: null // disable service workers
    }
  ]
};
