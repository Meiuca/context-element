import { ThemedElement } from './themed-element';

export * from './global-props';
export * from './css';
export * from './theme';
export { default as themedElementMixin, GooberGetter, ThemedElement } from './themed-element';
export {
  html,
  svg,
  customElement,
  defaultConverter,
  property,
  eventOptions,
  internalProperty,
  notEqual,
  query,
  queryAll,
  queryAssignedNodes,
  queryAsync,
  supportsAdoptingStyleSheets,
} from 'lit-element';

declare global {
  interface Window {
    DSTheme?: Map<string, any>;
    DSRegistry?: Array<ThemedElement>;
  }
}
