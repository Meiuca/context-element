import { CSSResult, LitElement } from 'lit-element';
import { GooberInstance } from './css';

/**
 * This class is just a TypeScript declaration. The actual code does not export it.
 */
declare class ContextElement extends LitElement {
  /**
   * @property
   *
   * The url of the individual context: `https://contexts.io/xmas/button`
   *
   * Or a object from window: `js#button`
   */
  context: string;

  /**
   * @internalProperty
   */
  contextId: string;

  /**
   * @internalProperty
   */
  styleIdList: string[];

  /**
   * @internalProperty Equivalent to `styleIdList[0]`
   */
  styleId: string;

  /**
   * @returns A promise that is resolved in a new context
   */
  updateContext(): Promise<unknown>;

  /**
   * @returns The new styles object
   */
  updateStyles(): CSSResult[];

  protected handleUpdateContext(): Promise<void>;
}

declare interface GooberGetter {
  (contextId: string): GooberInstance;

  /**
   * @returns The goober automagically generated class. Must be placed in the classList
   */
  reactify: (contextId: string) => string;
}

export default function contextElementMixin(
  getter?: GooberGetter | GooberGetter[],
): typeof ContextElement;
