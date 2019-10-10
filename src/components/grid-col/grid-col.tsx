import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'grid-col',
  styleUrl: 'grid-col.scss',
  // scoped: true
})
export class GridCol {
  /**
   * Number of columns - As it's mobile first, that's the default size.
   */
  @Prop() col: number = 0;

  /**
   *Number of columns - S
   */
  @Prop({attribute: 'col-s'}) colS: number = 0;

  /**
   *Number of columns - M
   */
  @Prop({attribute: 'col-m'}) colM: number = 0;

  /**
   *Number of columns - L
   */
  @Prop({attribute: 'col-l'}) colL: number = 0;

  /**
   *Number of columns - XL
   */
  @Prop({attribute: 'col-xl'}) colXL: number = 0;



  /**
   * Offset
   */
  @Prop() offset: number = 0;

  /**
   * Offset - S
   */
  @Prop({attribute: 'offset-s'}) offsetS: number = 0;

  /**
   * Offset - M
   */
  @Prop({attribute: 'offset-m'}) offsetM: number = 0;

  /**
   * Offset - L
   */
  @Prop({attribute: 'offset-l'}) offsetL: number = 0;

  /**
   * Offset - XL
   */
  @Prop({attribute: 'offset-xl'}) offsetXL: number = 0;



  /**
   * Offset right
   */
  @Prop({attribute: 'offset-right'}) offsetRight: number = 0;

  /**
   * Offset right - S
   */
  @Prop({attribute: 'offset-right-s'}) offsetRightS: number = 0;

  /**
   * Offset right - M
   */
  @Prop({attribute: 'offset-right-m'}) offsetRightM: number = 0;

  /**
   * Offset right - L
   */
  @Prop({attribute: 'offset-right-l'}) offsetRightL: number = 0;

  /**
   * Offset right - XL
   */
  @Prop({attribute: 'offset-right-xl'}) offsetRightXL: number = 0;

  /**
   * Is centered
   */
  @Prop({attribute: 'center'}) isCentered: boolean = false;

  render() {
    const isCentered = this.isCentered ? `grid-col-center` : '';

    return <Host class={`grid-col ${isCentered}`}><slot /></Host>
  }
}
