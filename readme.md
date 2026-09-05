# web-component-stencil-test

A small web component library built with [Stencil](https://stenciljs.com/). It includes responsive grid primitives, a validated input, and example button and greeting components.

## Requirements

- Node.js 20 or 22
- npm 10 or newer

## Development

```bash
npm ci
npm start
```

The development server rebuilds components as files change.

## Verification

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
npm pack --dry-run
```

`npm test` runs all Jest component specs with Stencil's mock DOM. `npm run test:e2e` runs the browser smoke tests separately so local unit-test iterations stay fast.

CI runs type checking, component specs, browser smoke tests, the production build, and a package dry run on Node.js 20 and 22.

## Build output

```bash
npm run build
```

Stencil writes the distributable package to `dist/`, the custom-elements loader to `loader/`, generated API documentation alongside each component, and a development site to `www/`.

Consumers can register the components with the generated loader:

```ts
import { defineCustomElements } from 'web-component-stencil-test/loader';

defineCustomElements();
```

## Components

- `grid-container`, `grid-row`, `grid-col`, and `grid-ghost`: responsive grid primitives
- `hrb-input`: labelled input with required, maximum-length, and pattern validation
- `simple-button`: themed button with optional click count
- `my-component`: basic greeting example

Generated component properties and usage examples are documented in each component's `readme.md` after a build.

### Input pattern compatibility

`hrb-input.pattern` accepts either a string (including the HTML `pattern` attribute) or a `RegExp` assigned programmatically. A `RegExp` is rendered to the native input as its `.source` string. The component's `isValid()` method preserves the historical JavaScript partial-match behavior for unanchored patterns; use anchors such as `^...$` when an exact match is required. The browser's native HTML pattern validation still applies its standard full-string semantics.

## Storybook

The legacy Storybook 5 setup was removed because its addons and webpack integration are no longer maintained. The Stencil development server is the supported local component preview. A future Storybook reintroduction should use a current Storybook release and web-components renderer rather than restoring the old configuration.
