import { storiesOf } from '@storybook/html';
import { withKnobs, text, radios } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import readme from "./readme.md";

storiesOf('Test a simple-button', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['simple-button'] })
    .add('Default', () => {
        const label = 'Themes';
        const options = {
                Primary: 'primary',
                Secondary: 'secondary',
        };
        const defaultValue = options.Primary;

        const el = document.createElement('simple-button');
        el.theme = radios(label, options, defaultValue);
        el.textContent = text('Label', 'My label');

        el.addEventListener('click', e => action('click')(e.detail));

        return el;
    }, {
        notes: {markdown: readme},
    });