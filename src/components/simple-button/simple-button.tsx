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
    this.nbOfClicks += 1;
  };

  render() {
    const theme = THEMES.includes(this.theme) ? this.theme : 'primary';

    return (
      <button class={`simple-button ${theme}`} type="button" onClick={this.handleClick}>
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
