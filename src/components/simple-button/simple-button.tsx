import { Component, Prop, Watch, State, h } from '@stencil/core';

@Component({
  tag: 'simple-button',
  styleUrl: 'simple-button.scss',
  shadow: false
})
export class SimpleButton {
  /**
   * Show number of clicks
   */
  @Prop({attribute: 'show-click'}) showNbOfClick: boolean = false;

  /**
   * theme
   */
  @Prop() theme: string = 'primary';
  @Watch('theme')
  validateTheme(newValue: string) {
    const themes = ['primary', 'secondary'];
    const themeIsValidate = themes.indexOf(newValue) > -1;
    
    if (!themeIsValidate) { throw new Error('theme: not a valide theme')  }
  }

  /**
   * Number of clicks
   */
  @State() nbOfClicks: number = 0;

  componentWillLoad() {
    this.validateTheme(this.theme);
  }

  handleClick = () => {
    this.nbOfClicks += 1;
  }

  render() {
    return <button class={`simple-button ${this.theme}`} onClick={ this.handleClick }>
      <span class="label"><slot /></span>
      { this.showNbOfClick && this.nbOfClicks > 0 && (<span class="nb-of-clicks">{` - ${this.nbOfClicks}`}</span>) }
    </button>;
  }
}
