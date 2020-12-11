import qs, { IStringifyOptions } from 'qs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParamMap = Record<string, any>;
export type UrlCatConfiguration =
  Partial<Pick<IStringifyOptions, 'arrayFormat'> & { objectFormat: Partial<Pick<IStringifyOptions, 'format'>> }>

/**
 * Builds a URL using the base template and specified parameters.
 *
 * @param {String} baseTemplate a URL template that contains zero or more :params
 * @param {Object} params an object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 *
 * @returns {String} a URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo
 * ```
 */
export default function urlcat(baseTemplate: string, params: ParamMap): string;

/**
 * Concatenates the base URL and the path specified using '/' as a separator.
 * If a '/' occurs at the concatenation boundary in either parameter, it is removed.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 *
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
 * Concatenates the base URL and the path specified using '/' as a separator.
 * If a '/' occurs at the concatenation boundary in either parameter, it is removed.
 * Substitutes path parameters with the properties of the @see params object and appends
 * unused properties in the path as query params.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 * @param {Object} params Object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 *
 * @returns {String} URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/', '/users/:id', { id: 42, search: 'foo' })
 * // -> 'http://api.example.com/users/42?search=foo
 * ```
 */
export default function urlcat(
  baseUrl: string,
  pathTemplate: string,
  params: ParamMap
): string;

/**
 * Concatenates the base URL and the path specified using '/' as a separator.
 * If a '/' occurs at the concatenation boundary in either parameter, it is removed.
 * Substitutes path parameters with the properties of the @see params object and appends
 * unused properties in the path as query params.
 *
 * @param {String} baseUrl the first part of the URL
 * @param {String} path the second part of the URL
 * @param {Object} params Object with properties that correspond to the :params
 *   in the base template. Unused properties become query params.
 * @param {Object} config urlcat configuration object
 *
 * @returns {String} URL with path params substituted and query params appended
 *
 * @example
 * ```ts
 * urlcat('http://api.example.com/', '/users/:id', { id: 42, search: 'foo' }, {objectFormat: {format: 'RFC1738'}})
 * // -> 'http://api.example.com/users/42?search=foo
 * ```
 */
export default function urlcat(
  baseUrlOrTemplate: string,
  pathTemplateOrParams: string | ParamMap,
  maybeParams: ParamMap,
  config: UrlCatConfiguration
): string;

export default function urlcat(
  baseUrlOrTemplate: string,
  pathTemplateOrParams: string | ParamMap,
  maybeParams: ParamMap = {},
  config: UrlCatConfiguration = {}
): string {
  if (typeof pathTemplateOrParams === 'string') {
    const baseUrl = baseUrlOrTemplate;
    const pathTemplate = pathTemplateOrParams;
    const params = maybeParams;
    return urlcatImpl(pathTemplate, params, baseUrl, config);
  } else {
    const baseTemplate = baseUrlOrTemplate;
    const params = pathTemplateOrParams;
    return urlcatImpl(baseTemplate, params, undefined, config);
  }
}

/**
 * Factory function providing a pre configured urlcat function
 *
 * @param {Object} config Configuration object for urlcat
 *
 * @returns {Function} urlcat decorator function
 *
 * @example
 * ```ts
 * configure({arrayFormat: 'brackets', objectFormat: {format: 'RFC1738'}})
 * ```
 */
export function configure(rootConfig: UrlCatConfiguration) {
  return (
    baseUrlOrTemplate: string,
    pathTemplateOrParams: string | ParamMap,
    maybeParams: ParamMap = {}, config: UrlCatConfiguration = {}
  ): string =>
    urlcat(baseUrlOrTemplate, pathTemplateOrParams, maybeParams, { ...rootConfig, ...config });
}

function joinFullUrl(renderedPath: string, baseUrl: string, pathAndQuery: string): string {
  if (renderedPath.length) {
    return join(baseUrl, '/', pathAndQuery);
  } else {
    return join(baseUrl, '?', pathAndQuery);
  }
}

function urlcatImpl(
  pathTemplate: string,
  params: ParamMap,
  baseUrl: string | undefined,
  config: UrlCatConfiguration
) {
  const { renderedPath, remainingParams } = path(pathTemplate, params);
  const cleanParams = removeNullOrUndef(remainingParams);
  const renderedQuery = query(cleanParams, config);
  const pathAndQuery = join(renderedPath, '?', renderedQuery);

  return baseUrl ? joinFullUrl(renderedPath, baseUrl, pathAndQuery) : pathAndQuery;
}

/**
 * Creates a query string from the specified object.
 *
 * @param {Object} params an object to convert into a query string.
 * @param {Object} config configuration to stringify the query params.
 *
 * @returns {String} Query string.
 *
 * @example
 * ```ts
 * query({ id: 42, search: 'foo' })
 * // -> 'id=42&search=foo'
 * ```
 */
export function query(params: ParamMap, config?: UrlCatConfiguration): string {
  const qsConfiguration: IStringifyOptions = {
    format: config?.objectFormat?.format ?? 'RFC1738', // RDC1738 is urlcat's current default. Breaking change if default is changed
    arrayFormat: config?.arrayFormat
  }

  return qs.stringify(params, qsConfiguration);
}

/**
 * Substitutes :params in a template with property values of an object.
 *
 * @param {String} template a string that contains :params.
 * @param {Object} params an object with keys that correspond to the params in the template.
 *
 * @returns {String} Rendered path after substitution.
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

  const renderedPath = template.replace(/:[_A-Za-z][_A-Za-z0-9]*/g, p => {
    const key = p.slice(1);
    validatePathParam(params, key);
    delete remainingParams[key];
    return encodeURIComponent(params[key]);
  });

  return { renderedPath, remainingParams };
}

function validatePathParam(params: ParamMap, key: string) {
  const allowedTypes = ['boolean', 'string', 'number'];

  if (!Object.prototype.hasOwnProperty.call(params, key)) {
    throw new Error(`Missing value for path parameter ${key}.`);
  }
  if (!allowedTypes.includes(typeof params[key])) {
    throw new TypeError(
      `Path parameter ${key} cannot be of type ${typeof params[key]}. ` +
      `Allowed types are: ${allowedTypes.join(', ')}.`
    );
  }
  if (typeof params[key] === 'string' && params[key].trim() === '') {
    throw new Error(`Path parameter ${key} cannot be an empty string.`);
  }
}

/**
 * Joins two strings using a separator.
 * If the separator occurs at the concatenation boundary in either of the strings, it is removed.
 * This prevents accidental duplication of the separator.
 *
 * @param {String} part1 First string.
 * @param {String} separator Separator used for joining.
 * @param {String} part2 Second string.
 *
 * @returns {String} Joined string.
 *
 * @example
 * ```ts
 * join('first/', '/', '/second')
 * // -> 'first/second'
 * ```
 */
export function join(part1: string, separator: string, part2: string): string {
  const p1 = part1.endsWith(separator)
    ? part1.slice(0, -separator.length)
    : part1;
  const p2 = part2.startsWith(separator)
    ? part2.slice(separator.length)
    : part2;
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

function notNullOrUndefined(v: string) {
  return v !== undefined && v !== null;
}
