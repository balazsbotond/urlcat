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
  <a href="https://www.npmjs.com/package/urlcat">
    <img src="https://img.shields.io/npm/v/urlcat.svg?style=flat" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/result?p=urlcat">
    <img src="https://badgen.net/bundlephobia/minzip/urlcat" alt="minzipped size">
  </a>
  <a href="https://coveralls.io/github/balazsbotond/urlcat?branch=master">
    <img src="https://coveralls.io/repos/github/balazsbotond/urlcat/badge.svg?branch=master" alt="Coverage Status" />
  </a>
</p>

<p align="center">
  <a href="#what">What?</a> •
  <a href="#why">Why?</a> •
  <a href="#how">How?</a> •
  <a href="#typescript">TypeScript</a> •
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
- 0.8 KB minified and gzipped
- TypeScript types provided

## Why?

When I call an HTTP API, I usually need to add dynamic parameters to the URL:

~~~js
const API_URL = 'https://api.example.com/';

function getUserPosts(id, blogId, limit, offset) {
  const requestUrl = `${API_URL}/users/${id}/blogs/${blogId}/posts?limit=${limit}&offset=${offset}`;
  // send HTTP request
}
~~~

As you can see, this minimal example is already rather hard to read. It is also incorrect:

- I forgot that there was a trailing slash at the end of the `API_URL` constant so this resulted in a URL containing duplicate slashes (`https://api.example.com//users`).
- The embedded values need to be escaped using `encodeURIComponent`

I can use the built-in `URL` class to prevent duplicate slashes and `URLSearchParams` to escape the query string. But I still need to escape all path parameters manually.

~~~js
const API_URL = 'https://api.example.com/';

function getUserPosts(id, blogId, limit, offset) {
  const escapedId = encodeURIComponent(id);
  const escapedBlogId = encodeURIComponent(blogId);
  const path = `/users/${escapedId}/blogs/${escapedBlogId}`;
  const url = new URL(path, API_URL);
  url.search = new URLSearchParams({ limit, offset });
  const requestUrl = url.href;
  // send HTTP request
}
~~~

Such a simple task and yet very hard to read and tedious to write! This is where this tiny library can help you:

~~~js
const API_URL = 'https://api.example.com/';

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

Currently, the package is distributed via npm. (Zip downloads and a CDN are coming soon).

```bash
npm install --save urlcat
```

### Usage with Node

Node 10 and above are officially supported. 
Since the code uses the `URL` and `URLSearchParams` classes internally, which aren't available below v10, we cannot support those versions.

To build full URLs (most common use case):

```ts
const urlcat = require('urlcat').default;
```

To use any of the utility functions:

```ts
const { query, subst, join } = require('urlcat');
```

To use all exported functions:

```ts
const { default: urlcat, query, subst, join } = require('urlcat');
```

### Usage with TypeScript

TypeScript 2.1 and above are officially supported.

To build full URLs (most common use case):

```ts
import urlcat from 'urlcat';
```

To use any of the utility functions:

```ts
import { query, subst, join } from 'urlcat';
```

To use everything:

```ts
import urlcat, { query, subst, join } from 'urlcat';
```

### Usage with Deno

```ts
import urlcat from 'https://deno.land/x/urlcat/src/index.ts';

console.log(urlcat('https://api.foo.com', ':name', { id: 25, name: 'knpwrs' }));
```

## TypeScript

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
    → <code>'https://api.example.com/users/123/posts?limit=10&offset=120'</code>
  </li>
  <li>
    <code>urlcat('http://example.com/', '/posts/:title', { title: 'Letters & "Special" Characters' })</code><br>
    → <code>'http://example.com/posts/Letters%20%26%20%22Special%22%20Characters'</code>
  </li>
  <li>
    <code>urlcat('https://api.example.com', '/users')</code><br>
    → <code>'https://api.example.com/users'</code>
  </li>
  <li>
    <code>urlcat('https://api.example.com/', '/users')</code><br>
    → <code>'https://api.example.com/users'</code>
  </li>
  <li>
    <code>urlcat('http://example.com/', '/users/:userId/posts/:postId/comments', { userId: 123, postId: 987, authorId: 456, limit: 10, offset: 120 })</code><br>
    → <code>'http://example.com/users/123/posts/987/comments?authorId=456&limit=10&offset=120'</code>
  </li>
