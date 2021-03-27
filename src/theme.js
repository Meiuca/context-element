import { merge, cloneDeep } from 'lodash';
import axios from 'axios';

export function getComponentTheme(component, defaultTheme = {}) {
  return merge(cloneDeep(defaultTheme), window.DSTheme?.[component]);
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
    window.DSTheme = merge(window.DSTheme, (await axios.get(arg1)).data);
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'object') {
    window.DSTheme = merge(window.DSTheme, {
      [arg1]: arg2,
    });
  }

  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const { data } = await axios.get(arg2);

    window.DSTheme = merge(window.DSTheme, {
      [arg1]: data,
    });
  }

  if (typeof arg1 === 'object') {
    window.DSTheme = merge(window.DSTheme, arg1);
  }

  await updateRegisteredComponents();
};

export async function clearTheme() {
  window.DSTheme = {};

  await updateRegisteredComponents();
}

// window.clearTheme = clearTheme;
// window.setTheme = setTheme;
