import { newE2EPage } from '@stencil/core/testing';

describe('hrb-input', () => {
  it('renders a labelled native input', async () => {
    const page = await newE2EPage();

    await page.setContent('<hrb-input name="email" label="Email" required></hrb-input>');
    const component = await page.find('hrb-input');
    const input = await page.find('hrb-input input');
    const label = await page.find('hrb-input label');

    expect(component).toHaveClass('hydrated');
    expect(input).toEqualAttribute('id', 'email');
    expect(input).toHaveAttribute('required');
    expect(label).toEqualAttribute('for', 'email');
  });
});
