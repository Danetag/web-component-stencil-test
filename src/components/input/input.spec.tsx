import { newSpecPage } from '@stencil/core/testing';
import { Input } from './input';
import { SimpleInput } from '../simple-input/simple-input';

describe('hrb-input adapter', () => {
  it('keeps host id, class, and title off both inner elements', async () => {
    const page = await newSpecPage({
      components: [Input, SimpleInput],
      html: '<hrb-input id="host-id" class="host-class" title="Host title" id-input="native-id"></hrb-input>',
    });
    const host = page.root!;
    expect(host.id).toBe('host-id');
    expect(host).toHaveClass('host-class');
    expect(host.getAttribute('title')).toBe('Host title');

    for (const selector of ['simple-input', 'input']) {
      const inner = host.querySelector(selector)!;
      expect(inner).not.toBeNull();
      expect(inner.id).not.toBe('host-id');
      expect(inner).not.toHaveClass('host-class');
      expect(inner.hasAttribute('title')).toBe(false);
    }
    expect(host.querySelector('input')?.id).toBe('native-id');
  });

  it('delegates methods when the inner control has no componentOnReady', async () => {
    const page = await newSpecPage({
      components: [Input, SimpleInput],
      html: '<hrb-input required value="ready"></hrb-input>',
    });
    const host = page.root as HTMLHrbInputElement;
    Object.defineProperty(host.querySelector('simple-input'), 'componentOnReady', { value: undefined });

    expect(await host.getValue()).toBe('ready');
    expect(await host.isValid()).toBe(true);
  });

});

describe.each(['hrb-input', 'simple-input'])('%s compatible input API', tag => {
  const newInputPage = (html: string) => newSpecPage({
    components: [Input, SimpleInput],
    html: html.replace(/hrb-input/g, tag),
  });
  it('connects its label with prefixInput and forwards native constraints', async () => {
    const page = await newInputPage('<hrb-input name="email" prefix-input="profile-" label="Email" type="email" required maxlength="40"></hrb-input>');

    const input = page.root?.querySelector('input');
    expect(page.root?.querySelector('label')?.getAttribute('for')).toBe('profile-email');
    expect(input?.getAttribute('id')).toBe('profile-email');
    expect(input?.getAttribute('type')).toBe('email');
    expect(input).toHaveAttribute('required');
    expect(input?.getAttribute('maxlength')).toBe('40');
    expect(input?.getAttribute('pattern')).toBe(String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`);
  });

  it('prefers idInput and does not render an empty label', async () => {
    const page = await newInputPage('<hrb-input name="email" prefix-input="profile-" id-input="account-email"></hrb-input>');

    expect(page.root?.querySelector('input')?.getAttribute('id')).toBe('account-email');
    expect(page.root?.querySelector('label')).toBeNull();
  });

  it('updates getValue and emits valueChanges for input events', async () => {
    const page = await newInputPage('<hrb-input></hrb-input>');
    const component = page.root as HTMLHrbInputElement;
    const input = component.querySelector('input') as HTMLInputElement;
    const valueChanges = jest.fn();
    component.addEventListener('valueChanges', valueChanges);

    input.value = 'updated';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(await component.getValue()).toBe('updated');
    expect(valueChanges).toHaveBeenCalledTimes(1);
    expect(valueChanges.mock.calls[0][0].detail).toBe('updated');
    expect(valueChanges.mock.calls[0][0].target).toBe(component);
  });

  it('validates required against currentValue rather than an uncommitted native value', async () => {
    const page = await newInputPage('<hrb-input required></hrb-input>');
    const component = page.root as HTMLHrbInputElement;
    const input = component.querySelector('input') as HTMLInputElement;

    input.value = 'not committed';

    expect(await component.getValue()).toBe('');
    expect(await component.isValid()).toBe(false);
  });

  it('validates maxlength against the current value', async () => {
    const page = await newInputPage('<hrb-input maxlength="3" value="four"></hrb-input>');

    expect(await (page.root as HTMLHrbInputElement).isValid()).toBe(false);
  });

  it('supports partial and explicitly anchored string pattern semantics', async () => {
    const page = await newInputPage('<hrb-input pattern="[A-Z]+" value="123ABC456"></hrb-input>');
    const component = page.root as HTMLHrbInputElement;

    expect(component.querySelector('input')?.getAttribute('pattern')).toBe('[A-Z]+');
    expect(await component.isValid()).toBe(true);

    component.pattern = '^[A-Z]+$';
    await page.waitForChanges();
    expect(await component.isValid()).toBe(false);

    component.value = 'ABC';
    await page.waitForChanges();
    expect(await component.isValid()).toBe(true);

    component.value = '123abc456';
    await page.waitForChanges();
    expect(await component.isValid()).toBe(false);
  });

  it('supports programmatic RegExp patterns and renders their source to the DOM', async () => {
    const page = await newInputPage('<hrb-input value="ABC"></hrb-input>');
    const component = page.root as HTMLHrbInputElement;

    component.pattern = /^[A-Z]+$/;
    await page.waitForChanges();

    expect(component.querySelector('input')?.getAttribute('pattern')).toBe('^[A-Z]+$');
    expect(await component.isValid()).toBe(true);

    component.value = 'ABC123';
    await page.waitForChanges();
    expect(await component.isValid()).toBe(false);
  });

  it('skips validation and forwards readonly and disabled state', async () => {
    const page = await newInputPage('<hrb-input readonly disabled required maxlength="1" pattern="x" value="invalid"></hrb-input>');

    const input = page.root?.querySelector('input');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('disabled');
    expect(await (page.root as HTMLHrbInputElement).isValid()).toBe(true);
  });
});
