import { Component, Event, EventEmitter, h, Method, Prop } from '@stencil/core';

/** @deprecated Use simple-input. This adapter retains the pre-0.4 input API. */
@Component({
  tag: 'hrb-input',
  shadow: false,
})
export class Input {
  @Prop() name = '';
  @Prop({ attribute: 'prefix-input' }) prefixInput = '';
  @Prop() type = 'text';
  @Prop() required = false;
  @Prop() readonly = false;
  @Prop() disabled = false;
  /** String or programmatic RegExp; preserves historical partial-match validation. */
  @Prop() pattern?: string | RegExp;
  @Prop() maxlength = 0;
  @Prop() label?: string;
  @Prop() placeholder?: string;
  @Prop({ attribute: 'label-classnames' }) labelClassnames = '';
  @Prop({ attribute: 'input-classnames' }) inputClassnames = '';
  @Prop({ attribute: 'id-input' }) idInput = '';
  @Prop() value = '';

  /** Emitted once on the legacy host, preserving its event target and payload. */
  @Event() valueChanges!: EventEmitter<string>;

  private control?: HTMLSimpleInputElement;

  private async getControl(): Promise<HTMLSimpleInputElement> {
    const control = this.control;
    if (!control) {
      throw new Error('hrb-input: inner simple-input is not available.');
    }
    // Non-lazy output targets do not expose componentOnReady().
    await control.componentOnReady?.();
    return control;
  }

  /** Return the input's current value. */
  @Method()
  async getValue(): Promise<string> {
    const control = await this.getControl();
    return control.getValue();
  }

  /** Legacy required/maxlength/pattern check, not the full native constraint-validation API. */
  @Method()
  async isValid(): Promise<boolean> {
    const control = await this.getControl();
    return control.isValid();
  }

  render() {
    return (
      <simple-input
        ref={element => { this.control = element; }}
        name={this.name}
        prefixInput={this.prefixInput}
        type={this.type}
        required={this.required}
        readonly={this.readonly}
        disabled={this.disabled}
        pattern={this.pattern}
        maxlength={this.maxlength}
        label={this.label}
        placeholder={this.placeholder}
        labelClassnames={this.labelClassnames}
        inputClassnames={this.inputClassnames}
        idInput={this.idInput}
        value={this.value}
        onValueChanges={event => {
          event.stopPropagation();
          this.valueChanges.emit(event.detail);
        }}
      />
    );
  }
}
