import { LitElement } from 'lit-element';
import { GooberInstance } from './css';

declare class ThemedElement extends LitElement {
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

  updateTheme(): Promise<void>;

  updateStyles(): Promise<void>;
}

declare type GooberGetter = (themeId: string) => GooberInstance;

export default function themedElementMixin(
  getter: GooberGetter | GooberGetter[] = [],
): ThemedElement;