</ul>

**NOTE about empty path segments:** 
[RFC 3986](https://tools.ietf.org/html/rfc3986) allows empty path segments in URLs (for example, `https://example.com//users////2`). *urlcat* keeps any empty path segments that aren't at the concatenation boundary between `baseUrl` and `pathTemplate`. To include an empty path segment there are two options:
- use a double slash: `urlcat('https://example.com/', '//users', { q: 1 })` → `https://example.com//users?q=1`
- use the `baseTemplate` overload: `urlcat('https://example.com//users', { q: 1 })` → `https://example.com//users?q=1`

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

If you need any help using this library, feel free to [create a GitHub issue](https://github.com/balazsbotond/urlcat/issues/new/choose), and ask your questions. I'll try to answer as quickly as possible.

## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! If you like this project and want to help, but feel like you are stuck, feel free to contact the maintainer (Botond Balázs &lt;balazsbotond@gmail.com&gt;).

### Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need to have a reasonably recent version of node.js to build *urlcat*. 
Tested on node version 12.18.3 and npm version 6.14.6.

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

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/balazsbotond"><img src="https://avatars2.githubusercontent.com/u/2791280?v=4" width="100px;" alt=""/><br /><sub><b>Botond Balázs</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=balazsbotond" title="Code">💻</a> <a href="https://github.com/balazsbotond/urlcat/commits?author=balazsbotond" title="Tests">⚠️</a> <a href="https://github.com/balazsbotond/urlcat/commits?author=balazsbotond" title="Documentation">📖</a> <a href="#infra-balazsbotond" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/balazsbotond/urlcat/issues?q=author%3Abalazsbotond" title="Bug reports">🐛</a> <a href="#maintenance-balazsbotond" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://llll-ll.com"><img src="https://avatars0.githubusercontent.com/u/3541096?v=4" width="100px;" alt=""/><br /><sub><b>kako-jun</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/issues?q=author%3Akako-jun" title="Bug reports">🐛</a> <a href="#ideas-kako-jun" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/polysiya"><img src="https://avatars1.githubusercontent.com/u/722173?v=4" width="100px;" alt=""/><br /><sub><b>Kim Kyudeok</b></sub></a><br /><a href="#ideas-polysiya" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/harshilparmar"><img src="https://avatars3.githubusercontent.com/u/45915468?v=4" width="100px;" alt=""/><br /><sub><b>Harshil Parmar</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=harshilparmar" title="Code">💻</a></td>
    <td align="center"><a href="https://knpw.rs"><img src="https://avatars0.githubusercontent.com/u/174864?v=4" width="100px;" alt=""/><br /><sub><b>Ken Powers</b></sub></a><br /><a href="#platform-knpwrs" title="Packaging/porting to new platform">📦</a> <a href="#userTesting-knpwrs" title="User Testing">📓</a></td>
    <td align="center"><a href="https://github.com/praveen5959"><img src="https://avatars3.githubusercontent.com/u/30530587?v=4" width="100px;" alt=""/><br /><sub><b>Praveen K B</b></sub></a><br /><a href="#ideas-praveen5959" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/balazsbotond/urlcat/commits?author=praveen5959" title="Documentation">📖</a></td>
    <td align="center"><a href="http://@engrkhizariqbal"><img src="https://avatars0.githubusercontent.com/u/5228711?v=4" width="100px;" alt=""/><br /><sub><b>Khizar Iqbal</b></sub></a><br /><a href="#ideas-EngrKhizarIqbal" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/SimonJang"><img src="https://avatars2.githubusercontent.com/u/10977475?v=4" width="100px;" alt=""/><br /><sub><b>Simon Jang</b></sub></a><br /><a href="#ideas-SimonJang" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://luyu.blog"><img src="https://avatars0.githubusercontent.com/u/2239547?v=4" width="100px;" alt=""/><br /><sub><b>Luyu Cheng</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=chengluyu" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.echooff.dev"><img src="https://avatars0.githubusercontent.com/u/149248?v=4" width="100px;" alt=""/><br /><sub><b>Christian Rackerseder</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=screendriver" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/wwaryangupta/"><img src="https://avatars3.githubusercontent.com/u/42470695?v=4" width="100px;" alt=""/><br /><sub><b>Aryan Gupta</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=withoutwaxaryan" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
