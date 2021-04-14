import { css as goCSS, extractCss } from 'goober';
import { unsafeCSS } from 'lit-element';
import { getComponentTheme } from './theme.js';

const wrapper = document.createElement('div');
const _css = goCSS.bind({ target: wrapper });

export function css(...params) {
  return { id: _css(...params), result: unsafeCSS(extractCss(wrapper)) };
}

export function createGooberGetter(tag, ...props) {
  if (typeof props[0] !== 'object' && props.length > 0) {
    throw new Error(`typeof props[0] is '${typeof props[0]}'; must be 'object'`);
  }

  const gooberGetter = componentThemeId => {
    const theme = getComponentTheme(componentThemeId, props[0]);

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

  const reactify = componentThemeId => {
    let externalStylesTag = document.head.querySelector('#__themed-element');

    if (!externalStylesTag) {
      const externalStyles = document.createElement('style');

      externalStyles.id = '__themed-element';
      externalStyles.innerHTML = '';

      document.head.appendChild(externalStyles);

      externalStylesTag = externalStyles;
    }

    const { id, result } = gooberGetter(componentThemeId);

    externalStylesTag.innerHTML += `${result.cssText}\n\n\n`;

    return id;
  };

  gooberGetter.reactify = reactify;

  return gooberGetter;
}
