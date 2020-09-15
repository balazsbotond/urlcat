# urlcat - Build correct URL's easily

[![Build Status](https://travis-ci.com/balazsbotond/urlcat.svg?branch=master)](https://travis-ci.com/balazsbotond/urlcat)

## What?

~~~js
> urlcat('https://api.example.com/', '/users/:id/comments', { id: 345, search: 'some text' })
"https://api.example.com/users/345/comments?search=some%20text"
~~~

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

(TODO)

## Typescript

This library provides its own type definitions.

## API Documentation

(TODO)
