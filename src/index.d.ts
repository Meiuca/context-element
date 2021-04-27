import { ContextElement } from './context-element';

export * from './global-props';
export * from './css';
export * from './context';
export { default as contextElementMixin, ContextElement } from './context-element';
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
  css as litElementCSS,
  unsafeCSS as litElementUnsafeCSS,
} from 'lit-element';

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
