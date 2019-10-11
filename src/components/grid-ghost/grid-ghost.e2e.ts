import { newE2EPage } from '@stencil/core/testing';

describe('grid-ghost', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<grid-ghost></grid-ghost>');
    const element = await page.find('grid-ghost');
    expect(element).toHaveClass('hydrated');
  });
});
