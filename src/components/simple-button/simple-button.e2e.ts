import { newE2EPage } from '@stencil/core/testing';

describe('simple-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<simple-button></simple-button>');
    const element = await page.find('simple-button');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to data', async () => {
    const page = await newE2EPage();

    await page.setContent('<simple-button>My Label</simple-button>');
    const component = await page.find('simple-button');

    const element = await page.find('button.simple-button');
    expect(element).toHaveClass('primary');

    component.setProperty('theme', 'secondary');
    await page.waitForChanges();
    expect(element).toHaveClass('secondary');
  });

  it('triggers an error if a wrong theme is provided', async () => {
    const page = await newE2EPage();

    await page.setContent('<simple-button>My Label</simple-button>');
    const component = await page.find('simple-button');

    // Test error
    let hasError = false;
    const originalError = console.error;
    console.error = jest.fn(() => hasError = true);

    component.setProperty('theme', 'tertiary');
    await page.waitForChanges();

    expect(hasError).toEqual(true);

    console.error = originalError;
  });
});
