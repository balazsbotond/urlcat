import { subst } from '../src';
import { expect } from 'chai';

describe('subst', () => {

  it('Returns empty string if the template is empty and there are no params', () => {
    const expected = '';
    const actual = subst('', {});
    expect(actual).to.equal(expected);
  });

  it('Returns empty string if the template is empty but a param is passed', () => {
    const expected = '';
    const actual = subst('', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Returns the raw template if it has a param but none are passed', () => {
    const expected = '/:p';
    const actual = subst('/:p', {});
    expect(actual).to.equal(expected);
  });

  it('Only substitutes params that are present in the object passed', () => {
    const expected = '/1/:q';
    const actual = subst('/:p/:q', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Substitutes all params present in the object passed', () => {
    const expected = '/1/a/false';
    const actual = subst('/:p/:q/:r', { p: 1, q: 'a', r: false });
    expect(actual).to.equal(expected);
  });

  it('Allows parameters at the beginning of the template', () => {
    const expected = '42';
    const actual = subst(':p', { p: 42 });
    expect(actual).to.equal(expected);
  });

});
