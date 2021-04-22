import { LitElement, property, internalProperty } from 'lit-element';
import { isArray, kebabCase, has } from 'lodash';
import { setContext } from './context.js';

/**
 * Transforms an array of objects into an array
 * of common items among the objects in the array, determined by `propName`
 *
 * @template {({})[]} P
 * @template {keyof P[0]} S
 * @param {P} array
 * @param {S} propName
 *
 * @returns {Array<P[0][S]>}
 */
function concatProperties(array, propName) {
  const propConcatCallback = (previousValue, currentValue) =>
    previousValue.concat([currentValue[propName]]);

  return array.reduce(propConcatCallback, []);
}

export default function contextElementMixin(getter = []) {
  return class ContextElement extends LitElement {
    @property() context = '';

    @internalProperty() contextId = this.localName;

    @internalProperty() styleIdList = [''];

    @internalProperty() styleId = '';

    @internalProperty() allowTransitions = true;

    static _styleGetterArray = isArray(getter) ? getter : [getter];

    constructor() {
      super();

      // Register itself when instantiated
      window.DSRegistry?.push(this);

      // First update in the life cycle.
      // It needs to be done when the object is instantiated
      // to adopt the styles during initialization
      this.updateStyles();
    }

    update(changedProperties) {
      super.update(changedProperties);

      // Add support for changes to the context id pointer
      if (
        (changedProperties.get('context') && this.context !== changedProperties.get('context')) ||
        changedProperties.has('context')
      ) {
        this.updateContext();
      }
    }

    async updateContext() {
      if (this.context) {
        // In this case `this.updateStyles` does not need to be called
        // because `setContext` already does

        await this.handleUpdateContext();
      } else {
        // Reset contextId
        this.contextId = this.localName;

        await this.updateStyles();
      }
    }

    async handleUpdateContext() {
      if (/^js#/.test(this.context)) {
        // Take whatever is after `js#`
        const contextSubstr = this.context.substring(3);

        this.contextId = `${this.localName}__${kebabCase(contextSubstr)}`;

        await setContext(this.contextId, window[contextSubstr] || {});
      }

      if (/^htt(p|ps):\/\//.test(this.context)) {
        const { pathname } = new URL(this.context);

        this.contextId = `${this.localName}__${kebabCase(pathname)}`;

        await setContext(this.contextId, this.context);
      }
    }

    updateStyles() {
      // Set `this.allowTransitions` to false to avoid glitches.
      // For this change to take effect, this property needs to be properly implemented
      this.allowTransitions = false;

      // Set `this.allowTransitions` to true after all changes have been made
      setTimeout(() => {
        this.allowTransitions = true;
      });

      /**
       * @type {typeof import('./context-element').ContextElement}
       */
      const { _styleGetterArray } = this.constructor;

      const styleArray = _styleGetterArray
        .map(styleGetter => styleGetter(this.contextId))
        .filter(style => has(style, 'id') && has(style, 'result'));

      this.constructor._styles = concatProperties(styleArray, 'result');

      // Match the value of `_styles` and `styles`,
      // since `_styles` is the private version of `styles`
      this.constructor.styles = this.constructor._styles;

      this.styleIdList = concatProperties(styleArray, 'id');

      [this.styleId] = this.styleIdList;

      this.adoptStyles();
    }

    // Remove itself from registry when removed from the DOM
    disconnectedCallback() {
      super.disconnectedCallback();

      const selfRegistrationIndex = window.DSRegistry?.indexOf(this);

      if (selfRegistrationIndex >= 0) window.DSRegistry?.splice(selfRegistrationIndex, 1);
    }
  };
}
