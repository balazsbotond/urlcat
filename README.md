<h1 align="center">
  <br>
  <img src="docs/cat.svg" alt="Markdownify">
  <br>
  urlcat
  <br>
</h1>

<h4 align="center">Build correct URLs easily.</h4>

<p align="center">
  <a href="https://travis-ci.com/balazsbotond/urlcat">
    <img src="https://travis-ci.com/balazsbotond/urlcat.svg?branch=master"
         alt="Build Status">
  </a>
  <a href="https://badge.fury.io/js/urlcat">
    <img src="https://badge.fury.io/js/urlcat.svg" alt="npm version" height="18">
  </a>
</p>

<p align="center">
  <a href="#what">What?</a> •
  <a href="#why">Why?</a> •
  <a href="#how">How?</a> •
  <a href="#typescript">Typescript</a> •
  <a href="#api">API</a> •
  <a href="#help">Help</a> •
  <a href="#contribute">Contribute</a>
</p>

## What?

*urlcat* is a tiny JavaScript library that makes building URLs very convenient and prevents common mistakes.

<br>
<p align="center">
  <img src="docs/urlcat-basic-usage.svg">
</p>

Features:
- Friendly API
- No dependencies
- 0.6 KB minified and gzipped
- Typescript types provided

## Why?

When I need to call an HTTP API, I usually need to add dynamic parameters to the URL:

~~~js
const API_URL = 'https://api.example.com/';

function getUserPosts(id, limit, offset) {
  const requestUrl = `${API_URL}/users${id}/posts?limit=${limit}&offset=${offset}`;
  // send HTTP request
}
~~~

As you can see, this minimal example is already rather hard to read. It is also incorrect:

- I forgot that there was a trailing slash at the end of the `API_URL` constant so the slash got duplicated (`https://api.example.com//users`)
- The embedded values need to be escaped using `encodeURIComponent`

If I add escaping, it gets even more verbose:

~~~js
const API_URL = 'https://api.example.com';

function getUserPosts(id, limit, offset) {
  const escapedId = encodeURIComponent(id);
  const escapedLimit = encodeURIComponent(limit);
  const escapedOffset = encodeURIComponent(offset);
  const requestUrl = `${API_URL}/users/${escapedId}/posts?limit=${escapedLimit}&offset=${escapedOffset}`;
  // send HTTP request
}
~~~

Such a simple task and yet very hard to read and tedious to write! This is why I made this tiny library:

~~~js
const API_URL = 'https://api.example.com';

function getUserPosts(id, limit, offset) {
  const requestUrl = urlcat(API_URL, '/users/:id/posts', { id, limit, offset });
  // send HTTP request
}
~~~

The library handles:
- escaping all parameters
- concatenating all parts (there will always be exactly one <kbd>/</kbd> and <kbd>?</kbd> character between them)

## How?

### Install

Currently, the package is distributed via npm. Zip downloads and a CDN are coming soon.

```bash
npm install --save urlcat
```

### Usage with Node

If you want to build full URLs (most common use case):

```ts
const urlcat = require('urlcat').default;
```

If you want to use any of the utility functions:

```ts
const { query, subst, join } = require('urlcat');
```

If you want to use everything:

```ts
const { default: urlcat, query, subst, join } = require('urlcat');
```

### Usage with Typescript

If you want to build full URLs (most common use case):

```ts
import urlcat from 'urlcat';
```

If you want to use any of the utility functions:

```ts
import { query, subst, join } from 'urlcat';
```

If you want to use everything:

```ts
import urlcat, { query, subst, join } from 'urlcat';
```

## Typescript

This library provides its own type definitions. "It just works", no need to install anything from `@types`.

## API

### `ParamMap`: an object with string keys

```ts
type ParamMap = Record<string, any>;
```

For example, `{ firstParam: 1, 'second-param': 2 }` is a valid `ParamMap`.

### `urlcat`: build full URLs

```ts
function urlcat(baseUrl: string, pathTemplate: string, params: ParamMap): string
function urlcat(baseUrl: string, pathTemplate: string): string
function urlcat(baseTemplate: string, params: ParamMap): string
```

#### Examples

