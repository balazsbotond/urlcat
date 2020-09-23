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
  <a href="#how-to-install">How to Install</a> •
  <a href="#typescript">Typescript</a> •
  <a href="#api-documentation">API Docs</a>
</p>

## What?

*urlcat* is a tiny JavaScript library that makes building URL’s very convenient and prevents common mistakes.

<br>
<p align="center">
  <img src="docs/urlcat-usage.svg">
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

## How to Install

```bash
npm install --save urlcat
```

## Typescript

This library provides its own type definitions. Just import and use it.

## API Documentation

(TODO)
