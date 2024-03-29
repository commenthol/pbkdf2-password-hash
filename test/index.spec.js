/* eslint no-multi-spaces:0 */

import assert from 'assert'
import passwordHash from '../src/index.js'

describe('#passwordHash', function () {
  const hash           = 'sha512$120000$64$YzJGc2RBPT0=$B0ollT5ky+Ng6S1UPjjAVd37KgXF+6ltCYHzVpXAXRbCkITDZzSBllFa1xDUYDDB7eMFYCn6YPT5WF40h3ekoA=='
  const hashBadHash    = 'sha512$100000$64$c2FsdA==$hSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadSalt    = 'sha512$100000$64$d2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadIter    = 'sha512$200000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadKeyl    = 'sha512$100000$54$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadDige    = 'sha256$100000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadHashlen = 'sha512$100000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk=='

  it('should hash password with given salt', function () {
    // due to error in previous version all salt values need to be base64 double encoded.
    const salt = Buffer.from(Buffer.from('salt').toString('base64')).toString('base64')
    return passwordHash.hash('password', salt)
      .then((res) => {
        assert.equal(res, hash)
      })
  })

  it('should hash password with different options', function () {
    return passwordHash.hash('password', { iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16 })
      .then((hash) => {
        // console.log(hash)
        assert.ok(hash.indexOf('sha1$100$16$') === 0)
        assert.ok(hash)
        assert.equal(hash.length, 61)
      })
  })

  it('should hash password using a fresh salt', function () {
    let hash
    return passwordHash.hash('password')
      .then((_hash) => {
        hash = _hash
        assert.ok(_hash)
        assert.ok(_hash.indexOf('sha512$120000$64$') === 0)
        assert.equal(_hash.length, 194)
        return passwordHash.hash('password')
      })
      .then((_hash) => {
        assert.ok(_hash)
        assert.ok(_hash !== hash)
      })
  })

  describe('should validate a hashed password', function () {
    it('good case', function () {
      return passwordHash.compare('password', hash)
        .then((res) => {
          assert.strictEqual(res, true)
        })
    })

    it('with wrong hash', function () {
      return passwordHash.compare('password', hashBadHash)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong salt', function () {
      return passwordHash.compare('password', hashBadSalt)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong iterations', function () {
      return passwordHash.compare('password', hashBadIter)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with bad keylen', function () {
      return passwordHash.compare('password', hashBadKeyl)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong digest', function () {
      return passwordHash.compare('password', hashBadDige)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong hash length', function () {
      return passwordHash.compare('password', hashBadHashlen)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong type object', function () {
      return passwordHash.compare({ pwd: 'password' }, hash)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })

    it('with wrong type array', function () {
      return passwordHash.compare(['password', 'test'], hash)
        .then((res) => {
          assert.strictEqual(res, false)
        })
    })
  })
})
