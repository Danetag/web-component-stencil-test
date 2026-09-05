# simple-button

A light-DOM wrapper around a native `<button>`, not an `HTMLButtonElement` subclass. Defaults to `type="button"`; opt into `submit` or `reset`. Declared native props target the button; arbitrary attributes, `class`, and `id` stay on the host. Use `id-button`, `accessible-label`, and `described-by` to target the control. Prefer visible slotted text for its name. Listen for bubbling native `click` events and let the inner button handle keyboard focus. See the [native API guide](../../../readme.md#native-elements-not-native-subclasses).

## Examples

```html
  <simple-button show-click theme="secondary">I'm a simple button</simple-button>
```

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                   | Type                              | Default     |
| ----------------- | ------------------ | ----------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `accessibleLabel` | `accessible-label` | Accessible name on the native button. Prefer visible slotted text.            | `string \| undefined`             | `undefined` |
| `describedBy`     | `described-by`     | Space-separated IDs of descriptions for the native button (aria-describedby). | `string \| undefined`             | `undefined` |
| `disabled`        | `disabled`         | Disable the native button, including keyboard activation.                     | `boolean`                         | `false`     |
| `form`            | `form`             | ID of the form owning the native button.                                      | `string \| undefined`             | `undefined` |
| `formnovalidate`  | `formnovalidate`   | Skip native form validation when this button submits.                         | `boolean`                         | `false`     |
| `idButton`        | `id-button`        | ID on the native button; host id stays on the custom element.                 | `string \| undefined`             | `undefined` |
| `name`            | `name`             | Native submitter name.                                                        | `string \| undefined`             | `undefined` |
| `showNbOfClick`   | `show-click`       | Show the number of clicks.                                                    | `boolean`                         | `false`     |
| `theme`           | `theme`            | Visual theme.                                                                 | `"primary" \| "secondary"`        | `'primary'` |
| `type`            | `type`             | Native button behavior; defaults to button to avoid accidental submission.    | `"button" \| "reset" \| "submit"` | `'button'`  |
| `value`           | `value`            | Native submitter value.                                                       | `string \| undefined`             | `undefined` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The default slot |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
