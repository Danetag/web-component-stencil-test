import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { INPUT_TYPES, InputDefinition } from '../form/constants';

let nextInputId = 0;

@Component({
  tag: 'simple-input',
  shadow: false,
})
export class SimpleInput {
  /** Native input name used in form submission. */
  @Prop() name = '';
  /** Prefix for the native input ID when name is provided; prefer idInput. */
  @Prop({ attribute: 'prefix-input' }) prefixInput = '';
  /** Native input type, or the legacy zip-code preset (text with a US ZIP pattern). */
  @Prop() type = 'text';
  /** Native required constraint. */
  @Prop() required = false;
  /** Make the native input read-only. */
  @Prop() readonly = false;
  /** Disable the native input and omit it from form submission. */
  @Prop() disabled = false;
  /**
   * Pattern used by isValid(). String patterns and programmatic RegExp values are supported.
   * String patterns retain the component's historical partial-match validation semantics.
   */
  @Prop() pattern?: string | RegExp;
  /** Native maximum length; zero means no limit for compatibility. */
  @Prop() maxlength = 0;
  /** Visible label associated with the native input. */
  @Prop() label?: string;
  /** Native placeholder; not a replacement for a label. */
  @Prop() placeholder?: string;
  /** Additional classes on the label, not the host. */
  @Prop({ attribute: 'label-classnames' }) labelClassnames = '';
  /** Additional classes on the native input, not the host. */
  @Prop({ attribute: 'input-classnames' }) inputClassnames = '';
  /** Native input ID (host id stays on the custom element). Use a unique ID per control. */
  @Prop({ attribute: 'id-input' }) idInput = '';
  /** Set the current value; user edits are exposed through getValue() and valueChanges. */
  @Prop() value = '';
  /** Native autocomplete token(s), such as email or current-password. */
  @Prop() autocomplete?: string;
  /** Native virtual-keyboard hint. */
  @Prop() inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /** Native minimum value for number/date-like inputs. */
  @Prop() min?: string;
  /** Native maximum value for number/date-like inputs. */
  @Prop() max?: string;
  /** Native step interval, or any. */
  @Prop() step?: string;
  /** Native minimum length; checked by browser validity, not isValid(). */
  @Prop() minlength?: number;
  /** Allow multiple values for native types that support it. */
  @Prop() multiple = false;
  /** ID of the form owning the native input. */
  @Prop() form?: string;
  /** Accessible name on the native input when no visible label is available. Prefer label. */
  @Prop() accessibleLabel?: string;
  /** Space-separated IDs of descriptions for the native input (aria-describedby). */
  @Prop() describedBy?: string;

  @State() currentValue = '';

  /** Emitted with the current value on native input and change events. */
  @Event() valueChanges!: EventEmitter<string>;

  private inputElement!: HTMLInputElement;
  private fallbackId = `simple-input-${++nextInputId}`;

  @Watch('value')
  watchValue(value: string): void {
    this.currentValue = value;
  }

  /** Return the input's current value. */
  @Method()
  async getValue(): Promise<string> {
    return this.currentValue;
  }

  /** Legacy required/maxlength/pattern check, not the full native constraint-validation API. */
  @Method()
  async isValid(): Promise<boolean> {
    if (!this.shouldBeValidated()) {
      return true;
    }

    return this.validateRequired() && this.validateMaxLength() && this.validatePattern();
  }

  componentWillLoad(): void {
    this.currentValue = this.value;
  }

  private onChange = (event: Event): void => {
    this.valueChanges.emit((event.target as HTMLInputElement).value);
  };

  private onInput = (): void => {
    this.currentValue = this.inputElement.value;
    this.valueChanges.emit(this.currentValue);
  };

  private shouldBeValidated(): boolean {
    return !this.readonly && !this.disabled && (Boolean(this.pattern) || this.required || this.maxlength > 0);
  }

  private validateRequired(): boolean {
    return !this.required || this.currentValue.length > 0;
  }

  private validateMaxLength(): boolean {
    return this.maxlength <= 0 || this.currentValue.length <= this.maxlength;
  }

  private validatePattern(): boolean {
    const pattern = this.pattern ?? this.getTypeDefinition().pattern;
    return !pattern || !this.currentValue || new RegExp(pattern).test(this.currentValue);
  }

  private formatPatternForDom(pattern?: string | RegExp): string | undefined {
    return pattern instanceof RegExp ? pattern.source : pattern;
  }

  private getId(): string {
    return this.idInput || (this.name ? `${this.prefixInput}${this.name}` : this.fallbackId);
  }

  private getTypeDefinition(): InputDefinition {
    return Object.values(INPUT_TYPES).find(input => input.type === this.type) ?? { type: this.type, inputType: this.type };
  }

  render() {
    const id = this.getId();
    const definition = this.getTypeDefinition();
    const pattern = this.pattern ?? definition.pattern;
    const maxLength = this.maxlength > 0 ? this.maxlength : undefined;

    return (
      <Host>
        {this.label && (
          <label class={`label ${this.labelClassnames}`.trim()} htmlFor={id}>
            {this.label}
          </label>
        )}
        <input
          ref={element => {
            if (element) this.inputElement = element;
          }}
          type={definition.inputType}
          name={this.name}
          id={id}
          onInput={this.onInput}
          onChange={this.onChange}
          maxLength={maxLength}
          pattern={this.formatPatternForDom(pattern)}
          required={this.required}
          readOnly={this.readonly}
          disabled={this.disabled}
          class={`input ${this.inputClassnames}`.trim()}
          placeholder={this.placeholder}
          autoComplete={this.autocomplete}
          inputMode={this.inputmode}
          min={this.min}
          max={this.max}
          step={this.step}
          minLength={this.minlength}
          multiple={this.multiple}
          form={this.form}
          aria-label={this.accessibleLabel}
          aria-describedby={this.describedBy}
          value={this.currentValue}
        />
      </Host>
    );
  }
}
