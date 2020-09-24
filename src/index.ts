export type ParamMap = Record<string, any>;

export default function urlcat(baseTemplate: string, params: ParamMap): string;
export default function urlcat(baseUrl: string, pathTemplate: string): string;
export default function urlcat(baseUrl: string, pathTemplate: string, params: ParamMap): string;
export default function urlcat(baseUrlOrTemplate: string, pathTemplateOrParams: string | ParamMap, maybeParams: ParamMap = {}): string {
  let baseUrl: string;
  let pathTemplate: string;
  let params: ParamMap;

  if (typeof pathTemplateOrParams === 'string') {
    baseUrl = baseUrlOrTemplate;
    pathTemplate = pathTemplateOrParams;
    params = maybeParams;
  } else {
    baseUrl = '';
    pathTemplate = baseUrlOrTemplate;
    params = pathTemplateOrParams;
  }

  return urlcatImpl(baseUrl, pathTemplate, params);
}

function urlcatImpl(baseUrl: string, pathTemplate: string, params: ParamMap) {
  const cleanParams = removeNullOrUndef(params);
  const { renderedPath, remainingParams } = path(pathTemplate, cleanParams);
  const url = new URL(renderedPath, baseUrl);
  url.search = query(remainingParams);
  return url.href;
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
