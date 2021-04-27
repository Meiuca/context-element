import { css as gooberCSS, extractCss } from 'goober';
import { unsafeCSS } from 'lit-element';
import { getComponentContext } from './context.js';

// ALL ITEMS STARTED WITH `_` ARE EXPLICITLY PRIVATE

// Change goober target to a private element
const _wrapper = document.createElement('div');
const _bindedGooberCSS = gooberCSS.bind({ target: _wrapper });

/**
 *
 * @param  {...(TemplateStringsArray | unknown)} params
 * @returns {import('./css').StyleInstance}
 */
function css(...params) {
  const id = _bindedGooberCSS(...params);
  const result = unsafeCSS(extractCss(_wrapper));

  return { id, result };
}

/**
 * @param {string} value
 * @returns {import('./css').StyleInstance}
 */
function _litCss(value) {
  return { id: '', result: unsafeCSS(value) };
}

/**
 * Pushes the style obtained by `this.bindedGetter` to the DOM
 *
 * @this {{
 *  bindedGetter: (id: string) => import('./css').StyleInstance;
 * }}
 *
 * @param {string} componentContextId
 */
function _extract(componentContextId) {
  const { bindedGetter } = this;

  let externalStylesTag = document.head.querySelector('#__context-element');

  if (!externalStylesTag) {
    const externalStyles = document.createElement('style');
    externalStyles.id = '__context-element';
    externalStyles.innerHTML = '';

    document.head.appendChild(externalStyles);

    externalStylesTag = externalStyles;
  }

  const {
    id,
    result: { cssText },
  } = bindedGetter(componentContextId);

  const { innerHTML } = externalStylesTag;

  if ((id && !innerHTML.includes(id)) || !innerHTML.includes(cssText)) {
    externalStylesTag.innerHTML += `\n${cssText}\n`;
  }

  return id;
}

/**
 * The core of all getters
 *
 * @param {TemplateStringsArray} tag
 *
 * @param {import('./css').CreateStyleGetterProps} props
 *
 * @param {Function} cssFn Will be used to create the StyleInstance,
 * passing on the result of the iteration between `tag` and `props`
 *
 * @param {string} componentContextId Used by `getComponentContext`
 *
 * @returns {import('./css').StyleInstance} StyleInstance returned from `cssFn`
 */
function _getter(tag, props, cssFn, componentContextId) {
  const context = getComponentContext(componentContextId, props[0]);

  const mappedProps = props.map(prop => {
    // SEE: css.d.ts; line 33
    if (typeof prop === 'function') {
      return prop(context);
    }

    return prop;
  });

  const interpolate = (prev, curr, idx) => prev + curr + tag[idx + 1];

  const cssText = mappedProps.reduce(interpolate, tag[0]);

  return cssFn(cssText);
}

/**
 * This function should not be used directly in this context;
 * it should be used to create a bound function that should be returned to later use
 *
 * @this {{
 *  tag: TemplateStringsArray;
 *  props: import('./css').CreateStyleGetterProps;
 * }}
 *
 * @param {string} componentContextId
 */
function _gooberGetter(componentContextId) {
  const { tag, props } = this;

  return _getter(tag, props, css, componentContextId);
}

/**
 * This function should not be used directly in this context;
 * it should be used to create a bound function that should be returned to later use
 *
 * @this {{
 * tag: TemplateStringsArray;
 * props: import('./css').CreateStyleGetterProps;
 * }}
 *
 * @param {string} componentContextId
 */
function _litGetter(componentContextId) {
  const { tag, props } = this;

  return _getter(tag, props, _litCss, componentContextId);
}

/**
 * The core of all `createGetter` functions
 *
 * @param {Function} getter
 *
 * @param {TemplateStringsArray} tag
 *
 * @param {import('./css').CreateStyleGetterProps} props
 *
 * @returns {import('./css').StyleGetter} binded `getter`
 */
function _createGetterObj(getter, tag, props) {
  // Checks if `props` is valid according to CreateStyleGetterProps interface
  // SEE: css.d.ts; line 33
  if (typeof props[0] !== 'object' && props.length > 0) {
    throw new Error(`typeof props[0] is '${typeof props[0]}'; must be 'object'`);
  }

  const bindedGetter = getter.bind({ tag, props });

  bindedGetter.extract = _extract.bind({ bindedGetter });

  // DEPRECATED
  bindedGetter.reactify = componentContextId => {
    // eslint-disable-next-line no-console
    console.warn(new Error('function reactify is deprecated'));

    return bindedGetter.extract(componentContextId);
  };

  return bindedGetter;
}

function createGooberGetter(tag, ...props) {
  return _createGetterObj(_gooberGetter, tag, props);
}

function createLitGetter(tag, ...props) {
  return _createGetterObj(_litGetter, tag, props);
}

export { css, createGooberGetter, createLitGetter };
