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
- `simple-input`: labelled native `<input>` wrapper (preferred)
- `hrb-input`: deprecated compatibility adapter for the original input API
- `simple-button`: themed button with optional click count
- `my-component`: basic greeting example

`simple-*` is the replacement naming used by this package for the input and button components; the npm package name and loader paths remain unchanged.

Generated component properties and usage examples are documented in each component's `readme.md` after a build.

### Native elements, not native subclasses

These are autonomous custom elements, not customized built-in elements (`<input is="...">`). `simple-input` and `simple-button` render real `<input>` and `<button>` controls in **light DOM**. The grid components wrap layout elements; they do not extend the complete API of a native element.

There is no implicit React-style `{...props}` forwarding in Stencil. Only declared `@Prop()` values are forwarded to the inner control. Other attributes—including `id`, `class`, `style`, `title`, `data-*`, and `aria-*`—remain on the custom-element **host**. We deliberately do not mirror arbitrary attributes or event handlers.

| Component | Forwarded native-control props |
| --- | --- |
| `simple-input` | `name`, `type`, `value`, `required`, `readonly`, `disabled`, `pattern`, `maxlength`, `placeholder`, `autocomplete`, `inputmode`, `min`, `max`, `step`, `minlength`, `multiple`, `form` |
| `simple-button` | `type` (defaults to `button`), `disabled`, `name`, `value`, `form`, `formnovalidate` |
| Both | `accessibleLabel` → native `aria-label`; `describedBy` → native `aria-describedby` |

In HTML, use `accessible-label` and `described-by`. Use `id-input` / `id-button` for the inner control's ID, not host `id`. Prefer the input's visible `label` or the button's slotted text for an accessible name. Do not put an interactive role or `tabindex` on the wrapper; keyboard focus belongs on the native control. `input-classnames` styles the input; ordinary `class` styles the host.

```html
<form id="account">
  <simple-input
    name="email" id-input="account-email" label="Email"
    type="email" autocomplete="email" required described-by="email-help"
  ></simple-input>
  <p id="email-help">Use your account email address.</p>
  <simple-button type="submit" name="action" value="save">Save</simple-button>
</form>
```

Use explicit, unique `id-input` values when multiple controls share a name. Otherwise the ID is `prefix-input` + `name`, or an automatically generated ID for unnamed controls.

The inner native controls participate in enclosing forms (or the form named by `form`). The hosts are **not form-associated custom elements**: they do not expose the full native methods/properties API. After hydration, access the light-DOM control when an unexposed API is needed:

```ts
const field = document.querySelector('simple-input')!;
await field.componentOnReady();
const input = field.querySelector('input')!;
input.focus();
input.reportValidity();
```

Listen for bubbling native `input` / `change` / `click` events on the host; the event target is the native control. `simple-input` also emits `valueChanges` with a string detail on both `input` and committed `change` events. `value` is a setter prop, not a live mirror of user edits; use `getValue()` or event detail. Native form reset does not synchronize the component's stored value; applications needing reset should update `value` explicitly or use native controls directly. File inputs likewise require the native `files` API.

`isValid()` is a legacy required/maxlength/pattern check, **not** `input.checkValidity()`. New native constraints such as `min`, `max`, `step`, and `minlength` are enforced by the browser, not this helper. If you need unrestricted HTML attributes, complete native APIs, or standard form lifecycle behavior, prefer a native `<input>` / `<button>` rather than assuming these wrappers are drop-in replacements.

### Migrating from `hrb-input`

Replace both opening and closing tags with `simple-input`. Existing input props, methods, and `valueChanges` listeners remain supported. TypeScript references change from `HTMLHrbInputElement` to `HTMLSimpleInputElement`.

`hrb-input` remains registered only as a compatibility adapter for one migration window (at least one compatibility release after v0.3.0). It delegates to `simple-input` without duplicating validation logic and retains the original prop surface; new native props are offered on `simple-input` only. Its `valueChanges` event is re-emitted on the legacy host to preserve the event target for normal bubbling listeners. Capture-phase listeners can also observe the inner event before it is stopped; use a bubbling listener (the default), or migrate to `simple-input`, to receive one notification per native event.

As intentional fixes in the deprecated tag, `hrb-input` now forwards `type` values unrecognized by its legacy presets (such as `password`, `tel`, and `url`) to the native input instead of coercing them to `text`, and unnamed inputs without an explicit `id-input` now receive a generated ID.

The adapter adds one light-DOM level: `hrb-input > simple-input > input`. Migrate direct-child CSS selectors such as `hrb-input > input` to `simple-input > input` (or temporarily use `hrb-input input`). Host-based selectors also need the new tag when you migrate. Removing the legacy tag will require a separately announced breaking release; it is not removed here.

### Input pattern compatibility

Both input tags' `pattern` prop accepts either a string (including the HTML `pattern` attribute) or a `RegExp` assigned programmatically. A `RegExp` is rendered to the native input as its `.source` string. The component's `isValid()` method preserves the historical JavaScript partial-match behavior for unanchored patterns; use anchors such as `^...$` when an exact match is required. The browser's native HTML pattern validation still applies its standard full-string semantics.

## Why Sass remains

Sass generates the grid's breakpoint-specific column and offset classes using loops, arithmetic, and mixins. Removing it would replace a compact source with a large hand-maintained CSS matrix or another generator. It is a build-only dependency; consumers do not need Sass. The input has no component stylesheet. Converting individual small stylesheets would not remove the grid's Sass dependency, so this change leaves the existing styles alone.

## Storybook

The legacy Storybook 5 setup was removed because its addons and webpack integration are no longer maintained. The Stencil development server is the supported local component preview. A future Storybook reintroduction should use a current Storybook release and web-components renderer rather than restoring the old configuration.
