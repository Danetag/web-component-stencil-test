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
    const offset = this.offset;
    const offsetS = this.offsetS ? this.offsetS : offset;
    const offsetM = this.offsetM ? this.offsetM : offsetS;
    const offsetL = this.offsetL ? this.offsetL : offsetM;
    const offsetXL = this.offsetXL ? this.offsetXL : offsetL;

    const offsetClassname = offset ?  `col-offset-xs-${offset}` : '';
    const offsetSClassname = (offsetS && offsetS !== offset) || (COLUMNS.S !== COLUMNS.XS) && offsetS > 0 ?  `col-offset-s-${offsetS}` : '';
    const offsetMClassname = (offsetM && offsetM !== offsetS) || (COLUMNS.M !== COLUMNS.S) && offsetM > 0 ?  `col-offset-m-${offsetM}` : '';
    const offsetLClassname = (offsetL && offsetL !== offsetM) || (COLUMNS.L !== COLUMNS.M) && offsetL > 0 ?  `col-offset-l-${offsetL}` : '';
    const offsetXLClassname = (offsetXL && offsetXL !== offsetL) || (COLUMNS.XL !== COLUMNS.L) && offsetXL > 0 ?  `col-offset-xl-${offsetXL}` : '';

    return `${offsetClassname} ${offsetSClassname} ${offsetMClassname} ${offsetLClassname} ${offsetXLClassname}`;
  }

  getOffsetRightClassnames = () => {
    const offsetRight = this.offsetRight;
    const offsetRightS = this.offsetRightS ? this.offsetRightS : offsetRight;
    const offsetRightM = this.offsetRightM ? this.offsetRightM : offsetRightS;
    const offsetRightL = this.offsetRightL ? this.offsetRightL : offsetRightM;
    const offsetRightXL = this.offsetRightXL ? this.offsetRightXL : offsetRightL;

    const offsetRightClassname = offsetRight ?  `col-offsetRight-xs-${offsetRight}` : '';
    const offsetRightSClassname = (offsetRightS && offsetRightS !== offsetRight) || (COLUMNS.S !== COLUMNS.XS) && offsetRightS > 0 ?  `col-offsetRight-s-${offsetRightS}` : '';
    const offsetRightMClassname = (offsetRightM && offsetRightM !== offsetRightS) || (COLUMNS.M !== COLUMNS.S) && offsetRightM > 0 ?  `col-offsetRight-m-${offsetRightM}` : '';
    const offsetRightLClassname = (offsetRightL && offsetRightL !== offsetRightM) || (COLUMNS.L !== COLUMNS.M) && offsetRightL > 0 ?  `col-offsetRight-l-${offsetRightL}` : '';
    const offsetRightXLClassname = (offsetRightXL && offsetRightXL !== offsetRightL) || (COLUMNS.XL !== COLUMNS.L) && offsetRightXL > 0 ?  `col-offsetRight-xl-${offsetRightXL}` : '';

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
