import { newSpecPage } from '@stencil/core/testing';
import { SimpleInput } from './simple-input';

describe('simple-input native API', () => {
  it('forwards only declared native props and updates/removes them', async () => {
    const page = await newSpecPage({
      components: [SimpleInput],
      html: `<simple-input id="host" class="host-class" title="Host title" data-test="host"
        id-input="control" autocomplete="email" inputmode="email" min="1" max="10"
        step="2" minlength="3" multiple form="account" accessible-label="Email"
        described-by="help" required disabled readonly></simple-input>`,
    });
    const component = page.root as HTMLSimpleInputElement;
    const input = component.querySelector('input')!;

    for (const [name, value] of Object.entries({
      id: 'control', autocomplete: 'email', inputmode: 'email', min: '1', max: '10',
      step: '2', minlength: '3', form: 'account', 'aria-label': 'Email', 'aria-describedby': 'help',
    })) {
      expect(input.getAttribute(name)).toBe(value);
    }
    for (const name of ['multiple', 'required', 'disabled', 'readonly']) {
      expect(input).toHaveAttribute(name);
    }
    expect(input).not.toHaveClass('host-class');
    expect(input).not.toHaveAttribute('title');
    expect(input).not.toHaveAttribute('data-test');

    component.autocomplete = 'off';
    component.min = undefined;
    component.describedBy = undefined;
    component.multiple = component.required = component.disabled = component.readonly = false;
    await page.waitForChanges();

    expect(input.getAttribute('autocomplete')).toBe('off');
    for (const name of ['min', 'aria-describedby', 'multiple', 'required', 'disabled', 'readonly']) {
      expect(input).not.toHaveAttribute(name);
    }
  });

  it('updates native types and removes stale preset patterns', async () => {
    const page = await newSpecPage({
      components: [SimpleInput],
      html: '<simple-input type="zip-code" required value="invalid"></simple-input>',
    });
    const component = page.root as HTMLSimpleInputElement;
    const input = component.querySelector('input')!;
    expect(input.getAttribute('type')).toBe('text');
    expect(await component.isValid()).toBe(false);

    component.type = 'password';
    await page.waitForChanges();
    expect(input.getAttribute('type')).toBe('password');
    expect(input).not.toHaveAttribute('pattern');
    expect(await component.isValid()).toBe(true);

    component.type = 'email';
    await page.waitForChanges();
    expect(input.getAttribute('type')).toBe('email');
    expect(await component.isValid()).toBe(false);
  });

  it('gives unnamed labelled controls distinct, stable native IDs', async () => {
    const page = await newSpecPage({
      components: [SimpleInput],
      html: '<simple-input label="First"></simple-input><simple-input label="Second"></simple-input>',
    });
    const inputs = Array.from(page.body.querySelectorAll('input'));
    const labels = Array.from(page.body.querySelectorAll('label'));
    const ids = inputs.map(input => input.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
    expect(labels.map(label => label.getAttribute('for'))).toEqual(ids);

    (page.root as HTMLSimpleInputElement).value = 'changed';
    await page.waitForChanges();
    expect(inputs.map(input => input.id)).toEqual(ids);
  });
});
