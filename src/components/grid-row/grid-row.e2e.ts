import { newE2EPage } from '@stencil/core/testing';

describe('grid-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<grid-row></grid-row>');
    const element = await page.find('grid-row');
    expect(element).toHaveClass('hydrated');
  });
});
