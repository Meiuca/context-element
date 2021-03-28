import { css as goCSS, extractCss } from 'goober';
import { unsafeCSS } from 'lit-element';
import { getComponentTheme } from './theme.js';

const wrapper = document.createElement('div');
const _css = goCSS.bind({ target: wrapper });

export function css(...params) {
  return { id: _css(...params), result: unsafeCSS(extractCss(wrapper)) };
}

export function createGooberGetter(tag, ...props) {
  if (typeof props[0] === 'object') {
    return buttonThemeId => {
      const theme = getComponentTheme(buttonThemeId, props[0]);

      const transformedProps = props.map(prop => {
        if (typeof prop === 'function') {
          return prop(theme);
        }

        if (typeof prop === 'string' || typeof prop === 'number') {
          return prop;
        }

        return '';
      });

      const cssText = transformedProps.reduce(
        (prev, curr, idx) => prev + curr + tag[idx + 1],
        tag[0],
      );

      return css(cssText);
    };
  }

  throw new Error(`typeof props[0] is ${typeof props[0]}; must be 'object'`);
}
