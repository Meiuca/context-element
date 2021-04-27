import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentContext(contextId, defaultContext = {}) {
  if (!window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  const componentCurrentContext = window.DSContext.get(contextId) || {};

  // Clone parameter to avoid reassignment
  return merge(cloneDeep(defaultContext), componentCurrentContext);
}

export function updateRegisteredComponents() {
  if (!window.DSRegistry) {
    throw new Error('DSRegistry is not defined');
  }

  // TODO: find a more performative way to update
  window.DSRegistry.forEach(component => component.updateStyles());
}

export async function setContext(arg1, arg2) {
  if (!window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  // Set global context using a url
  if (typeof arg1 === 'string' && !arg2) {
    const { data } = await axios.get(arg1);

    Object.entries(data).forEach(([componentId, newComponentContext]) => {
      const oldComponentContext = window.DSContext.get(componentId) || {};

      const newContext = merge(oldComponentContext, newComponentContext);

      window.DSContext.set(componentId, newContext);
    });
  }

  // Set component context using a object
  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    const oldComponentContext = window.DSContext.get(arg1) || {};

    const newContext = merge(oldComponentContext, arg2);

    window.DSContext.set(arg1, newContext);
  }

  // Set component context using a url
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data: newComponentContext } = await axios.get(arg2);

    const oldComponentContext = window.DSContext.get(arg1) || {};

    const newContext = merge(oldComponentContext, newComponentContext);

    window.DSContext.set(arg1, newContext);
  }

  // Set global context using a object
  if (typeof arg1 === 'object') {
    Object.entries(arg1).forEach(([componentId, newComponentContext]) => {
      const oldComponentContext = window.DSContext.get(componentId) || {};

      const newContext = merge(oldComponentContext, newComponentContext);

      window.DSContext.set(componentId, newContext);
    });
  }

  updateRegisteredComponents();
}

export function clearContext(contextId) {
  if (!window.DSContext) {
    throw new Error('DSContext is not defined');
  }

  if (typeof contextId === 'string') {
    const deleted = window.DSContext.delete(contextId);

    if (deleted) updateRegisteredComponents();

    return deleted;
  }

  window.DSContext.clear();

  updateRegisteredComponents();

  return true;
}
