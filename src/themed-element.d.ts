import { CSSResult, LitElement } from 'lit-element';
import { GooberInstance } from './css';

/**
 * This class is just a TypeScript declaration. The actual code does not export it.
 */
class ThemedElement extends LitElement {
  /**
   * The url of the individual theme: `https://themes.io/xmas/button`
   *
   * Or a object from window: `js#foo`
   */
  theme: string;

  themeId: string;

  styleIdList: string[];

  /**
   * Equivalent to `styleIdList[0]`
   */
  styleId: string;

  /**
   * @returns A promisse with the new theme
   */
  updateTheme(): Promise<unknown>;

  /**
   * @returns A promisse with the new styles object
   */
  updateStyles(): Promise<CSSResult[]>;
}

type GooberGetter = (themeId: string) => GooberInstance;

export default function themedElementMixin(
  getter: GooberGetter | GooberGetter[] = [],
): typeof ThemedElement;
