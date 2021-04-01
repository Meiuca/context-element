import { expect } from '@open-wc/testing';
import { clearDSRegistry } from '../build/src/global-props.js';

describe('global-props.js', () => {
  it('should create DSRegistry global object', () => {
    expect(window).to.have.property('DSRegistry').that.is.instanceOf(Array);
  });

  it('should create DSTheme global object', () => {
    expect(window).to.have.property('DSTheme').that.is.instanceOf(Map);
  });

  it('clearDSRegistry function should clear the DSRegistry', () => {
    window.DSRegistry.push(null);

    clearDSRegistry();

    expect(window.DSRegistry).to.have.length(0);
  });
});
