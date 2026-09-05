import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { INPUT_TYPES, InputDefinition } from '../form/constants';

@Component({
  tag: 'hrb-input',
  styleUrl: 'input.scss',
  shadow: false,
})
export class Input {
  @Prop() name = '';
  @Prop({ attribute: 'prefix-input' }) prefixInput = '';
  @Prop() type = 'text';
  @Prop() required = false;
  @Prop() readonly = false;
  @Prop() disabled = false;
  /**
   * Pattern used by isValid(). String patterns and programmatic RegExp values are supported.
   * String patterns retain the component's historical partial-match validation semantics.
   */
  @Prop() pattern?: string | RegExp;
  @Prop() maxlength = 0;
  @Prop() label?: string;
  @Prop() placeholder?: string;
  @Prop({ attribute: 'label-classnames' }) labelClassnames = '';
  @Prop({ attribute: 'input-classnames' }) inputClassnames = '';
  @Prop({ attribute: 'id-input' }) idInput = '';
  @Prop() value = '';

  @State() currentValue = '';
  @State() inputDefinition: InputDefinition = INPUT_TYPES.text;

  @Event() valueChanges!: EventEmitter<string>;

  private inputElement!: HTMLInputElement;

  @Watch('value')
  watchValue(value: string): void {
    this.currentValue = value;
  }

  /** Return the input's current value. */
  @Method()
  async getValue(): Promise<string> {
    return this.currentValue;
  }

  /** Validate the input's current value against its configured constraints. */
  @Method()
  async isValid(): Promise<boolean> {
    if (!this.shouldBeValidated()) {
      return true;
    }

    return this.validateRequired() && this.validateMaxLength() && this.validatePattern();
  }

  componentWillLoad(): void {
    this.currentValue = this.value;
    this.inputDefinition = this.getTypeDefinition();
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
    const pattern = this.pattern ?? this.inputDefinition.pattern;
    return !pattern || !this.currentValue || new RegExp(pattern).test(this.currentValue);
  }

  private formatPatternForDom(pattern?: string | RegExp): string | undefined {
    return pattern instanceof RegExp ? pattern.source : pattern;
  }

  private getId(): string {
    return this.idInput || `${this.prefixInput}${this.name}`;
  }

  private getTypeDefinition(): InputDefinition {
    return Object.values(INPUT_TYPES).find(input => input.type === this.type) ?? INPUT_TYPES.text;
  }

  render() {
    const id = this.getId();
    const pattern = this.pattern ?? this.inputDefinition.pattern;
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
          type={this.inputDefinition.inputType}
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
          value={this.currentValue}
        />
      </Host>
    );
  }
}
