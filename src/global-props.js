if (!window.DSRegistry) {
  window.DSRegistry = [];
}

if (!window.DSContext) {
  window.DSContext = new Map();
}

export function clearDSRegistry() {
  window.DSRegistry.length = 0;
}
