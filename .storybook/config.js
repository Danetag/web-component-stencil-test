import { configure, addDecorator, addParameters } from '@storybook/html';
import { withTests } from "@storybook/addon-jest";
import { withA11y } from '@storybook/addon-a11y';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import results from "../jest-test-results.json";

addDecorator(
  withTests({
    results,
    // filesExt: '((\\.spec?)|(\\.tests?)|(\\.e2e?))?(\\.ts)?$',
    filesExt: ".e2e.ts"
  })
);

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
});

addDecorator(withA11y)

const req = require.context("../src", true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
configure(loadStories, module);