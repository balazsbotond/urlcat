export type ParamMap = Record<string, any>;

export default function urlcat(baseTemplate: string, params: ParamMap): string;
export default function urlcat(baseUrl: string, pathTemplate: string): string;
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

export function query(params: ParamMap) {
  return new URLSearchParams(params).toString();
}

export function subst(template: string, params: ParamMap) {
  const { renderedPath } = path(template, params);
  return renderedPath;
}

function path(template: string, params: ParamMap) {
  const remainingParams = { ...params };

  const renderedPath = template.replace(/:\w+/g, p => {
    const key = p.slice(1);
    if (!params.hasOwnProperty(key)) {
      return p;
    }
    delete remainingParams[key];
    return encodeURIComponent(params[key]);
  });

  return { renderedPath, remainingParams };
}

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
