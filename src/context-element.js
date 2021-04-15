import { LitElement, property, internalProperty } from 'lit-element';
import { isArray, kebabCase } from 'lodash';
import { setContext, getComponentContext } from './context.js';

export default function contextElementMixin(getter = []) {
  const gooberGetterList = isArray(getter) ? getter : [getter];

  return class ContextElement extends LitElement {
    @property() context = '';

    @internalProperty() contextId = this.localName;

    @internalProperty() styleIdList = [''];

    @internalProperty() styleId = '';

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

      return getComponentContext(this.contextId);
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
      const gooberInstanceList = gooberGetterList
        .map(gooberGetter => gooberGetter(this.contextId))
        .filter(({ id, result }) => id && result);

      this.constructor._styles = gooberInstanceList.reduce(
        (prev, curr) => prev.concat([curr.result]),
        [],
      );

      this.constructor.styles = this.constructor._styles;

      this.styleIdList = gooberInstanceList.reduce((prev, curr) => prev.concat([curr.id]), []);

      [this.styleId] = this.styleIdList;

      this.adoptStyles();

      return this.constructor.styles;
    }
  };
}
