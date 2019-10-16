import { Component, Prop, h, State, Host, Method } from '@stencil/core';
// import { INPUT_TYPES, InputDefinition, MAXLENGTH, REQUIRED, PATTERN } from '../form/constants';
import { INPUT_TYPES, InputDefinition } from '../form/constants';

@Component({
  tag: 'hrb-input',
  styleUrl: 'input.scss',
  shadow: false
})
export class Input {
  /**
   * Name
   */
  @Prop() name: string = "";

  /**
   * Prefix
   */
  @Prop({attribute: 'prefix-input'}) prefixInput: string = "";

  /**
   * Type
   */
  @Prop() type: string = "text";

  /**
   * Required
   */
  @Prop() required: boolean = false;

  /**
   * Read only
   */
  @Prop() readonly: boolean = false
  
  /**
   * Disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Pattern for validation
   */
  @Prop() pattern: RegExp = null;

  /**
   * Max Length
   */
  @Prop() maxlength: number = 0;

  /**
   * Label
   */
  @Prop() label: string = null;

  /**
   * placeholder
   */
  @Prop() placeholder: string = null;

  /**
   * Classnames for the <label> element
   */
  @Prop({attribute: 'label-classnames'}) labelClassnames: string = '';

  /**
   * Classnames for the <input /> element
   */
  @Prop({attribute: 'input-classnames'}) inputClassnames: string = '';

  /**
   * Input id
   */
  @Prop({attribute: 'id-input'}) idInput: string = '';

  /**
   * Value
   */
  @Prop() value: string = '';

  /**
   * Error state
   */
  @State() error: boolean = false;

  /**
   * Error message
   */
  @State() errorMessage: string = null;

  /**
   * current value
   */
  @State() currentValue: string = '';

  /**
   * internal type object
   */
  @State() inputDefinition: InputDefinition = INPUT_TYPES['text'];

  /**
   * Get the current value of the input. To get a live value of the input, use element.addEventListener('input', () => element.getValue());
   */
  @Method()
  async getValue() {
    return this.currentValue;
  }

  /**
   * Test validation of the current input value.
   */
  @Method()
  async isValid() {
    let isValid = true;

    // Should be validated?
    const shouldBeValidated = this.shouldBeValidated();

    if (!shouldBeValidated) return true;

    isValid = isValid && this.validateRequired();
    isValid = isValid && this.validateMaxLength();
    isValid = isValid && this.validatePattern();

    return isValid;
  }


  private inputElement: HTMLInputElement;


  private formatPatternForDOM(pattern: RegExp): string {
    if (!pattern) return null;

    return (`` + pattern)
      .replace('/^', '')
      .replace('$/', '')
      .replace('/', '//');
  }

  // setError = (error = { error: false, errorMessage: null }) => {
  //   this.error = error;
  //   this.errorMessage = errorMessage;
  // }

  private onInput = ():void => {
    this.isValid().then((valid) => {
      console.log('isValid', valid);
    });
    
    this.currentValue = this.inputElement.value;
  }


  /* Validation */

  private shouldBeValidated(): boolean {
    const required = this.required;
    const maxlength = this.maxlength;
    const readonly = this.readonly;
    const disabled = this.disabled;
    const pattern = this.pattern;

    return !readonly && !disabled && (pattern !== null || required || maxlength > 0);
  }

  private validateRequired(): boolean {
    const value = this.inputElement.value;
    const required = this.required;

    if ((required && typeof value === 'object' && (value === null || Object.keys(value).length === 0)) || (typeof value !== 'object' && required && (!value || !value.length))) {
      // this.setError({ error: true, errorMessage: REQUIRED.message });
      return false;
    }

    return true;
  }

  private validateMaxLength(): boolean {
    const value = this.currentValue;
    const maxlength = this.maxlength;

    if (maxlength > 0 && value && value.length > maxlength) {
      // this.setError({ error: true, errorMessage: MAXLENGTH.message });
      return false;
    }

    return true;
  }

  private validatePattern(): boolean {
    const value = this.currentValue;
    const pattern = this.pattern ? this.pattern : this.inputDefinition.pattern;

    if (pattern && value && !new RegExp(pattern).test(value)) {
      // this.setError({ error: true, errorMessage: PATTERN.message });
      return false;
    }

    return true;
  }

  private getId(): string {
    let { prefixInput, name, idInput } = this;

    if (idInput.length) return idInput;

    return prefixInput + name;
  }

  private getTypeObject(): InputDefinition {
    let type = Object.values(INPUT_TYPES).filter(input => input.type === this.type)[0];
    if (!type) type = INPUT_TYPES['text'];

    return type;
  }

  componentWillLoad() {
    this.currentValue = this.value;
    this.inputDefinition = this.getTypeObject();
  }

  render() {
    // props
    let {
      inputDefinition,
      onInput,
      required,
      label,
      placeholder,
      labelClassnames,
      inputClassnames,
      name,
      type,
      currentValue,
    } = this;
    
    // state
    const { error } = this;

    const id = this.getId();
    const pattern = this.pattern ? this.pattern : inputDefinition.pattern;
    const patternDOM = this.formatPatternForDOM(pattern);
    const maxlength = this.maxlength > 0 ? this.maxlength : null;

    return <Host>
        { label && 
          <label class={`label ${labelClassnames}`} htmlFor={id}>
            {label}
          </label>
        }
        <input
          ref={el => this.inputElement = el as HTMLInputElement}
          type={type}
          name={name}
          id={id}
          onInput={onInput}
          maxLength={maxlength}
          pattern={patternDOM}
          required={required}
          class={`input ${error ? 'input-error' : ""} ${inputClassnames}`}
          placeholder={placeholder}
          value={currentValue}
        />
    </Host>;
  }
}
