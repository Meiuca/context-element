import { css as goCSS, extractCss } from 'goober';
import { unsafeCSS } from 'lit-element';
import { getComponentContext } from './context.js';

const wrapper = document.createElement('div');
const _css = goCSS.bind({ target: wrapper });

export function css(...params) {
  return { id: _css(...params), result: unsafeCSS(extractCss(wrapper)) };
}

export function createGooberGetter(tag, ...props) {
  if (typeof props[0] !== 'object' && props.length > 0) {
    throw new Error(`typeof props[0] is '${typeof props[0]}'; must be 'object'`);
  }

  const gooberGetter = componentContextId => {
    const context = getComponentContext(componentContextId, props[0]);

    const transformedProps = props.map(prop => {
      if (typeof prop === 'function') {
        return prop(context);
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

  const reactify = componentContextId => {
    let externalStylesTag = document.head.querySelector('#__context-element');

    if (!externalStylesTag) {
      const externalStyles = document.createElement('style');

      externalStyles.id = '__context-element';
      externalStyles.innerHTML = '';

      document.head.appendChild(externalStyles);

      externalStylesTag = externalStyles;
    }

    const { id, result } = gooberGetter(componentContextId);

    externalStylesTag.innerHTML += `${result.cssText}\n\n\n`;

    return id;
  };

  gooberGetter.reactify = reactify;

  return gooberGetter;
}
