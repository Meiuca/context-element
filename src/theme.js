import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentTheme(component, defaultTheme = {}) {
  const componentCurrentTheme = window.DSTheme?.get(component) || {};

  return merge(cloneDeep(defaultTheme), componentCurrentTheme);
}

export function updateRegisteredComponents() {
  return Promise.all(window.DSRegistry?.map(async item => item.updateStyles()));
}

export async function setTheme(arg1, arg2) {
  if (!window.DSTheme) return;

  if (typeof arg1 === 'string' && !arg2) {
    const { data } = await axios.get(arg1);

    for (const item of Object.entries(data)) {
      const newTheme = merge(window.DSTheme.get(item[0]) || {}, item[1]);

      window.DSTheme.set(item[0], newTheme);
    }
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    const newTheme = merge(window.DSTheme.get(arg1) || {}, arg2);

    window.DSTheme.set(arg1, newTheme);
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data } = await axios.get(arg2);

    const newTheme = merge(window.DSTheme.get(arg1) || {}, data);

    window.DSTheme.set(arg1, newTheme);
  }

  if (typeof arg1 === 'object') {
    for (const item of Object.entries(arg1)) {
      const newTheme = merge(window.DSTheme.get(item[0]) || {}, item[1]);

      window.DSTheme.set(item[0], newTheme);
    }
  }

  await updateRegisteredComponents();
}

export async function clearTheme() {
  window.DSTheme?.clear();

  await updateRegisteredComponents();
}
