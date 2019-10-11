import { storiesOf } from '@storybook/html';
import { withKnobs } from '@storybook/addon-knobs';

import readme from "./readme.md";

storiesOf('Test Grid', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['grid-ghost'] })
    .add('Default', () => {
        // const container = document.createElement('div');
        // container.style.height = '100%';

        const el = document.createElement('grid-ghost');

        // container.appendChild(ghost);

        return el;
    }, {
        notes: {markdown: readme},
    });