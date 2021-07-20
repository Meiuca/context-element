/* eslint-disable max-classes-per-file */
import { LitElement, property, internalProperty } from 'lit-element';
import { isArray, kebabCase, has } from 'lodash';
import { setContext } from './context.js';

/**
 * Transforms an array of objects into an array
 * of common items among the objects in the array, determined by `propName`
 *
 * @template {({})[]} TArray
 * @template {keyof TArray[0]} TPropName
 * @param {TArray} array
 * @param {TPropName} propName
 *
 * @returns {Array<TArray[0][TPropName]>}
 */
function _concatProperties(array, propName) {
  const propConcatCallback = (previousValue, currentValue) =>
    previousValue.concat([currentValue[propName]]);

  return array.reduce(propConcatCallback, []);
}

export class ContextElement extends LitElement {
  @property() context = '';

  @internalProperty() contextId = this.localName;

  @internalProperty() styleIdList = [''];

  @internalProperty() styleId = '';

  @internalProperty() allowTransitions = true;

  static styleGetter;

  static get _styleGetterArray() {
    if (!this.styleGetter) {
      return [];
    }

    return isArray(this.styleGetter) ? this.styleGetter : [this.styleGetter];
  }

  constructor() {
    if (!globalThis.window.DSRegistry) {
      // Interrupt instance creation, since `DSRegistry` has not been declared
      throw new Error('DSRegistry is not defined');
    }

    super();

    // Register itself when instantiated
    globalThis.window.DSRegistry.push(this);

    // First update in the life cycle.
    // It needs to be done when the object is instantiated
    // to adopt the styles during initialization
    this.updateStyles();
  }

  /**
   * Updates the element. This method reflects property values to attributes and calls render to render DOM via lit-html.
   * Setting properties inside this method will not trigger another update.
   *
   * @param {Map<string, unknown>} changedProperties Map of changed properties with old values
   */
  update(changedProperties) {
    super.update(changedProperties);

    // Add support for changes to the context id pointer
    if (
      // Check if `this.context` is truthy and was changed
      (changedProperties.get('context') && this.context !== changedProperties.get('context')) ||
      // First update or `this.context` has been reset
      changedProperties.has('context')
    ) {
      this.updateContext();
    }
  }

  async updateContext() {
    if (this.context) {
      // In this case `this.updateStyles` does not need to be called
      // because `setContext` [line 90,99] already does

      await this.handleUpdateContext();
    } else {
      // Reset contextId
      this.contextId = this.localName;

      this.updateStyles();
    }
  }

  async handleUpdateContext() {
    if (/^js#/.test(this.context)) {
      // Take whatever is after `js#`
      const contextSubstr = this.context.substring(3);

      this.contextId = `${this.localName}__${kebabCase(contextSubstr)}`;

      await setContext(this.contextId, window[contextSubstr] || {});
    }

    if (/^htt(p|ps):\/\//.test(this.context)) {
      // Take whatever is after `https://.../`
      const { pathname } = new URL(this.context);

      this.contextId = `${this.localName}__${kebabCase(pathname)}`;

      await setContext(this.contextId, this.context);
    }
  }

  updateStyles() {
    // Set `this.allowTransitions` to false to avoid glitches.
    // For this change to take effect, this property needs to be properly implemented
    this.allowTransitions = false;

    // Set `this.allowTransitions` to true after all changes have been made
    setTimeout(() => {
      this.allowTransitions = true;
    });

    /**
     * @type {typeof import('./context-element').ContextElement}
     */
    const { _styleGetterArray } = this.constructor;

    const styleArray = _styleGetterArray
      .map(styleGetter => styleGetter(this.contextId))
      .filter(style => has(style, 'id') && has(style, 'result'));

    this.constructor._styles = _concatProperties(styleArray, 'result');

    // Match the value of `_styles` and `styles`,
    // since `_styles` is the private version of `styles`
    this.constructor.styles = this.constructor._styles;

    this.styleIdList = _concatProperties(styleArray, 'id');

    // Avoid change `this.styleId` to `undefined`
    if (this.styleIdList[0]) {
      [this.styleId] = this.styleIdList;
    }

    this.adoptStyles();
  }

  /**
   * LitElement:
   * - Allows for super.disconnectedCallback() in extensions while reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   *
   * ContextElement:
   * - Remove itself from registry when removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    const selfRegistrationIndex = globalThis.window.DSRegistry.indexOf(this);

    if (selfRegistrationIndex >= 0) globalThis.window.DSRegistry.splice(selfRegistrationIndex, 1);
  }
}

// DEPRECATED
export default function contextElementMixin(getter = []) {
  // eslint-disable-next-line no-console
  console.warn(new Error('function contextElementMixin is deprecated'));

  return class extends ContextElement {
    static styleGetter = getter;
  };
}
