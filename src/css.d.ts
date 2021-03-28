import { CSSAttribute } from 'goober';
import { CSSResult } from 'lit-element';
import { GooberGetter } from './themed-element';

interface GooberInstance {
  id: string;
  result: CSSResult;
}

type ThemePropGetter<Theme> = (theme: Theme) => string | number;

interface CreateGooberGetterProps<Theme>
  extends ReadonlyArray<ThemePropGetter<Theme> | string | number> {
  0: Theme;
}

export function css(
  tag: string | CSSAttribute | TemplateStringsArray,
  ...props: (string | number)[]
): GooberInstance;

/**
 * Example:
 *
 * ```js
 * import defaultButtonTheme from './my-default-button-theme';
 * import { createGooberGetter as css } from '@meiuca/themed-element';
 *
 * export css`
 * ${defaultButtonTheme}
 *
 * :host {
 *  background-color: ${({ backgroundColor }) => backgroundColor};
 *  color: ${'#1100ff'};
 * }
 * `
 * ```
 */
export function createGooberGetter<DefaultTheme>(
  tag: TemplateStringsArray,
  ...props: CreateGooberGetterProps<DefaultTheme>
): GooberGetter;
