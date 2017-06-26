/* global describe, it */
/* eslint no-multi-spaces:0 */

const assert = require('assert')
const passwordHash = require('..')

describe('#passwordHash', function () {
  const hash           = 'sha512$65536$64$c2FsdA==$kEGgeRm+ulyMV3QF5mbBAmN/YvShWUDnfxSfEQCtDFB6iBXU0BestPw5tLYB46qpXy3gqk40zUHa0D/LCzR8aQ=='
  const hashBadHash    = 'sha512$100000$64$c2FsdA==$hSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadSalt    = 'sha512$100000$64$d2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadIter    = 'sha512$200000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadKeyl    = 'sha512$100000$54$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadDige    = 'sha256$100000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk+hSI4gRRMcRFQwOJZUAESw=='
  const hashBadHashlen = 'sha512$100000$64$c2FsdA==$gSLNC2L8GqEGoWZYSKvktrMp+xBFYO5U2WaKBYNlEOmz6H+VIUQwRu3qs1zQlaVk=='

  it('should hash password with given salt', function () {
    const salt = Buffer.from('salt').toString('base64')
    return passwordHash.hash('password', salt)
    .then((res) => {
      // console.log(res)
      assert.equal(res, hash)
    })
  })

  it('should hash password with different options', function () {
    return passwordHash.hash('password', {iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16})
    .then((hash) => {
      assert.ok(hash.indexOf('sha1$100$16$') === 0)
      assert.ok(hash)
      assert.equal(hash.length, 61)
    })
  })

  it('should hash password using a fresh salt', function () {
    let hash
    return passwordHash.hash('password')
    .then((_hash) => {
      // console.log(_hash)
      hash = _hash
      assert.ok(_hash)
      assert.ok(_hash.indexOf('sha512$65536$64$') === 0)
      assert.equal(_hash.length, 193)
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
  })
})
