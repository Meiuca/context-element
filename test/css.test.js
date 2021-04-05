import { expect } from '@open-wc/testing';
import { css, createGooberGetter } from '../build/src/css.js';

describe('css.js', () => {
  it('css function should return an GooberInstance', () => {
    const cssReturn = css``;

    expect(cssReturn).to.have.property('id').that.is.a('string');

    expect(cssReturn)
      .to.have.property('result')
      .that.is.an('object')
      .that.have.property('cssText')
      .that.is.a('string');
  });

  it('createGooberGetter function should throw an error if props[0] is not an object', () => {
    expect(createGooberGetter).to.throw("typeof props[0] is 'undefined'; must be 'object'");
  });

  it('createGooberGetter function should return a GooberGetter', () => {
    const cssReturn = createGooberGetter`${{}}`();

    expect(cssReturn).to.have.property('id').that.is.a('string');

    expect(cssReturn)
      .to.have.property('result')
      .that.is.an('object')
      .that.have.property('cssText')
      .that.is.a('string');
  });
});