import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentContext(contextId, defaultContext = {}) {
  const componentCurrentContext = window.DSContext?.get(contextId) || {};

  // Clone parameter to avoid reassignment
  return merge(cloneDeep(defaultContext), componentCurrentContext);
}

export function updateRegisteredComponents() {
  window.DSRegistry?.map(item => item.updateStyles());
}

export async function setContext(arg1, arg2) {
  if (!window.DSContext) return;

  if (typeof arg1 === 'string' && !arg2) {
    const { data } = await axios.get(arg1);

    Object.entries(data).forEach(item => {
      const newContext = merge(window.DSContext.get(item[0]) || {}, item[1]);

      window.DSContext.set(item[0], newContext);
    });
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    const newContext = merge(window.DSContext.get(arg1) || {}, arg2);

    window.DSContext.set(arg1, newContext);
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data } = await axios.get(arg2);

    const newContext = merge(window.DSContext.get(arg1) || {}, data);

    window.DSContext.set(arg1, newContext);
  }

  if (typeof arg1 === 'object') {
    Object.entries(arg1).forEach(item => {
      const newContext = merge(window.DSContext.get(item[0]) || {}, item[1]);

      window.DSContext.set(item[0], newContext);
    });
  }

  updateRegisteredComponents();
}

export function clearContext(contextId) {
  if (typeof contextId === 'string') {
    const deleted = window.DSContext?.delete(contextId);

    if (deleted) updateRegisteredComponents();

    return deleted;
  }

  window.DSContext?.clear();

  updateRegisteredComponents();

  return true;
}
