import { Component, h, Prop, State, Watch } from '@stencil/core';

const THEMES = ['primary', 'secondary'] as const;

@Component({
  tag: 'simple-button',
  styleUrl: 'simple-button.scss',
  shadow: false,
})
export class SimpleButton {
  /** Show the number of clicks. */
  @Prop({ attribute: 'show-click' }) showNbOfClick = false;

  /** Visual theme. */
  @Prop() theme: 'primary' | 'secondary' = 'primary';

  /** Native button behavior; defaults to button to avoid accidental submission. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** Disable the native button, including keyboard activation. */
  @Prop() disabled = false;

  /** Native submitter name. */
  @Prop() name?: string;

  /** Native submitter value. */
  @Prop() value?: string;

  /** ID of the form owning the native button. */
  @Prop() form?: string;

  /** Skip native form validation when this button submits. */
  @Prop() formnovalidate = false;

  /** ID on the native button; host id stays on the custom element. */
  @Prop({ attribute: 'id-button' }) idButton?: string;

  /** Accessible name on the native button. Prefer visible slotted text. */
  @Prop() accessibleLabel?: string;

  /** Space-separated IDs of descriptions for the native button (aria-describedby). */
  @Prop() describedBy?: string;

  @State() nbOfClicks = 0;

  @Watch('theme')
  validateTheme(theme: string): void {
    if (!(THEMES as readonly string[]).includes(theme)) {
      console.warn(`Invalid simple-button theme "${theme}"; using "primary".`);
    }
  }

  componentWillLoad(): void {
    this.validateTheme(this.theme);
  }

  private handleClick = (): void => {
    if (!this.disabled) this.nbOfClicks += 1;
  };

  render() {
    const theme = THEMES.includes(this.theme) ? this.theme : 'primary';

    return (
      <button
        class={`simple-button ${theme}`}
        type={this.type}
        disabled={this.disabled}
        name={this.name}
        value={this.value}
        form={this.form}
        formNoValidate={this.formnovalidate}
        id={this.idButton}
        aria-label={this.accessibleLabel}
        aria-describedby={this.describedBy}
        onClick={this.handleClick}
      >
        <span class="label">
          <slot />
        </span>
        {this.showNbOfClick && this.nbOfClicks > 0 && (
          <span class="nb-of-clicks">{` - ${this.nbOfClicks}`}</span>
        )}
      </button>
    );
  }
}
