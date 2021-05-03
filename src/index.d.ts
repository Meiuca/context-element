import { ContextElement } from './context-element';

export * from './global-props';

export * from './css';

export * from './context';

export { default as contextElementMixin, ContextElement } from './context-element';

export {
  html,
  svg,
  defaultConverter,
  notEqual,
  supportsAdoptingStyleSheets,
  css as litCSS,
  unsafeCSS as litUnsafeCSS,
  getCompatibleStyle,
  render,
  noChange,
} from 'lit';

export {
  eventOptions,
  customElement,
  property,
  query,
  queryAll,
  queryAssignedNodes,
  queryAsync,
  state,
} from 'lit/decorators.js';

declare global {
  interface Window {
    DSContext?: Map<string, any>;
    DSRegistry?: Array<ContextElement>;
    /**
     * This is a global module declaration
     * that will only exist if you import
     * `@meiuca/context-element/src/module-declaration.js`
     */
    ContextElement?: typeof import('./index');
  }
}
