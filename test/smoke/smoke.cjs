// Smoke test for the packed package, loaded through its "require" export.
// Kept free of newer syntax so that it runs on every Node version in the CI
// compatibility matrix.
'use strict';

const assert = require('assert');
const { default: urlcat, configure, join, query, subst } = require('urlcat');

assert.strictEqual(
  urlcat('https://api.example.com/', '/users/:id', { id: 42, search: 'foo' }),
  'https://api.example.com/users/42?search=foo'
);
assert.strictEqual(urlcat('/users/:id', { id: 'a b' }), '/users/a%20b');
assert.strictEqual(join('a/', '/', '/b'), 'a/b');
assert.strictEqual(subst('/users/:id', { id: 1 }), '/users/1');
assert.strictEqual(query({ a: [1, 2] }, { arrayFormat: 'brackets' }), 'a%5B%5D=1&a%5B%5D=2');
assert.strictEqual(
  configure({ arrayFormat: 'repeat' })('https://example.com', '/p', { a: [1, 2] }),
  'https://example.com/p?a=1&a=2'
);

process.stdout.write(`require: ok (Node ${process.version})\n`);
