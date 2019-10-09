import { storiesOf } from '@storybook/html';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import readme from "./readme.md";



storiesOf('Test a simple-button', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['simple-button'] })
    .add('Default', () => {
        const el = document.createElement('simple-button');
        const label = text('Label', 'My label');

        el.label= label;
        el.addEventListener('click', e => action('click')(e.detail));

        el.textContent = 'yeaaaah';
        return el;
    }, {
        notes: {markdown: readme},
    });