import { newE2EPage } from '@stencil/core/testing';

describe('grid-col', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<grid-col></grid-col>');
    const element = await page.find('grid-col');
    expect(element).toHaveClass('hydrated');
  });
});
