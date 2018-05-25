import * as assert from 'assert'
import { URL } from 'url'
import { translateUrlByHostname, translateUrlByPathname } from './index'

describe('lang/translateUrlByPathname', function () {
  it('should translate when strategy is uri', function () {
    let url = translateUrlByPathname(new URL('http://site.com/'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/fr')

    url = translateUrlByPathname(new URL('http://site.com/en'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/fr')

    url = translateUrlByPathname(new URL('http://site.com/en/sub'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/fr/sub')

    url = translateUrlByPathname(new URL('http://site.com/sub/en'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/sub/fr')

    url = translateUrlByPathname(new URL('http://site.com/sub/sub-en'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/sub/sub-fr')

    url = translateUrlByPathname(new URL('http://site.com/sub/sub-en/en/end'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site.com/sub/sub-en/fr/end')
  })

  it('should translate when strategy is hostname', function () {
    let url = translateUrlByHostname(new URL('http://localhost:8999'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://localhost-fr:8999/')

    url = translateUrlByHostname(new URL('http://site.com'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site-fr.com/')

    url = translateUrlByHostname(new URL('http://en.site.com'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://fr.site.com/')

    url = translateUrlByHostname(new URL('http://sub.en.site.com/path'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://sub.fr.site.com/path')

    url = translateUrlByHostname(new URL('http://en.sub.site.com/path'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://fr.sub.site.com/path')

    url = translateUrlByHostname(new URL('http://site-en.com/sub/sub-en'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://site-fr.com/sub/sub-en')

    url = translateUrlByHostname(new URL('http://en.site-en.com/path/path'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://fr.site-en.com/path/path')

    url = translateUrlByHostname(new URL('http://end.site-en.com/path/path'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://end.site-fr.com/path/path')

    url = translateUrlByHostname(new URL('http://platform.onboardmd-staging.com'), 'en', 'fr')
    assert.strictEqual(url.toString(), 'http://platform-fr.onboardmd-staging.com/')

    url = translateUrlByHostname(new URL('http://platform.onboardmd-staging.com'), 'en', 'fr', { rootHostname: 'platform.onboardmd-staging.com' })
    assert.strictEqual(url.toString(), 'http://fr.platform.onboardmd-staging.com/')
  })
})
