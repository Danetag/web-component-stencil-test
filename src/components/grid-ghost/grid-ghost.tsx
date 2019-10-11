import { Component, h, Host } from '@stencil/core';
import { COLUMNS } from '../grid/constants';

@Component({
  tag: 'grid-ghost',
  styleUrl: 'grid-ghost.scss',
  shadow: false
})
export class GridGhost {

  generateCols = () => {
    const cols = [...Array(COLUMNS.XL)];
    return cols.map(() => <grid-col class={`item`} col={1}></grid-col>);
  }

  render() {
    return <Host class={`grid-ghost`}>
      <grid-container class="full-height">
        <grid-row class="full-height">
            {this.generateCols()}
        </grid-row>
      </grid-container>
    </Host>;
  }
}
