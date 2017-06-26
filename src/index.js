const crypto = require('crypto')
const promisify = require('./promisify')
const pbkdf2 = promisify(crypto.pbkdf2)
const randomBytes = promisify(crypto.randomBytes)
const {isBase64} = require('url-safe-base64')

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

  let promise

  if (!salt) {
    promise = randomBytes(_opts.saltlen)
      .then((_salt) => _salt.toString('base64'))
  } else {
    if (!isBase64(salt)) salt = Buffer.from(salt).toString('base64')
    promise = new Promise((resolve) => resolve())
  }

  return promise
  .then((_salt) => {
    salt = salt || _salt
    return pbkdf2(password, salt, _opts.iterations, _opts.keylen, _opts.digest)
  })
  .then((buf) => {
    const hash = buf.toString('base64')
    return `${_opts.digest}$${_opts.iterations}$${_opts.keylen}$${salt}$${hash}`
  })
}

/**
* validate `password` against `passwordHash`
* @param {String} password - plain-text password
* @param {String} passwordHash - hashed password
* @return {Promise} true if hash matches password
*/
function compare (password, passwordHash) {
  let [digest, iterations, keylen, salt] = passwordHash.split('$') // eslint-disable-line no-unused-vars
  iterations = parseInt(iterations, 10)
  keylen = parseInt(keylen, 10)
  return hash(password, salt, {digest, iterations, keylen})
  .then((hash) => (constTimeCompare(hash, passwordHash)))
}

/**
* string comparison in length-constant time
*/
function constTimeCompare (a = '', b = '') {
  let diff = (a.length !== b.length)
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    diff |= (a[i] !== b[i])
  }
  return (!!diff === false)
}

module.exports = {hash, compare}
