import { css as gooberCSS, extractCss } from 'goober';
import { unsafeCSS } from 'lit-element';
import { getComponentContext } from './context.js';

// ALL ITEMS STARTED WITH `_` ARE EXPLICITLY PRIVATE

// Change goober target to a private element
const _wrapper = document.createElement('div');
const _bindedGooberCSS = gooberCSS.bind({ target: _wrapper });

function css(...params) {
  const id = _bindedGooberCSS(...params);
  const result = unsafeCSS(extractCss(_wrapper));

  return { id, result };
}

function _litCss(value) {
  return { id: '', result: unsafeCSS(value) };
}

// Pushes the style obtained by `bindedGetter` to the DOM
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

function _getter(tag, props, cssFn, componentContextId) {
  const context = getComponentContext(componentContextId, props[0]);

  const transformedProps = props.map(prop => {
    if (typeof prop === 'function') {
      return prop(context);
    }

    return prop;
  });

  const interpolate = (prev, curr, idx) => prev + curr + tag[idx + 1];

  const cssText = transformedProps.reduce(interpolate, tag[0]);

  return cssFn(cssText);
}

function _gooberGetter(componentContextId) {
  const { tag, props } = this;

  return _getter(tag, props, css, componentContextId);
}

function _litGetter(componentContextId) {
  const { tag, props } = this;

  return _getter(tag, props, _litCss, componentContextId);
}

function _createGetterObj(getter, tag, props) {
  if (typeof props[0] !== 'object' && props.length > 0) {
    throw new Error(`typeof props[0] is '${typeof props[0]}'; must be 'object'`);
  }

  const bindedGetter = getter.bind({ tag, props });

  bindedGetter.extract = _extract.bind({ bindedGetter });

  // DEPRECATED
  bindedGetter.reactify = bindedGetter.extract;

  return bindedGetter;
}

function createGooberGetter(tag, ...props) {
  return _createGetterObj(_gooberGetter, tag, props);
}

function createLitGetter(tag, ...props) {
  return _createGetterObj(_litGetter, tag, props);
}

export { css, createGooberGetter, createLitGetter };
