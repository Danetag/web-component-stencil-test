import { newE2EPage } from '@stencil/core/testing';

describe.each(['hrb-input', 'simple-input'])('%s compatible browser behavior', tag => {
  it('renders a labelled native input and focuses it through the label', async () => {
    const page = await newE2EPage();
    await page.setContent(`<${tag} name="email" label="Email" required></${tag}>`);
    const component = await page.find(tag);
    const input = await page.find(`${tag} input`);
    const label = await page.find(`${tag} label`);

    expect(component).toHaveClass('hydrated');
    expect(input).toEqualAttribute('id', 'email');
    expect(input).toHaveAttribute('required');
    expect(label).toEqualAttribute('for', 'email');
    await label.click();
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('INPUT');
  });

  it('preserves methods, event target, updates, and native form participation', async () => {
    const page = await newE2EPage();
    await page.setContent(`<form><${tag} name="email" label="Email" required></${tag}></form>`);
    const component = await page.find(tag);
    const changes = await component.spyOnEvent('valueChanges');
    await page.evaluate(tagName => {
      const host = document.querySelector(tagName)!;
      host.addEventListener('valueChanges', event => {
        host.setAttribute('data-event-target', event.target === host ? 'host' : 'child');
      });
    }, tag);
    const input = await page.find(`${tag} input`);
    expect(await component.callMethod('isValid')).toBe(false);
    await input.click();
    await page.keyboard.type('a');
    await page.waitForChanges();
    expect(changes).toHaveReceivedEventTimes(1);
    expect(changes.lastEvent.detail).toBe('a');
    expect(component).toEqualAttribute('data-event-target', 'host');
    expect(await component.callMethod('getValue')).toBe('a');
    expect(await component.callMethod('isValid')).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('email'))).toBe('a');

    // Blur commits one native change event, rather than duplicating the adapter event.
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(changes).toHaveReceivedEventTimes(2);

    component.setProperty('value', 'server');
    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await component.callMethod('getValue')).toBe('server');
    expect(await input.getProperty('value')).toBe('server');
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).has('email'))).toBe(false);
  });
});
