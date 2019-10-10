import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'grid-container',
  styleUrl: 'grid-container.scss',
  shadow: false
})
export class GridContainer {
  render() {
    return <Host class={`grid-container`}><slot /></Host>;
  }
}
