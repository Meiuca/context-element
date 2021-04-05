import { LitElement, property, internalProperty } from 'lit-element';
import { isArray, kebabCase } from 'lodash';
import { setTheme, getComponentTheme } from './theme.js';

export default function themedElementMixin(getter = []) {
  const gooberGetterList = isArray(getter) ? getter : [getter];

  return class ThemedElement extends LitElement {
    @property() theme = '';

    @internalProperty() themeId = this.localName;

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
        (changedProperties.get('theme') && this.theme !== changedProperties.get('theme')) ||
        changedProperties.has('theme')
      ) {
        this.updateTheme();
      }
    }

    async updateTheme() {
      if (this.theme) {
        await this.handleUpdateTheme();
      } else {
        this.themeId = this.localName;

        await this.updateStyles();
      }

      return getComponentTheme(this.themeId);
    }

    async handleUpdateTheme() {
      if (/^js#/.test(this.theme)) {
        const themeSubstr = this.theme.substring(3);

        this.themeId = `${this.localName}__${kebabCase(themeSubstr)}`;

        await setTheme(this.themeId, window[themeSubstr] || {});
      }

      if (/^htt(p|ps):\/\//.test(this.theme)) {
        const { pathname } = new URL(this.theme);

        this.themeId = `${this.localName}__${kebabCase(pathname)}`;

        await setTheme(this.themeId, this.theme);
      }
    }

    async updateStyles() {
      const gooberInstanceList = gooberGetterList
        .map(gooberGetter => gooberGetter(this.themeId))
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
