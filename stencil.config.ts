import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'test',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist-hydrate-script',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    // {
    //   type: 'www',
    //   serviceWorker: null // disable service workers
    // }
  ]
};
