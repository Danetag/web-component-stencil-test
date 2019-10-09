import { storiesOf } from '@storybook/html';
import { withKnobs, text } from '@storybook/addon-knobs';

import readme from "./readme.md";

storiesOf('Test My Component', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['my-component'] })
    .add('Default', () => {
        const el = document.createElement('my-component');
        const first = text('First', 'Arunoda');
        const last = text('Last', 'Susiripala');

        el.first= first;
        el.last= last;
        return el;
    }, {
        notes: {markdown: readme},
    });