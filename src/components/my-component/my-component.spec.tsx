import { newSpecPage } from '@stencil/core/testing';
import { MyComponent } from './my-component';

describe('my-component', () => {
  it('renders and reacts to name changes', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: '<my-component first="Ada" last="Lovelace"></my-component>',
    });

    expect(page.root?.shadowRoot?.textContent).toContain("Hello, World! I'm Ada Lovelace");

    page.root?.setAttribute('middle', 'Byron');
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.textContent).toContain("Hello, World! I'm Ada Byron Lovelace");
  });
});
