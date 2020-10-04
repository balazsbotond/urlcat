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

**NOTE about empty path segments:** [RFC 3986](https://tools.ietf.org/html/rfc3986) allows empty path segments in URLs (for example, `https://example.com//users////2`). *urlcat* keeps any empty path segments that aren't at the concatenation boundary between `baseUrl` and `pathTemplate`. If you need to include an empty path segment there, you have two options:

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
