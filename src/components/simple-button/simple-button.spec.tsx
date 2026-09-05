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

  it('forwards native props without copying host attributes and removes disabled state', async () => {
    const page = await newSpecPage({
      components: [SimpleButton],
      html: `<simple-button id="host" class="host-class" title="Host title" type="submit"
        name="action" value="save" form="account" formnovalidate disabled show-click
        id-button="save" accessible-label="Save account" described-by="help">Save</simple-button>`,
    });
    const component = page.root as HTMLSimpleButtonElement;
    const button = component.querySelector('button')!;
    for (const [name, value] of Object.entries({
      id: 'save', type: 'submit', name: 'action', value: 'save', form: 'account',
      'aria-label': 'Save account', 'aria-describedby': 'help',
    })) {
      expect(button.getAttribute(name)).toBe(value);
    }
    expect(button).toHaveAttribute('disabled');
    expect(button).toHaveAttribute('formnovalidate');
    expect(button).not.toHaveAttribute('title');
    expect(button).not.toHaveClass('host-class');
    button.click();
    await page.waitForChanges();
    expect(component.querySelector('.nb-of-clicks')).toBeNull();

    component.disabled = component.formnovalidate = false;
    component.describedBy = undefined;
    await page.waitForChanges();
    expect(button).not.toHaveAttribute('disabled');
    expect(button).not.toHaveAttribute('formnovalidate');
    expect(button).not.toHaveAttribute('aria-describedby');
    button.click();
    await page.waitForChanges();
    expect(component.querySelector('.nb-of-clicks')?.textContent).toBe(' - 1');
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
