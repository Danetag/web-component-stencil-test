import { storiesOf } from '@storybook/html';
import { withKnobs, number } from '@storybook/addon-knobs';

import { COLUMNS } from './constants';

import readme from "./readme.md";

storiesOf('Grid', module)
    .addDecorator(withKnobs)
    .addParameters({ jest: ['grid-ghost', 'grid-container', 'grid-row', 'grid-col'] })
    .add('Ghost with one col', () => {
        document.body.style.margin = 0;

        const container = document.createElement('div');
        container.style.height = '100%';

        // ghost
        const ghost = document.createElement('grid-ghost');
        container.appendChild(ghost);

        // grid-container
        const gridContainer = document.createElement('grid-container');
        const gridRow = document.createElement('grid-row');
        const gridCol = document.createElement('grid-col');

        const groupCol = 'Column width';
        const options = {
            range: false,
            min: 0,
            max: COLUMNS.XL,
            step: 1,
        };

        gridCol.col = number('Default (mobile first)', 1, options, groupCol);
        gridCol.setAttribute('col-s', number('S (> 420px)', 0, options, groupCol));
        gridCol.setAttribute('col-m', number('M (> 768px)', 0, options, groupCol));
        gridCol.setAttribute('col-l', number('L (> 1024px)', 0, options, groupCol));
        gridCol.setAttribute('col-xl', number('XS (> 1440px)', 0, options, groupCol));

        const groupOffset = 'Offset';

        gridCol.offset = number('Default (mobile first)', 0, {}, groupOffset);
        gridCol.setAttribute('offset-s', number('S (> 420px)', 0, {}, groupOffset));
        gridCol.setAttribute('offset-m', number('M (> 768px)', 0, {}, groupOffset));
        gridCol.setAttribute('offset-l', number('L (> 1024px)', 0, {}, groupOffset));
        gridCol.setAttribute('offset-xl', number('XL (> 1440px)', 0, {}, groupOffset));

        gridCol.style.height = '100px';
        gridCol.style.backgroundColor = 'blue';

        container.appendChild(gridContainer);
        gridContainer.appendChild(gridRow);
        gridRow.appendChild(gridCol);

        return container;
    }, {
        notes: {markdown: readme},
    });