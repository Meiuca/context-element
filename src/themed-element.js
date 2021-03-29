import { LitElement, property } from 'lit-element';
import { isArray, kebabCase } from 'lodash';
import axios from 'axios';
import { setTheme, getComponentTheme } from './theme.js';

export default function themedElementMixin(getter = []) {
  const styleGetterList = isArray(getter) ? getter : [getter];

  return class ThemedElement extends LitElement {
    @property() theme = '';

    themeId = this.localName;

    styleIdList = [''];

    styleId = '';

    constructor() {
      super();

      window.DSRegistry?.push(this);
    }

    update(changedProperties) {
      super.update(changedProperties);

      if (this.theme !== changedProperties.get('theme') || changedProperties.has('theme')) {
        this.updateTheme();
      }
    }

    async updateTheme() {
      if (this.theme) {
        if (/^js#/.test(this.theme)) {
          const themeSubstr = this.theme.substring(3);

          this.themeId = `${this.localName}__${kebabCase(themeSubstr)}`;

          await setTheme(this.themeId, window[themeSubstr] || {});
        }

        if (/^htt(p|ps):\/\//.test(this.theme)) {
          const { pathname } = new URL(this.theme);

          this.themeId = `${this.localName}__${kebabCase(pathname)}`;

          const { data } = await axios.get(this.theme);

          await setTheme(this.themeId, data);
        }
      } else {
        this.themeId = this.localName;

        await this.updateStyles();
      }

      return getComponentTheme(this.themeId);
    }

    async updateStyles() {
      const mappedGetterList = styleGetterList
        .map(g => g(this.themeId))
        .filter(({ id, result }) => id && result);

      this.constructor._styles = mappedGetterList.reduce(
        (prev, curr) => prev.concat([curr.result]),
        [],
      );

      this.constructor.styles = this.constructor._styles;

      this.styleIdList = mappedGetterList.reduce((prev, curr) => prev.concat([curr.id]), []);

      [this.styleId] = this.styleIdList;

      this.adoptStyles();

      await this.requestUpdate();

      return this.constructor.styles;
    }
  };
}
