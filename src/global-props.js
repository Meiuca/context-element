if (!globalThis.window.DSRegistry) {
  globalThis.window.DSRegistry = [];
}

if (!globalThis.window.DSContext) {
  globalThis.window.DSContext = new Map();
}

export function clearDSRegistry() {
  globalThis.window.DSRegistry.length = 0;
}
