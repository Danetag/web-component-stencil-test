import { newE2EPage } from '@stencil/core/testing';

describe('simple-input native attributes', () => {
  it('uses an external form and native constraints, distinct from legacy isValid()', async () => {
    const page = await newE2EPage();
    await page.setContent(`<form id="account"></form><p id="help">Between 1 and 5</p>
      <simple-input name="quantity" type="number" form="account" min="1" max="5" step="2"
        value="6" accessible-label="Quantity" described-by="help"></simple-input>`);
    const component = await page.find('simple-input');
    const input = await page.find('simple-input input');
    expect(input).toEqualAttribute('aria-label', 'Quantity');
    expect(input).toEqualAttribute('aria-describedby', 'help');
    expect(await page.evaluate(() => document.querySelector('input')!.checkValidity())).toBe(false);
    expect(await component.callMethod('isValid')).toBe(true);
    expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('quantity'))).toBe('6');

    component.setProperty('value', '3');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('input')!.checkValidity())).toBe(true);
    component.setProperty('type', 'password');
    component.setProperty('autocomplete', 'current-password');
    await page.waitForChanges();
    expect(await input.getProperty('type')).toBe('password');
    expect(input).toEqualAttribute('autocomplete', 'current-password');
  });
});
