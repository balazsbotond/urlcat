## Build correct URL's easily with *urlcat*

*urlcat* is a tiny JavaScript library that makes building URL's very convenient and prevents common mistakes.

- Friendly API
- No dependencies
- Typescript types provided

### Quick example

```js
const API_URL = 'https://api.example.com/';
const requestUrl = urlcat(
  API_URL,
  '/users/:id/comments',
  { id: 234, search: 'some text' }
);
// "https://api.example.com/users/345/comments?search=some%20text"
const response = await fetch(requestUrl);
```
- The path can have :params
- Params not found in the path become query params
- Path and query params are escaped
- No duplicate `/` characters even though `API_URL` ends with one and the path starts with one

### More examples

```js
const API_URL = 'https://api.example.com';
const requestUrl = urlcat(API_URL, 'users');
// "https://api.example.com/users"
```
- Params are optional
- URL parts are joined with exactly one `/` even if there is no slash at the boundary of either part
