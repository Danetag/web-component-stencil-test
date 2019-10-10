import { newE2EPage } from '@stencil/core/testing';

describe('grid-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<grid-container></grid-container>');
    const element = await page.find('grid-container');
    expect(element).toHaveClass('hydrated');
  });
});