<ul>
  <li>
    <code>urlcat('https://api.example.com', '/users/:id/posts', { id: 123, limit: 10, offset: 120 })</code><br>
    ⮡ <code>'https://api.example.com/users/123/posts?limit=10&offset=120'</code>
  </li>
  <li>
    <code>urlcat('http://example.com/', '/posts/:title', { title: 'Letters & "Special" Characters' })</code><br>
    ⮡ <code>'http://example.com/posts/Letters%20%26%20%22Special%22%20Characters'</code>
  </li>
  <li>
    <code>urlcat('https://api.example.com', '/users')</code><br>
    ⮡ <code>'https://api.example.com/users'</code>
  </li>
  <li>
    <code>urlcat('https://api.example.com/', '/users')</code><br>
    ⮡ <code>'https://api.example.com/users'</code>
  </li>
  <li>
    <code>urlcat('http://example.com/', '/users/:userId/posts/:postId/comments', { userId: 123, postId: 987, authorId: 456, limit: 10, offset: 120 })</code><br>
    ⮡ <code>'http://example.com/users/123/posts/987/comments?authorId=456&limit=10&offset=120'</code>
  </li>
</ul>

### `query`: build query strings

```ts
function query(params: ParamMap): string
```

Builds a query string using the key-value pairs specified. Keys and values are escaped, then joined by the `'&'` character.

#### Examples

<table>
  <tr><th><code>params</code></th><th>result</th></tr>
  <tr><td><code>{}</code></td><td><code>''</code></td></tr>
  <tr><td><code>{ query: 'some text' }</code></td><td><code>'query=some%20text'</code></td></tr>
  <tr><td><code>{ id: 42, 'comment-id': 86 }</code></td><td><code>'id=42&comment-id=86'</code></td></tr>
  <tr><td><code>{ id: 42, 'a name': 'a value' }</code></td><td><code>'id=42&a%20name=a%20value'</code></td></tr>
</table>

### `subst`: substitute path parameters

```ts
function subst(template: string, params: ParamMap): string
```

Substitutes parameters with values in a template string. `template` may contain 0 or more parameter placeholders. Placeholders start with a colon (`:`), followed by a parameter name that can only contain uppercase or lowercase letters. Any placeholders found in the template are replaced with the value under the corresponding key in `params`.

#### Examples

<table>
  <tr><th><code>template</code></th><th><code>params</code></th><th>result</th></tr>
  <tr><td><code>':id'</code></td><td><code>{ id: 42 }</code></td><td><code>'42'</code></td></tr>
  <tr><td><code>'/users/:id'</code></td><td><code>{ id: 42 }</code></td><td><code>'/users/42'</code></td></tr>
  <tr><td><code>'/users/:id/comments/:commentId'</code></td><td><code>{ id: 42, commentId: 86 }</code></td><td><code>'/users/42/comments/86'</code></td></tr>
  <tr><td><code>'/users/:id'</code></td><td><code>{ id: 42, foo: 'bar' }</code></td><td><code>'/users/42'</code></td></tr>
</table>

### `join`: join two strings using exactly one separator

```ts
function join(part1: string, separator: string, part2: string): string
```

Joins the two parts using exactly one separator. If a separator is present at the end of `part1` or the beginning of `part2`, it is removed, then the two parts are joined using `separator`.

#### Examples

<table>
  <tr><th><code>part1</code></th><th><code>separator</code></th><th><code>part2</code></th><th>result</th></tr>
  <tr><td><code>'first'</code></td><td><code>','</code></td><td><code>'second'</code></td><td rowspan="4"><code>'first,second'</code></td></tr>
  <tr><td><code>'first,'</code></td><td><code>','</code></td><td><code>'second'</code></td></tr>
  <tr><td><code>'first'</code></td><td><code>','</code></td><td><code>',second'</code></td></tr>
  <tr><td><code>'first,'</code></td><td><code>','</code></td><td><code>',second'</code></td></tr>
</table>

## Help

Thank you for using *urlcat*!

If you need any help using this library, feel free to [create a GitHub issue](https://github.com/balazsbotond/urlcat/issues/new/choose) and ask your questions. I'll try to answer as quickly as possible.

## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! If you like this project and want to help, but feel like you are stuck, feel free to contact the maintainer (Botond Balázs &lt;balazsbotond@gmail.com&gt;).

### Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need to have a reasonably recent version of node.js to build *urlcat*. My node version is 12.18.3, npm is at 6.14.6.

First, clone the git repository:

```
git clone git@github.com:balazsbotond/urlcat.git
```

Then switch to the newly created urlcat directory and install the dependencies:

```
cd urlcat
npm install
```

You can then run the unit tests to verify that everything works correctly:

```
npm test
```

And finally, build the library:

```
npm run build
```

The output will appear in the `dist` directory.

Happy hacking!
