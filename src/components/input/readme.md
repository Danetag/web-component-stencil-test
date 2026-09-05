# input


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                                                                                    | Type                            | Default     |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------- |
| `disabled`        | `disabled`         |                                                                                                                                                                                | `boolean`                       | `false`     |
| `idInput`         | `id-input`         |                                                                                                                                                                                | `string`                        | `''`        |
| `inputClassnames` | `input-classnames` |                                                                                                                                                                                | `string`                        | `''`        |
| `label`           | `label`            |                                                                                                                                                                                | `string \| undefined`           | `undefined` |
| `labelClassnames` | `label-classnames` |                                                                                                                                                                                | `string`                        | `''`        |
| `maxlength`       | `maxlength`        |                                                                                                                                                                                | `number`                        | `0`         |
| `name`            | `name`             |                                                                                                                                                                                | `string`                        | `''`        |
| `pattern`         | `pattern`          | Pattern used by isValid(). String patterns and programmatic RegExp values are supported. String patterns retain the component's historical partial-match validation semantics. | `RegExp \| string \| undefined` | `undefined` |
| `placeholder`     | `placeholder`      |                                                                                                                                                                                | `string \| undefined`           | `undefined` |
| `prefixInput`     | `prefix-input`     |                                                                                                                                                                                | `string`                        | `''`        |
| `readonly`        | `readonly`         |                                                                                                                                                                                | `boolean`                       | `false`     |
| `required`        | `required`         |                                                                                                                                                                                | `boolean`                       | `false`     |
| `type`            | `type`             |                                                                                                                                                                                | `string`                        | `'text'`    |
| `value`           | `value`            |                                                                                                                                                                                | `string`                        | `''`        |


## Events

| Event          | Description | Type                  |
| -------------- | ----------- | --------------------- |
| `valueChanges` |             | `CustomEvent<string>` |


## Methods

### `getValue() => Promise<string>`

Return the input's current value.

#### Returns

Type: `Promise<string>`



### `isValid() => Promise<boolean>`

Validate the input's current value against its configured constraints.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
