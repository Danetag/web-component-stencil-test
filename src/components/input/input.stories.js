import { storiesOf } from '@storybook/html';
import { withKnobs, text, radios, boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import readme from "./readme.md";

storiesOf('Test an input', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['hrb-input'] })
    .add('Default', () => {
        const options = {
            Text: 'text',
            Email: 'email',
            ZipCode: 'zip-code',
            Number: 'number',
            Date: 'date',
        };

        const el = document.createElement('hrb-input');
        el.type = radios('Type', options, options.Text);
        el.label = text('Label', 'Firstname');
        el.name = text('Name', 'firstname');
        el.placeholder = text('Placeholder', 'My Firstname');
        el.required = boolean('Required', false);
        el.readonly = boolean('Readonly', false);
        el.disabled = boolean('Disabled', false);
        el.maxlength = number('Max lenght', 0);
        
        el.addEventListener('input', async e => {
            const value = await el.getValue();
            const isValid = await el.isValid();
            console.log('value', value, 'isValid', isValid);
            return action('input')(e);
        });

        return el;
    }, {
        notes: {markdown: readme},
    });