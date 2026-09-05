import { newSpecPage } from '@stencil/core/testing';
import { GridRow } from './grid-row';

describe('grid-row', () => {
  it('maps layout properties to classes', async () => {
    const page = await newSpecPage({
      components: [GridRow],
      html: '<grid-row justify-content="space-between" align-items="center" reverse></grid-row>',
    });

    expect(page.root).toHaveClass('grid-row');
    expect(page.root).toHaveClass('jc-space-between');
    expect(page.root).toHaveClass('ai-center');
    expect(page.root).toHaveClass('grid-row-reverse');
  });
});
