import { CSSResult, LitElement } from 'lit-element';
import { GooberInstance } from './css';

/**
 * This class is just a TypeScript declaration. The actual code does not export it.
 */
declare class ThemedElement extends LitElement {
  /**
   * @property
   *
   * The url of the individual theme: `https://themes.io/xmas/button`
   *
   * Or a object from window: `js#foo`
   */
  theme: string;

  /**
   * @internalProperty
   */
  themeId: string;

  /**
   * @internalProperty
   */
  styleIdList: string[];

  /**
   * @internalProperty Equivalent to `styleIdList[0]`
   */
  styleId: string;

  /**
   * @returns A promise that is resolved in a new theme
   */
  updateTheme(): Promise<unknown>;

  /**
   * @returns The new styles object
   */
  updateStyles(): CSSResult[];

  protected handleUpdateTheme(): Promise<void>;
}

declare interface GooberGetter {
  (themeId: string): GooberInstance;

  /**
   * @returns The goober automagically generated class. Must be placed in the classList
   */
  reactify: (themeId: string) => string;
}

export default function themedElementMixin(
  getter?: GooberGetter | GooberGetter[],
): typeof ThemedElement;
