import { newE2EPage } from '@stencil/core/testing';

describe('simple-button', () => {
  it('renders and counts clicks', async () => {
    const page = await newE2EPage();

    await page.setContent('<simple-button show-click>My Label</simple-button>');
    const component = await page.find('simple-button');
    const button = await page.find('simple-button button');

    expect(component).toHaveClass('hydrated');
    expect(button).toHaveClass('primary');

    await button.click();
    await page.waitForChanges();

    const count = await page.find('simple-button .nb-of-clicks');
    expect(count.textContent).toBe(' - 1');
  });
});
