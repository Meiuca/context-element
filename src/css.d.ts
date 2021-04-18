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

declare type CreateStyleGetterProps<Context> = Array<
  ContextPropGetter<Context> | string | number
> & {
  0: Context;
};

/**
 * Encapsulates [Goober](https://github.com/cristianbote/goober)
 * and LitElement together
 */
export function css(
  tag: string | CSSAttribute | TemplateStringsArray,
  ...props: Array<string | number>
): StyleInstance;

/**
 * Creates a dinamic style getter using [goober](https://github.com/cristianbote/goober)
 *
 * This function supports Scss syntax
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
 * This function does *not* support Scss syntax
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
