import urlcat from '../../src';

it('Add params to an url who already have params', () => {

    const url = 'http://myurl.com?myparams=1'
    const result = urlcat(url, { foo: 2, bar: 3 })
    const expected = "http://myurl.com?myparams=1&foo=2&bar=3"

    expect(result).toEqual(expected)

});
