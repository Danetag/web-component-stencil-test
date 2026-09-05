import { newSpecPage } from '@stencil/core/testing';
import { GridCol } from './grid-col';

describe('grid-col', () => {
  it('builds responsive column and offset classes', async () => {
    const page = await newSpecPage({
      components: [GridCol],
      html: '<grid-col col="6" col-m="12" offset="1" offset-m="2" center>Content</grid-col>',
    });

    expect(page.root).toHaveClass('grid-col');
    expect(page.root).toHaveClass('grid-col-center');
    expect(page.root).toHaveClass('col-xs-6');
    expect(page.root).toHaveClass('col-m-12');
    expect(page.root).toHaveClass('col-offset-xs-1');
    expect(page.root).toHaveClass('col-offset-m-2');
    expect(page.root?.textContent).toContain('Content');
  });
});
