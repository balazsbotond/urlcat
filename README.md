<h1 align="center">
  <br>
  <img src="/cat.svg" alt="Markdownify">
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
  <a href="#/?id=what">What?</a> •
  <a href="#/?id=why">Why?</a> •
  <a href="#/?id=how">How?</a> •
  <a href="#/?id=usage-with-typescript">TypeScript</a> •
  <a href="#/?id=help">Help</a> •
  <a href="#/?id=contribute">Contribute</a>
</p>

## What?

*urlcat* is a tiny JavaScript library that makes building URLs very convenient and prevents common mistakes.

<br>
<p align="center">
  <img src="/urlcat-basic-usage.svg">
</p>

Features:

- Friendly API
- No dependencies
- 0.6 KB minified and gzipped
- TypeScript types provided

## Why?

When I need to call an HTTP API, I usually need to add dynamic parameters to the URL:

~~~js
const API_URL = 'https://api.example.com/';

function getUserPosts(id, blogId, limit, offset) {
  const requestUrl = `${API_URL}/users/${id}/blogs/${blogId}/posts?limit=${limit}&offset=${offset}`;
  // send HTTP request
}
~~~

As you can see, this minimal example is already rather hard to read. It is also incorrect:

- I forgot that there was a trailing slash at the end of the `API_URL` constant so the slash got duplicated (`https://api.example.com//users`)
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

Such a simple task and yet very hard to read and tedious to write! This is why I made this tiny library:

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

Currently, the package is distributed via npm. Zip downloads and a CDN are coming soon.

```bash
npm install --save urlcat
```

### Usage with Node

Node 10 and above are officially supported. Since the code uses the `URL` and `URLSearchParams` classes internally, which aren't available below v10, we cannot support those versions.

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

### Usage with TypeScript

TypeScript 2.1 and above are officially supported. *urlcat* provides its own type definitions. "It just works", no need to install anything from `@types`.

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

### Usage with Deno

```ts
import urlcat from 'https://deno.land/x/urlcat/src/index.ts';

console.log(urlcat('https://api.foo.com', ':name', { id: 25, name: 'knpwrs' }));
```

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

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)

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
    <td align="center"><a href="https://github.com/praveen5959"><img src="https://avatars3.githubusercontent.com/u/30530587?v=4" width="100px;" alt=""/><br /><sub><b>Praveen K B</b></sub></a><br /><a href="#ideas-praveen5959" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://@engrkhizariqbal"><img src="https://avatars0.githubusercontent.com/u/5228711?v=4" width="100px;" alt=""/><br /><sub><b>Khizar Iqbal</b></sub></a><br /><a href="#ideas-EngrKhizarIqbal" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/SimonJang"><img src="https://avatars2.githubusercontent.com/u/10977475?v=4" width="100px;" alt=""/><br /><sub><b>Simon Jang</b></sub></a><br /><a href="#ideas-SimonJang" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://luyu.blog"><img src="https://avatars0.githubusercontent.com/u/2239547?v=4" width="100px;" alt=""/><br /><sub><b>Luyu Cheng</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=chengluyu" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.echooff.dev"><img src="https://avatars0.githubusercontent.com/u/149248?v=4" width="100px;" alt=""/><br /><sub><b>Christian Rackerseder</b></sub></a><br /><a href="https://github.com/balazsbotond/urlcat/commits?author=screendriver" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

