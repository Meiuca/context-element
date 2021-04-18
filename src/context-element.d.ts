import { CSSResult, LitElement } from 'lit-element';
import { StyleInstance, StyleGetter } from './css';

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

  updateContext(): Promise<void>;

  updateStyles(): void;

  protected handleUpdateContext(): Promise<void>;

  /**
   * It is set to `false` when `updateStyles` is called, and true after the style is updated.
   * If your element uses transitions, you should use this property as a control,
   * since the transitions tend to glitch the element during the update.
   *
   * Initial value: `true`
   *
   * Example:
   *
   * ```js
   * render() {
   *  const { allowTransitions } = this;
   *
   *  const transitions = allowTransitions ? 'transitions-enabled' : '';
   *
   *  return html`
   *    <div class="${transitions}">
   *    ...
   *    </div>
   *  `;
   * }
   * ```
   * */
  allowTransitions: boolean;

  private static _styleGetterArray: Array<StyleGetter>;
}

export default function contextElementMixin(
  getter?: StyleGetter | Array<StyleGetter>,
): typeof ContextElement;
