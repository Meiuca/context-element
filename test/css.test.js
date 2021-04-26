import { expect } from '@open-wc/testing';
import { css, createGooberGetter } from '../build/src/index.js';

describe('css.js', () => {
  it('css function should return an StyleInstance', () => {
    const cssReturn = css``;

    expect(cssReturn).to.have.property('id').that.is.a('string');

    expect(cssReturn)
      .to.have.property('result')
      .that.is.an('object')
      .that.have.property('cssText')
      .that.is.a('string');
  });

  it('createGooberGetter function should throw an error if props[0] is not an object', () => {
    expect(() => createGooberGetter`${undefined}`).to.throw(
      "typeof props[0] is 'undefined'; must be 'object'",
    );
  });

  it('createGooberGetter function should return a StyleGetter', () => {
    const cssReturn = createGooberGetter`${{}}`;

    expect(cssReturn()).to.have.property('id').that.is.a('string');

    expect(cssReturn())
      .to.have.property('result')
      .that.is.an('object')
      .that.have.property('cssText')
      .that.is.a('string');

    expect(cssReturn.extract).to.be.a('function');

    expect(cssReturn.extract('test')).to.be.a('string');

    const globalStyles = document.querySelector('#__context-element');

    expect(globalStyles).to.be.an.instanceof(HTMLElement, 'the global styles is not being created');
  });
});
