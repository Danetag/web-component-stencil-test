/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface GridCol {
    /**
    * Number of columns - As it's mobile first, that's the default size.
    */
    'col': number;
    /**
    * Number of columns - L
    */
    'colL': number;
    /**
    * Number of columns - M
    */
    'colM': number;
    /**
    * Number of columns - S
    */
    'colS': number;
    /**
    * Number of columns - XL
    */
    'colXL': number;
    /**
    * Is centered
    */
    'isCentered': boolean;
    /**
    * Offset
    */
    'offset': number;
    /**
    * Offset - L
    */
    'offsetL': number;
    /**
    * Offset - M
    */
    'offsetM': number;
    /**
    * Offset right
    */
    'offsetRight': number;
    /**
    * Offset right - L
    */
    'offsetRightL': number;
    /**
    * Offset right - M
    */
    'offsetRightM': number;
    /**
    * Offset right - S
    */
    'offsetRightS': number;
    /**
    * Offset right - XL
    */
    'offsetRightXL': number;
    /**
    * Offset - S
    */
    'offsetS': number;
    /**
    * Offset - XL
    */
    'offsetXL': number;
  }
  interface GridContainer {}
  interface GridRow {
    /**
    * Align Items
    */
    'alignItems': string;
    /**
    * Is centered
    */
    'isCentered': boolean;
    /**
    * Is reversed
    */
    'isReversed': boolean;
    /**
    * Is centered on the x axis
    */
    'isXCentered': boolean;
    /**
    * Is centered on the y axis
    */
    'isYCentered': boolean;
    /**
    * Justify content
    */
    'justifyContent': string;
  }
  interface MyComponent {
    /**
    * The first name
    */
    'first': string;
    /**
    * The last name
    */
    'last': string;
    /**
    * The middle name
    */
    'middle': string;
  }
  interface SimpleButton {
    /**
    * Show number of clicks
    */
    'showNbOfClick': boolean;
    /**
    * theme
    */
    'theme': string;
  }
}

declare global {


  interface HTMLGridColElement extends Components.GridCol, HTMLStencilElement {}
  var HTMLGridColElement: {
    prototype: HTMLGridColElement;
    new (): HTMLGridColElement;
  };

  interface HTMLGridContainerElement extends Components.GridContainer, HTMLStencilElement {}
  var HTMLGridContainerElement: {
    prototype: HTMLGridContainerElement;
    new (): HTMLGridContainerElement;
  };

  interface HTMLGridRowElement extends Components.GridRow, HTMLStencilElement {}
  var HTMLGridRowElement: {
    prototype: HTMLGridRowElement;
    new (): HTMLGridRowElement;
  };

  interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {}
  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };

  interface HTMLSimpleButtonElement extends Components.SimpleButton, HTMLStencilElement {}
  var HTMLSimpleButtonElement: {
    prototype: HTMLSimpleButtonElement;
    new (): HTMLSimpleButtonElement;
  };
  interface HTMLElementTagNameMap {
    'grid-col': HTMLGridColElement;
    'grid-container': HTMLGridContainerElement;
    'grid-row': HTMLGridRowElement;
    'my-component': HTMLMyComponentElement;
    'simple-button': HTMLSimpleButtonElement;
  }
}

declare namespace LocalJSX {
  interface GridCol {
    /**
    * Number of columns - As it's mobile first, that's the default size.
    */
    'col'?: number;
    /**
    * Number of columns - L
    */
    'colL'?: number;
    /**
    * Number of columns - M
    */
    'colM'?: number;
    /**
    * Number of columns - S
    */
    'colS'?: number;
    /**
    * Number of columns - XL
    */
    'colXL'?: number;
    /**
    * Is centered
    */
    'isCentered'?: boolean;
    /**
    * Offset
    */
    'offset'?: number;
    /**
    * Offset - L
    */
    'offsetL'?: number;
    /**
    * Offset - M
    */
    'offsetM'?: number;
    /**
    * Offset right
    */
    'offsetRight'?: number;
    /**
    * Offset right - L
    */
    'offsetRightL'?: number;
    /**
    * Offset right - M
    */
    'offsetRightM'?: number;
    /**
    * Offset right - S
    */
    'offsetRightS'?: number;
    /**
    * Offset right - XL
    */
    'offsetRightXL'?: number;
    /**
    * Offset - S
    */
    'offsetS'?: number;
    /**
    * Offset - XL
    */
    'offsetXL'?: number;
  }
  interface GridContainer {}
  interface GridRow {
    /**
    * Align Items
    */
    'alignItems'?: string;
    /**
    * Is centered
    */
    'isCentered'?: boolean;
    /**
    * Is reversed
    */
    'isReversed'?: boolean;
    /**
    * Is centered on the x axis
    */
    'isXCentered'?: boolean;
    /**
    * Is centered on the y axis
    */
    'isYCentered'?: boolean;
    /**
    * Justify content
    */
    'justifyContent'?: string;
  }
  interface MyComponent {
    /**
    * The first name
    */
    'first'?: string;
    /**
    * The last name
    */
    'last'?: string;
    /**
    * The middle name
    */
    'middle'?: string;
  }
  interface SimpleButton {
    /**
    * Show number of clicks
    */
    'showNbOfClick'?: boolean;
    /**
    * theme
    */
    'theme'?: string;
  }

  interface IntrinsicElements {
    'grid-col': GridCol;
    'grid-container': GridContainer;
    'grid-row': GridRow;
    'my-component': MyComponent;
    'simple-button': SimpleButton;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'grid-col': LocalJSX.GridCol & JSXBase.HTMLAttributes<HTMLGridColElement>;
      'grid-container': LocalJSX.GridContainer & JSXBase.HTMLAttributes<HTMLGridContainerElement>;
      'grid-row': LocalJSX.GridRow & JSXBase.HTMLAttributes<HTMLGridRowElement>;
      'my-component': LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
      'simple-button': LocalJSX.SimpleButton & JSXBase.HTMLAttributes<HTMLSimpleButtonElement>;
    }
  }
}


