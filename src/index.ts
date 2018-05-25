export interface URL {
  constructor: Function
  pathname: string
  hostname: string
  toString (): string
}

function lastIndexOfPattern (str: string, regex: RegExp) {
  // Clone the regex
  const parts = regex.toString().split('/')
  const flags = (parts.pop() + 'g').replace(/g{2,}/, 'g')
  const pattern = parts.slice(1).join('/')
  regex = new RegExp(pattern, flags)

  let index = -1
  let m = regex.exec(str)

  while (m) {
    index = regex.lastIndex - m[0].length
    m = regex.exec(str)
  }

  return index
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
export function translateUrlByPathname (url: URL, fromLang: string, toLang: string): URL {
  // Make a copy of the URL instance
  const URLCtor = url.constructor as { new (input: string): URL }
  let urlCopy = new URLCtor(url.toString())
  let pattern = new RegExp(`([-|/])${fromLang}\\b`)
  const k = lastIndexOfPattern(urlCopy.pathname, pattern)

  if (k >= 0) {
    // Up to and including the '/' in front of the fromLang
    urlCopy.pathname = urlCopy.pathname.substr(0, k + 1) +
      // The new language tag
      toLang +
      // The rest of the pathname not including the '/' before the fromLang
      urlCopy.pathname.substr(k + 1 + fromLang.length)
  } else {
    // The fromLang was not found in the URL so we assume the URL's native
    // language is the fromLang and just prepend the toLang language tag
    urlCopy.pathname = '/' + [ toLang, urlCopy.pathname.slice(1) ].filter(Boolean).join('/')
  }

  return urlCopy
}

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
export function translateUrlByHostname (url: URL, fromLang: string, toLang: string, { rootHostname = '' } = {}): URL {
  // Make a copy of the URL instance
  const URLCtor = url.constructor as { new (input: string): URL }
  let urlCopy = new URLCtor(url.toString())

  // If the URL given equals the rootHostname then the new URL will have the
  // hostname: {toLang}.{rootHostname}
  if (rootHostname && urlCopy.pathname === '/' && urlCopy.hostname === rootHostname) {
    urlCopy.hostname = toLang + '.' + rootHostname
    return urlCopy
  }

  // If the URL has a hostname that starts with a subdomain that equals the
  // fromLang then replace that subdomain with toLang
  if (urlCopy.hostname.startsWith(`${fromLang}.`)) {
    urlCopy.hostname = toLang + urlCopy.hostname.slice(fromLang.length)
  } else {
    // Attempt to replace a subdomain that ends with `-` followed by fromLang or
    // a subdomain equals fromLang.
    const translatedUrl = url.toString().replace(new RegExp(`([-|.])${fromLang}\\b`), `$1${toLang}`)
    // If nothing was replaced then transform the first subdomain to be of the
    // form: {subdomain}-{toLang}
    if (translatedUrl === url.toString()) {
      const hostParts = urlCopy.hostname.split('.')
      urlCopy.hostname = [].concat(hostParts[0] + `-${toLang}`, hostParts.slice(1).join('.')).filter(Boolean).join('.')
    // Otherwise there was a replacement so set the urlCopy so it gets returned
    } else {
      urlCopy = new URLCtor(translatedUrl)
    }
  }

  return urlCopy
}
