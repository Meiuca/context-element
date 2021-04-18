import { LitElement, property, internalProperty } from 'lit-element';
import { isArray, kebabCase, has } from 'lodash';
import { setContext } from './context.js';

/**
 * @template {any[]} P
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

      window.DSRegistry?.push(this);

      this.updateStyles();
    }

    update(changedProperties) {
      super.update(changedProperties);

      if (
        (changedProperties.get('context') && this.context !== changedProperties.get('context')) ||
        changedProperties.has('context')
      ) {
        this.updateContext();
      }
    }

    async updateContext() {
      if (this.context) {
        await this.handleUpdateContext();
      } else {
        this.contextId = this.localName;

        await this.updateStyles();
      }
    }

    async handleUpdateContext() {
      if (/^js#/.test(this.context)) {
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

    async updateStyles() {
      this.allowTransitions = false;

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

      this.constructor.styles = this.constructor._styles;

      this.styleIdList = concatProperties(styleArray, 'id');

      [this.styleId] = this.styleIdList;

      this.adoptStyles();
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      const selfRegistrationIndex = window.DSRegistry?.indexOf(this);

      if (selfRegistrationIndex >= 0) window.DSRegistry?.splice(selfRegistrationIndex, 1);
    }
  };
}
