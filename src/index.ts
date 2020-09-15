export type ParamMap = Record<string, any>;

export function urlcat(baseTemplate: string, params: ParamMap): string;
export function urlcat(baseUrl: string, pathTemplate: string): string;
export function urlcat(baseUrl: string, pathTemplate: string, params: ParamMap): string;
export function urlcat(baseUrlOrTemplate: string, pathTemplateOrParams: string | ParamMap, maybeParams: ParamMap = {}): string {
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
  const renderedQuery = query(remainingParams);
  return join(join(baseUrl, '/', renderedPath), '?', renderedQuery);
}

function query(params: ParamMap) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

function path(template: string, params: ParamMap) {
  const remainingParams = { ...params };
  const renderedPath = template.replace(/:\w+/g, p => {
    const key = p.slice(1);
    delete remainingParams[key];
    return encodeURIComponent(params[key]);
  });
  return { renderedPath, remainingParams };
}

function join(part1: string, separator: string, part2: string) {
  const p1 = part1.endsWith(separator) ? part1.slice(0, -separator.length) : part1;
  const p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2;
  return p1 === '' || p2 === ''
    ? p1 + p2
    : p1 + separator + p2;
}

function removeNullOrUndef(params: ParamMap) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([_, v]) => notNullOrUndefined(v))
  );
}

function notNullOrUndefined(v: any) {
  return v !== undefined && v !== null;
}