import { newE2EPage } from '@stencil/core/testing';

describe('simple-button', () => {
  it('supports native submitter data, disabled state, and keyboard activation', async () => {
    const page = await newE2EPage();
    await page.setContent(`<form id="account"></form>
      <simple-button type="submit" name="action" value="save" form="account" disabled show-click>Save</simple-button>`);
    await page.evaluate(() => {
      const form = document.querySelector('form')!;
      form.addEventListener('submit', event => {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLButtonElement;
        form.dataset.submission = String(new FormData(form, submitter).get('action'));
      });
    });
    const component = await page.find('simple-button');
    const button = await page.find('simple-button button');
    await button.click();
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('form')!.dataset.submission)).toBeUndefined();
    expect(await page.find('.nb-of-clicks')).toBeNull();

    component.setProperty('disabled', false);
    await page.waitForChanges();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BUTTON');
    await page.keyboard.press('Enter');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('form')!.dataset.submission)).toBe('save');
    expect((await page.find('.nb-of-clicks')).textContent).toBe(' - 1');

    component.setProperty('type', 'button');
    await page.waitForChanges();
    await page.evaluate(() => { delete document.querySelector('form')!.dataset.submission; });
    await button.click();
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('form')!.dataset.submission)).toBeUndefined();
  });

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
