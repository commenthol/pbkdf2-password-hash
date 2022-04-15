import assert from 'assert'
import convert from '../src/convert.js'
import passwordHash from '../src/index.js'

describe('convert', function () {
  const exp = 'sha512$65536$64$YzJGc2RBPT0=$kEGgeRm+ulyMV3QF5mbBAmN/YvShWUDnfxSfEQCtDFB6iBXU0BestPw5tLYB46qpXy3gqk40zUHa0D/LCzR8aQ=='

  it('should convert salt', function () {
    const inp = 'sha512$65536$64$c2FsdA==$kEGgeRm+ulyMV3QF5mbBAmN/YvShWUDnfxSfEQCtDFB6iBXU0BestPw5tLYB46qpXy3gqk40zUHa0D/LCzR8aQ=='
    const res = convert(inp)
    assert.strictEqual(res, exp)
  })

  it('converted hash should verify', function () {
    return passwordHash.compare('password', exp)
      .then((isValid) => {
        assert.strictEqual(isValid, true)
      })
  })
})
