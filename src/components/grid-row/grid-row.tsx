import { Component, Prop, h, Watch, Host } from '@stencil/core';
// import styles from './grid-row.scss';

@Component({
  tag: 'grid-row',
  styleUrl: 'grid-row.scss',
  shadow: false
})
export class GridRow {
  /**
   *Justify content
   */
  @Prop({attribute: 'justify-content'}) justifyContent: string = '';
  @Watch('justifyContent')
  validateJustifyContent(newValue: string) {
    const classnames = ['initial', 'start', 'end', 'flex-start', 'flex-end', 'baseline', 'left', 'right', 'center', 'safe', 'stretch', 'space-around', 'space-between', 'space-evenly', 'center-only-mobile'];
    const justifyContentIsValidate = classnames.indexOf(newValue) > -1;
    
    if (!justifyContentIsValidate && newValue.length) { console.info('justify-content: not a valid value')  }
  }

  /**
   * Align Items
   */
  @Prop({attribute: 'align-items'}) alignItems: string = '';
  @Watch('alignItems')
  validateAlignItems(newValue: string) {
    const classnames = ['initial', 'start', 'end', 'flex-start', 'flex-end', 'baseline', 'left', 'right', 'center', 'safe', 'stretch', 'space-around', 'space-between', 'space-evenly'];
    const alignItemsIsValidate = classnames.indexOf(newValue) > -1;
    
    if (!alignItemsIsValidate && newValue.length) { console.info('align-items: not a valid value')  }
  }

  /**
   * Is centered
   */
  @Prop({attribute: 'center'}) isCentered: boolean = false;

  /**
   * Is centered on the x axis
   */
  @Prop({attribute: 'x-center'}) isXCentered: boolean = false;

  /**
   * Is centered on the y axis
   */
  @Prop({attribute: 'y-center'}) isYCentered: boolean = false;

  /**
   * Is reversed
   */
  @Prop({attribute: 'reverse'}) isReversed: boolean = false;

  render() {
    const justifyContent = this.justifyContent ? `jc-${this.justifyContent}` : '';
    const alignItems = this.alignItems ? `ai-${this.alignItems}` : '';
    const isCentered = this.isCentered ? `grid-row-center` : '';
    const isXCentered = this.isXCentered ? `x-center` : '';
    const isYCentered = this.isYCentered ? `y-center` : '';
    const isReversed = this.isReversed ? `grid-row-reverse` : '';

    return <Host class={`grid-row 
              ${justifyContent}
              ${alignItems}
              ${isCentered}
              ${isXCentered}
              ${isYCentered}
              ${isReversed}
            `}><slot /></Host>;
  }
}
