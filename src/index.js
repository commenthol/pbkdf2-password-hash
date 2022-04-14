const crypto = require('crypto')
const promisify = require('./promisify')
const timingSafeEqual = require('compare-timing-safe')
const pbkdf2 = promisify(crypto.pbkdf2)
const randomBytes = promisify(crypto.randomBytes)

const SEP = '$'

const OPTIONS = {
  iterations: Math.pow(2, 16), // ~ 10hashes/sec @ 2GHz
  keylen: 64, // 512 bits
  digest: 'sha512',
  saltlen: 64
}

/**
* Generate a new password hash for `password` using PBKDF2
* Safety is obtained by large number of iterations and large key length for PBKDF2
* @param {String} password
* @param {String} [salt] - optional salt
* @param {Object} [opts]
* @param {Number} [opts.iterations=65536] - PBKDF2 number of iterations (~10 hashes/sec @ 2GHz)
* @param {String} [opts.digest=sha512] - PBKDF2 digest
* @param {Number} [opts.keylen=64] - PBKDF2 key length
* @param {Number} [opts.saltlen=64] - salt length in case `salt` is not defined
* @return {Promise} hashed password in `<digest>$<iterations>$<keylen>$<salt>$<hash>` notation
*/
function hash (password, salt, opts) {
  if (typeof salt === 'object') {
    opts = salt
    salt = undefined
  }
  const _opts = Object.assign({}, OPTIONS, opts)
  const { digest, iterations, keylen } = _opts

  let promise

  if (!salt) {
    promise = randomBytes(_opts.saltlen)
  } else {
    promise = new Promise((resolve) => resolve(Buffer.from(salt, 'base64')))
  }

  return promise
    .then((saltBuf) => {
      salt = saltBuf.toString('base64')
      return pbkdf2(String(password), saltBuf, iterations, keylen, digest)
    })
    .then((buf) => {
      const hash = buf.toString('base64')
      const str = [digest, iterations, keylen, salt, hash].join(SEP)
      return str
    })
}

/**
* validate `password` against `passwordHash`
* @param {String} password - plain-text password
* @param {String} passwordHash - hashed password
* @return {Promise} true if hash matches password
*/
function compare (password, passwordHash) {
  let [digest, iterations, keylen, salt] = passwordHash.split(SEP) // eslint-disable-line no-unused-vars
  iterations = parseInt(iterations, 10)
  keylen = parseInt(keylen, 10)
  return hash(password, salt, { digest, iterations, keylen })
    .then((hash) =>
      timingSafeEqual(hash, passwordHash)
    )
}

module.exports = { hash, compare }
