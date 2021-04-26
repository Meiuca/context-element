import { CSSAttribute } from 'goober';
import { CSSResult } from 'lit-element';

declare interface StyleInstance {
  id: string;
  result: CSSResult;
}

declare interface StyleGetter {
  (contextId: string): StyleInstance;

  /**
   * Pushes the CSSResult to the DOM
   *
   * @returns If created by `createGooberGetter` returns the goober automagically generated class, else empty string
   */
  extract: (contextId: string) => string;

  /**
   * @deprecated Change to `extract`
   */
  reactify: (contextId: string) => string;
}

declare type ContextPropGetter<Context> = (context: Context) => string | number;

/**
 * Array whose first item is an object and the rest can be of type string, number or function.
 * Functions will be used internally as a callback that receives, as first and only parameter,
 * an object with structure equal to the first item in the array
 * but containing different values ​​(or not, depending on the use case) and must return string or number.
 */
declare interface CreateStyleGetterProps<Context extends Object>
  extends Array<ContextPropGetter<Context> | string | number> {
  0: Context;
}

/**
 * Encapsulates [Goober](https://github.com/cristianbote/goober)
 * and LitElement together
 */
export function css(
  tag: string | CSSAttribute | TemplateStringsArray,
  ...props: Array<string | number>
): StyleInstance;

/**
 * Creates a dinamic style getter using [Goober](https://github.com/cristianbote/goober)
 *
 * - This function supports Scss syntax
 *
 * ```js
 * import defaultButtonContext from './my-default-button-context.js';
 * import { createGooberGetter as css } from '@meiuca/context-element';
 *
 * export css`
 * ${defaultButtonContext}
 *
 * input {
 *  background-color: ${({ backgroundColor }) => backgroundColor};
 *
 *  &::placeholder {
 *    color: ${({ color }) => color};
 *  }
 * }
 * `
 * ```
 */
export function createGooberGetter<DefaultContext>(
  tag: TemplateStringsArray,
  ...props: CreateStyleGetterProps<DefaultContext>
): StyleGetter;

/**
 * Creates a dinamic style getter using LitElement `unsafeCSS`.
 *
 * - This function does *not* support Scss syntax.
 *
 * - This function should save a few milliseconds per call compared to `createGooberGetter`
 *
 * ```js
 * import defaultButtonContext from './my-default-button-context.js';
 * import { createLitGetter as css } from '@meiuca/context-element';
 *
 * export css`
 * ${defaultButtonContext}
 *
 * input {
 *  background-color: ${({ backgroundColor }) => backgroundColor};
 * }
 *
 * input::placeholder {
 *  color: ${({ color }) => color};
 * }
 * `
 * ```
 */
export function createLitGetter<DefaultContext>(
  tag: TemplateStringsArray,
  ...props: CreateStyleGetterProps<DefaultContext>
): StyleGetter;
