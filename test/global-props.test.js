import { expect } from '@open-wc/testing';
import { clearDSRegistry } from '../build/src/global-props.js';

describe('global-props.js', () => {
  it('should create DSRegistry global object', () => {
    expect(window).to.have.property('DSRegistry').that.is.instanceOf(Array);
  });

  it('should create DSContext global object', () => {
    expect(window).to.have.property('DSContext').that.is.instanceOf(Map);
  });

  it('clearDSRegistry function should clear the DSRegistry', () => {
    globalThis.window.DSRegistry.push(null);

    clearDSRegistry();

    expect(globalThis.window.DSRegistry).to.have.length(0);
  });
});
