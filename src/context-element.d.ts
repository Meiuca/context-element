import { LitElement, CSSResultGroup } from 'lit';
import { StyleInstance, StyleGetter } from './css';

export class ContextElement extends LitElement {
  /**
   * @property Initial value: `''`
   *
   * The url of the individual context: `https://contexts.io/xmas/button`
   *
   * Or a object from window: `js#button`
   */
  context: string;

  /**
   * Initial value: same as `this.localName`
   */
  contextId: string;

  /**
   * Initial value: `['']`
   */
  styleIdList: string[];

  /**
   * Equivalent to `styleIdList[0]`
   */
  styleId: string;

  updateContext(): Promise<void>;

  updateStyles(): void;

  protected handleUpdateContext(): Promise<void>;

  /**
   * Initial value: `true`
   *
   * It is set to `false` when `updateStyles` is called, and true after the style is updated.
   * If your element uses transitions, you should use this property as a control,
   * since the transitions tend to glitch the element during the update.
   *
   * @example
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

  /**
   * Default value: `false`
   *
   * If you are going to use `allowTransitions`, make sure this property is set to `true`
   */
  static useTransitions: boolean;

  /**
   * Array of style getters to apply to the element. The getters should be defined
   * using the `createGooberGetter` or `createLitGetter` tag function.
   */
  static styleGetter?: StyleGetter | Array<StyleGetter>;

  /**
   * @private
   * Make it private to block its use, since `this.updateStyles` will change this variable
   */
  private static styles?: CSSResultGroup;

  /**
   * @override
   * Remove itself from registry when removed from the DOM
   */
  disconnectedCallback(): void;
}

/**
 * @deprecated Use `ContextElement`
 */
export default function contextElementMixin(
  getter?: StyleGetter | Array<StyleGetter>,
): typeof ContextElement;
