import { Component, Prop, h, Host } from '@stencil/core';
import { COLUMNS } from '../grid/constants';

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

  getColClassnames = () => {
    const col = this.col;
    const colS = this.colS ? this.colS : col;
    const colM = this.colM ? this.colM : colS;
    const colL = this.colL ? this.colL : colM;
    const colXL = this.colXL ? this.colXL : colL;

    const colClassname = col ?  `col-xs-${col}` : '';
    const colSClassname = (colS && colS !== col) || (COLUMNS.S !== COLUMNS.XS) && colS > 0 ?  `col-s-${colS}` : '';
    const colMClassname = (colM && colM !== colS) || (COLUMNS.M !== COLUMNS.S) && colM > 0 ?  `col-m-${colM}` : '';
    const colLClassname = (colL && colL !== colM) || (COLUMNS.L !== COLUMNS.M) && colL > 0 ?  `col-l-${colL}` : '';
    const colXLClassname = (colXL && colXL !== colL) || (COLUMNS.XL !== COLUMNS.L) && colXL > 0 ?  `col-xl-${colXL}` : '';

    return `${colClassname} ${colSClassname} ${colMClassname} ${colLClassname} ${colXLClassname}`;
  }

  getOffsetClassnames = () => {
    // if no offset at all, no need for classes
    if (!this.offset && !this.offsetS && !this.offsetM && !this.offsetL && !this.offsetXL) return '';

    const offsetClassname = this.offset > 0 ?  `col-offset-xs-${this.offset}` : '';
    const offsetSClassname = (this.offsetS !== this.offset) || (COLUMNS.S !== COLUMNS.XS) ?  `col-offset-s-${this.offsetS}` : '';
    const offsetMClassname = (this.offsetM !== this.offsetS) || (COLUMNS.M !== COLUMNS.S) ?  `col-offset-m-${this.offsetM}` : '';
    const offsetLClassname = (this.offsetL !== this.offsetM) || (COLUMNS.L !== COLUMNS.M) ?  `col-offset-l-${this.offsetL}` : '';
    const offsetXLClassname = (this.offsetXL !== this.offsetL) || (COLUMNS.XL !== COLUMNS.L) ?  `col-offset-xl-${this.offsetXL}` : '';

    return `${offsetClassname} ${offsetSClassname} ${offsetMClassname} ${offsetLClassname} ${offsetXLClassname}`;
  }

  getOffsetRightClassnames = () => {
    // if no offset Right at all, no need for classes
    if (!this.offsetRight && !this.offsetRightS && !this.offsetRightM && !this.offsetRightL && !this.offsetRightXL) return '';

    const offsetRightClassname = this.offsetRight > 0 ?  `col-offset-right-xs-${this.offsetRight}` : '';
    const offsetRightSClassname = (this.offsetRightS !== this.offsetRight) || (COLUMNS.S !== COLUMNS.XS) ?  `col-offset-right-s-${this.offsetRightS}` : '';
    const offsetRightMClassname = (this.offsetRightM !== this.offsetRightS) || (COLUMNS.M !== COLUMNS.S) ?  `col-offset-right-m-${this.offsetRightM}` : '';
    const offsetRightLClassname = (this.offsetRightL !== this.offsetRightM) || (COLUMNS.L !== COLUMNS.M) ?  `col-offset-right-l-${this.offsetRightL}` : '';
    const offsetRightXLClassname = (this.offsetRightXL !== this.offsetRightL) || (COLUMNS.XL !== COLUMNS.L) ?  `col-offset-right-xl-${this.offsetRightXL}` : '';

    return `${offsetRightClassname} ${offsetRightSClassname} ${offsetRightMClassname} ${offsetRightLClassname} ${offsetRightXLClassname}`;
  }


  render() {
    const isCentered = this.isCentered ? `grid-col-center` : '';

    return <Host class={`grid-col 
              ${isCentered}
              ${this.getColClassnames()}
              ${this.getOffsetClassnames()}
              ${this.getOffsetRightClassnames()}
            `}><slot /></Host>
  }
}
