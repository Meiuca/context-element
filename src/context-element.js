/* eslint-disable max-classes-per-file */
import { adoptStyles, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { kebabCase } from 'lodash';
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
  const resultArray = [];

  array.forEach(item => resultArray.push(item[propName]));

  return resultArray;
}

export class ContextElement extends LitElement {
  @property() context = '';

  /**
   * @type {string}
   *
   * Initialized on line 93
   */
  contextId;

  @state() styleIdList = [''];

  @state() styleId = '';

  @state() allowTransitions = true;

  static useTransitions = false;

  static styleGetter;

  static get _styleGetterArray() {
    if (!this.styleGetter) {
      return [];
    }

    return Array.isArray(this.styleGetter) ? this.styleGetter : [this.styleGetter];
  }

  constructor() {
    if (!globalThis.window.DSRegistry) {
      // Interrupt instance creation, since `DSRegistry` has not been declared
      throw new Error('DSRegistry is not defined');
    }

    super();

    // Register itself when instantiated
    window.DSRegistry.push(this);
  }

  /**
   * @override
   *
   * @param {Map<string | number | symbol, unknown>} changedProperties Map of changed properties with old values
   */
  update(changedProperties) {
    // Add support for changes to the context id pointer
    if (
      // Check if `this.context` is truthy and was changed
      (changedProperties.get('context') && this.context !== changedProperties.get('context')) ||
      // First update or `this.context` has been reset
      changedProperties.has('context')
    ) {
      this.updateContext();
    }

    super.update(changedProperties);
  }

  async updateContext() {
    if (this.context) {
      // In this case `this.updateStyles` does not need to be called
      // because `setContext` [line 106,118] already does

      await this.handleUpdateContext();
    } else {
      // Reset or initialize contextId
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

      // Avoid performing http test
      return;
    }

    if (/^htt(p|ps):\/\//.test(this.context)) {
      // Take whatever is after `https://.../`
      const { pathname } = new URL(this.context);

      this.contextId = `${this.localName}__${kebabCase(pathname)}`;

      await setContext(this.contextId, this.context);
    }
  }

  updateStyles() {
    if (this.constructor.useTransitions) {
      // Set `this.allowTransitions` to false to avoid glitches.
      // For this change to take effect, this property needs to be properly implemented
      this.allowTransitions = false;

      // Set `this.allowTransitions` to true after all changes have been made
      setTimeout(() => {
        this.allowTransitions = true;
      });
    }

    /**
     * @type {typeof import('./context-element').ContextElement}
     */
    const { _styleGetterArray } = this.constructor;

    const styleArray = _styleGetterArray.map(styleGetter => styleGetter(this.contextId));

    this.styleIdList = _concatProperties(styleArray, 'id');

    // Avoid change `this.styleId` to `undefined`
    if (this.styleIdList[0]) {
      [this.styleId] = this.styleIdList;
    } else {
      this.styleId = '';
    }

    // Keep properties up to date
    this.constructor.styles = _concatProperties(styleArray, 'result');
    this.constructor.elementStyles = this.constructor.finalizeStyles(this.constructor.styles);
    // Update styles
    adoptStyles(this.renderRoot, this.constructor.elementStyles);
  }

  /**
   * @override
   * Remove itself from registry when removed from the DOM
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
  console.warn('function contextElementMixin is deprecated');

  return class extends ContextElement {
    static styleGetter = getter;
  };
}
