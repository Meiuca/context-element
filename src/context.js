import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentContext(contextId, defaultContext = {}) {
  if (!globalThis.window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  const componentCurrentContext = globalThis.window.DSContext.get(contextId) || {};

  // Clone parameter to avoid reassignment
  return merge(cloneDeep(defaultContext), componentCurrentContext);
}

/**
 *
 * @param {Array<string>} affectedContexts
 */
export function updateRegisteredComponents(affectedContexts) {
  if (!window.DSRegistry) {
    throw new Error('DSRegistry is not defined');
  }

  const lazyUpdate = component => component.updateStyles();

  const updateIfAffected = component => {
    if (affectedContexts.includes(component.contextId)) component.updateStyles();
  };

  window.DSRegistry.forEach(affectedContexts ? updateIfAffected : lazyUpdate);
}

export async function setContext(arg1, arg2) {
  if (!globalThis.window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  const affectedContexts = [];

  // Set global context using a url
  if (typeof arg1 === 'string' && !arg2) {
    const { data } = await axios.get(arg1);

    Object.entries(data).forEach(([componentId, newComponentContext]) => {
      const oldComponentContext = globalThis.window.DSContext.get(componentId) || {};

      const newContext = merge(oldComponentContext, newComponentContext);

      window.DSContext.set(componentId, newContext);

      affectedContexts.push(componentId);
    });

    updateRegisteredComponents(affectedContexts);

    return;
  }

  // Set component context using a object
  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    const oldComponentContext = globalThis.window.DSContext.get(arg1) || {};

    const newContext = merge(oldComponentContext, arg2);

    window.DSContext.set(arg1, newContext);

    affectedContexts.push(arg1);

    updateRegisteredComponents(affectedContexts);

    return;
  }

  // Set component context using a url
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data: newComponentContext } = await axios.get(arg2);

    const oldComponentContext = globalThis.window.DSContext.get(arg1) || {};

    const newContext = merge(oldComponentContext, newComponentContext);

    window.DSContext.set(arg1, newContext);

    affectedContexts.push(arg1);

    updateRegisteredComponents(affectedContexts);

    return;
  }

  // Set global context using a object
  if (typeof arg1 === 'object') {
    Object.entries(arg1).forEach(([componentId, newComponentContext]) => {
      const oldComponentContext = globalThis.window.DSContext.get(componentId) || {};

      const newContext = merge(oldComponentContext, newComponentContext);

      window.DSContext.set(componentId, newContext);

      affectedContexts.push(componentId);
    });

    updateRegisteredComponents(affectedContexts);
  }
}

export function clearContext(contextId) {
  if (!globalThis.window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  if (typeof contextId === 'string') {
    const deleted = globalThis.window.DSContext.delete(contextId);

    if (deleted) updateRegisteredComponents([contextId]);

    return deleted;
  }

  globalThis.window.DSContext.clear();

  updateRegisteredComponents();

  return true;
}
