export type ParamMap = Record<string, any>;

/**
 * Builds a URL using the base template and parameters specified.
 *
 * @param {String} baseTemplate a URL template that contains zero or more :params
 * @param {Object} params an object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 * @returns a URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo
 * ```
 */
export default function urlcat(baseTemplate: string, params: ParamMap): string;

/**
 * Concatenates the base URL and the path specified using '/' as a separator such
 * that if a '/' occurs at the concatenation boundary in either parameter, it is removed.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 * @returns {String} the result of the concatenation
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/', '/users')
 * // -> 'http://api.example.com/users
 * ```
 */
export default function urlcat(baseUrl: string, path: string): string;

/**
 * Concatenates the base URL and the path specified using '/' as a separator such
 * that if a '/' occurs at the concatenation boundary in either parameter, it is removed.
 * Substitutes path parameters with the properties of the @see params object and appends
 * properties unused in the path as query params.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 * @param {Object} params an object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 * @returns {String} a URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/', '/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo
 * ```
 */
export default function urlcat(baseUrl: string, pathTemplate: string, params: ParamMap): string;

export default function urlcat(baseUrlOrTemplate: string, pathTemplateOrParams: string | ParamMap, maybeParams: ParamMap = {}): string {
  if (typeof pathTemplateOrParams === 'string') {
    const baseUrl = baseUrlOrTemplate;
    const pathTemplate = pathTemplateOrParams;
    const params = maybeParams;
    return urlcatImpl(pathTemplate, params, baseUrl);
  } else {
    const baseTemplate = baseUrlOrTemplate;
    const params = pathTemplateOrParams;
    return urlcatImpl(baseTemplate, params);
  }
}

function urlcatImpl(pathTemplate: string, params: ParamMap, baseUrl?: string) {
  const cleanParams = removeNullOrUndef(params);
  const { renderedPath, remainingParams } = path(pathTemplate, cleanParams);
  const renderedQuery = query(remainingParams);
  const pathAndQuery = join(renderedPath, '?', renderedQuery);
  return baseUrl
    ? join(baseUrl, '/', pathAndQuery)
    : pathAndQuery;
}

/**
 * Creates a query string from the object specified.
 *
 * @param {Object} params an object to convert into a query string.
 * @returns {String} a query string.
 *
 * @example
 * ```ts
 * query({ id: 42, search: 'foo' })
 * // -> 'id=42&search=foo'
 * ```
 */
export function query(params: ParamMap): string {
  return new URLSearchParams(params).toString();
}

/**
 * Substitutes :params in a template with property values of an object.
 *
 * @param {String} template a string that contains :params.
 * @param {Object} params on object with keys that correspond to the params in the template.
 * @returns {String}
 *
 * @example
 * ```ts
 * subst('/users/:id/posts/:postId', { id: 42, postId: 36 })
 * // -> '/users/42/posts/36'
 * ```
 */
export function subst(template: string, params: ParamMap): string {
  const { renderedPath } = path(template, params);
  return renderedPath;
}

function path(template: string, params: ParamMap) {
  const remainingParams = { ...params };
  const allowedTypes = ["boolean", "string", "number"];

  const renderedPath = template.replace(/:\w+/g, p => {
    const key = p.slice(1);
    if (!params.hasOwnProperty(key)) {
      return p;
    }
    delete remainingParams[key];

    if (!allowedTypes.includes(typeof params[key])) {
      throw new TypeError(
        `Path parameter ${key} cannot be of type ${typeof params[key]}. ` +
        `Allowed types are: ${allowedTypes.join(', ')}.`
      );
    }
    return encodeURIComponent(params[key]);
  });

  return { renderedPath, remainingParams };
}

/**
 * Joins two strings using a separator. If the separator occurs at the concatenation
 * boundary in either of the strings, it is removed. This prevents accidental duplication
 * of the separator.
 *
 * @param {String} part1 the first string to join.
 * @param {String} separator the separator to use for joining.
 * @param {String} part2 the second string to join.
 *
 * @example
 * ```ts
 * join('first/', '/', '/second')
 * // -> 'first/second'
 * ```
 */
export function join(part1: string, separator: string, part2: string) {
  const p1 = part1.endsWith(separator) ? part1.slice(0, -separator.length) : part1;
  const p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2;
  return p1 === '' || p2 === ''
    ? p1 + p2
    : p1 + separator + p2;
}

function removeNullOrUndef(params: ParamMap) {
  return Object.keys(params)
    .filter(k => notNullOrUndefined(params[k]))
    .reduce((result, k) => {
      result[k] = params[k];
      return result;
    }, {} as ParamMap);
}

function notNullOrUndefined(v: any) {
  return v !== undefined && v !== null;
}
