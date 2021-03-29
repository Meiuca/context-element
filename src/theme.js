import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentTheme(component, defaultTheme = {}) {
  const currentComponentTheme = window.DSTheme?.get(component) || {};

  return merge(cloneDeep(defaultTheme), currentComponentTheme);
}

export function updateRegisteredComponents() {
  return Promise.all(
    window.DSRegistry?.map(async item => {
      await item.updateStyles();
    }),
  );
}

export const setTheme = async (arg1, arg2) => {
  if (!window.DSTheme) return;

  if (typeof arg1 === 'string' && !arg2) {
    const { data } = await axios.get(arg1);

    for (const item of Object.entries(data)) {
      window.DSTheme.set(item[0], merge(window.DSTheme.get(item[0]) || {}, item[1]));
    }
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    window.DSTheme.set(arg1, merge(window.DSTheme.get(arg1) || {}, arg2));
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data } = await axios.get(arg2);

    window.DSTheme.set(arg1, merge(window.DSTheme.get(arg1) || {}, data));
  }

  if (typeof arg1 === 'object') {
    for (const item of Object.entries(arg1)) {
      window.DSTheme.set(item[0], merge(window.DSTheme.get(item[0]) || {}, item[1]));
    }
  }

  await updateRegisteredComponents();
};

export async function clearTheme() {
  window.DSTheme?.clear();

  await updateRegisteredComponents();
}
