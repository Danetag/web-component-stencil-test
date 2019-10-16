import { newE2EPage } from '@stencil/core/testing';

describe('input', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<input></input>');
    const element = await page.find('input');
    expect(element).toHaveClass('hydrated');
  });
});
