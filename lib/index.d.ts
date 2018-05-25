export interface URL {
    constructor: Function;
    pathname: string;
    hostname: string;
    toString(): string;
}
/**
 * Will tranform the given URL into a URL that has the fromLang language tag
 * inserted into the pathname.
 *
 * Path segment transform rules:
 * - `'{fromLang}'` -> `'{toLang}'`
 * - `'path-{fromLang}'` -> `'path-{toLang}'`
 *
 * Index path segment transform rules:
 * - `'/'` -> `'/{toLang}'`
 *
 * Only the right-most `{fromLang}` match in the pathname will be replaced.
 * Since right-most path segments are more specific than others.
 *
 * @example translateUrlByPathname(new URL('http://example.com/home'), 'en', 'fr')
 * @param url The URL to translate
 * @param fromLang The IETF language tag that the URL contains
 * @param toLang The IETF langauage tag that the new URL will contain
 */
export declare function translateUrlByPathname(url: URL, fromLang: string, toLang: string): URL;
/**
 * Will tranform the given URL into a URL that has the fromLang language tag
 * inserted into the hostname.
 *
 * Subdomain transform rules:
 * - `'{fromLang}'` -> `'{toLang}'`
 * - `'sub-{fromLang}'` -> `'sub-{toLang}'`
 *
 * Root domain transform rules:
 * - `'example.com'` -> `'example-{toLang}.com'`
 * - `'example.com'` (with `rootHostname` set to `example.com`) -> `'{toLang}.example.com'`
 *
 * Only the left-most `{fromLang}` match in the hostname will be replaced.
 * Since left-most subdomains are more specific than others.
 *
 * @example translateUrlByHostname(new URL('http://example.com'), 'en', 'fr', { rootHostname: 'example.com' })
 * @param url The URL to translate
 * @param fromLang The IETF language tag that the URL contains
 * @param toLang The IETF language tag that the new URL will contain
 * @param rootHostName The optional root hostname
 */
export declare function translateUrlByHostname(url: URL, fromLang: string, toLang: string, {rootHostname}?: {
    rootHostname?: string;
}): URL;
