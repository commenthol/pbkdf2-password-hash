# pbkdf2-password-hash

> hash password with pbkdf2

[![NPM version](https://badge.fury.io/js/pbkdf2-password-hash.svg)](https://www.npmjs.com/package/pbkdf2-password-hash/)

Generation and validation of passwords using PBKDF2 hashes.

Safety is obtained by using safe digest, large number of iterations and large key-length for PBKDF2.
Per default uses `sha512` with 512 bit key and 2^16 iterations.

Requires node >= v6.0.0

## TOC

* [Example](#example)
* [API](#api)
  * [`hash(password, [salt], [opts])`](#hashpassword-salt-opts)
  * [`compare(password, passwordHash)`](#comparepassword-passwordhash)
* [Installation](#installation)
* [Tests](#tests)
* [LICENSE](#license)

## Example

Generate new password hash

```js
const passwordHash = require('pbkdf2-password-hash')

// generates random salt
passwordHash.hash('password')
.then((hash) => {
  //> hash === 'sha512$65536$64$9rGu0njq2wr7foB47qpuR7lj5q28Mlv6crx8swPLZs1ROOUlRlV6nOrANLrvLMJZ+yCEs8K49Nu3ohcIG93xVw==$aUiFKRNpgkqPO4NK/eZz+kVClVqXZsi99L0WZYj9a39hNjSFhP3zg96c6KfGZLHbef0rfemuqpEq00ucldlyNg=='
})
```

Generate password hash with different options

```js
passwordHash.hash('password', {iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16})
.then((hash) => {
  //> hash === 'sha1$100$16$BA83S40bnNVUm8Ap16Ooxg==$7yI4bhCZsaz3fA0nQyAWlg=='
})
```

Validate password hash

```js
const hash = 'sha512$65536$64$9rGu0njq2wr7foB47qpuR7lj5q28Mlv6crx8swPLZs1ROOUlRlV6nOrANLrvLMJZ+yCEs8K49Nu3ohcIG93xVw==$aUiFKRNpgkqPO4NK/eZz+kVClVqXZsi99L0WZYj9a39hNjSFhP3zg96c6KfGZLHbef0rfemuqpEq00ucldlyNg=='
passwordHash.compare('password', hash)
.then((isValid) => {
  //> isValid === true
})
```

## API

### `hash(password, [salt], [opts])`

Generate a new password hash for password using PBKDF2.
Safety is obtained by using safe digest, large number of iterations and large key-length for PBKDF2

**Parameters**

| parameter                  | type   | description                                         |
| -------------------------- | ------ | --------------------------------------------------- |
| `password`                 | String |                                                     |
| `[salt]`                   | String | _optional:_ salt                           |
| `[opts.iterations=65536]`  | Number | _optional:_ PBKDF2 number of iterations (~10 hashes/sec @ 2GHz) |
| `[opts.digest=sha512]`     | String | _optional:_ PBKDF2 digest                           |
| `[opts.keylen=64]`         | Number | _optional:_ PBKDF2 key length                       |
| `[opts.saltlen=64]`        | Number | _optional:_ salt length in case salt is not defined |


**Returns** `Promise`, hashed password in `<digest>$<iterations>$<keylen>$<salt>$<hash>` notation

### `compare(password, passwordHash)`

validate password against passwordHash

**Parameters**

| parameter      | type   | description         |
| -------------- | ------ | ------------------- |
| `password`     | String | plain-text password |
| `passwordHash` | String | hashed password     |


**Returns** `Promise`, true if hash matches password

## Installation

Requires [nodejs](http://nodejs.org/) >= v6.0.0

```sh
$ npm install --save pbkdf2-password-hash
```

## Tests

```sh
$ npm test
```

## LICENSE

UNLICENSE <https://unlicense.org>
