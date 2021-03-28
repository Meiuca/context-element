if (!window.DSRegistry) {
  window.DSRegistry = [];
}

if (!window.DSTheme) {
  window.DSTheme = new Map();
}

export function clearDSRegistry() {
  window.DSRegistry = [];
}
