# input


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                          | Type      | Default  |
| ----------------- | ------------------ | ------------------------------------ | --------- | -------- |
| `disabled`        | `disabled`         | Disabled                             | `boolean` | `false`  |
| `idInput`         | `id-input`         | Input id                             | `string`  | `''`     |
| `inputClassnames` | `input-classnames` | Classnames for the <input /> element | `string`  | `''`     |
| `label`           | `label`            | Label                                | `string`  | `null`   |
| `labelClassnames` | `label-classnames` | Classnames for the <label> element   | `string`  | `''`     |
| `maxlength`       | `maxlength`        | Max Length                           | `number`  | `0`      |
| `name`            | `name`             | Name                                 | `string`  | `""`     |
| `pattern`         | --                 | Pattern for validation               | `RegExp`  | `null`   |
| `placeholder`     | `placeholder`      | placeholder                          | `string`  | `null`   |
| `prefixInput`     | `prefix-input`     | Prefix                               | `string`  | `""`     |
| `readonly`        | `readonly`         | Read only                            | `boolean` | `false`  |
| `required`        | `required`         | Required                             | `boolean` | `false`  |
| `type`            | `type`             | Type                                 | `string`  | `"text"` |
| `value`           | `value`            | Value                                | `string`  | `''`     |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `valueChange` |             | `CustomEvent<any>` |


## Methods

### `getValue() => Promise<string>`

Get the current value of the input. To get a live value of the input, use element.addEventListener('input', () => element.getValue());

#### Returns

Type: `Promise<string>`



### `isValid() => Promise<boolean>`

Test validation of the current input value.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
