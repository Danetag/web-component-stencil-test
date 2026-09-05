import { newSpecPage } from '@stencil/core/testing';
import { SimpleButton } from './simple-button';

describe('simple-button', () => {
  it('renders its label and tracks clicks when requested', async () => {
    const page = await newSpecPage({
      components: [SimpleButton],
      html: '<simple-button show-click>Save</simple-button>',
    });

    const button = page.root?.querySelector('button');
    expect(button).not.toBeNull();
    expect(button).toHaveClass('primary');
    expect(button?.getAttribute('type')).toBe('button');
    expect(page.root?.querySelector('.nb-of-clicks')).toBeNull();

    button?.click();
    button?.click();
    await page.waitForChanges();

    expect(page.root?.querySelector('.nb-of-clicks')?.textContent).toBe(' - 2');
  });

  it('uses the default theme and switches themes programmatically', async () => {
    const page = await newSpecPage({
      components: [SimpleButton],
      html: '<simple-button></simple-button>',
    });
    const component = page.root as HTMLSimpleButtonElement;
    const button = component.querySelector('button');

    expect(button).toHaveClass('primary');
    expect(button).not.toHaveClass('secondary');

    component.theme = 'secondary';
    await page.waitForChanges();

    expect(button).toHaveClass('secondary');
    expect(button).not.toHaveClass('primary');
  });

  it('warns and falls back to the primary class for an invalid theme', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation();
    const page = await newSpecPage({
      components: [SimpleButton],
      html: '<simple-button theme="unknown"></simple-button>',
    });

    expect(page.root?.querySelector('button')).toHaveClass('primary');
    expect(warn).toHaveBeenCalledWith('Invalid simple-button theme "unknown"; using "primary".');
    warn.mockRestore();
  });
});
