# pbkdf2-password-hash

> hash password with pbkdf2

[![NPM version](https://badge.fury.io/js/pbkdf2-password-hash.svg)](https://www.npmjs.com/package/pbkdf2-password-hash/)

Generation and validation of passwords using PBKDF2 hashes.

Safety is obtained by using safe digest, large number of iterations and large key-length for PBKDF2.
Per default uses `sha512` with 512 bit key and 2^16 iterations.

Requires node >= v6.0.0

## TOC

<!-- TOC depthFrom:2 -->

- [TOC](#toc)
- [Example](#example)
- [API](#api)
  - [`hash(password, [salt], [opts])`](#hashpassword-salt-opts)
  - [`compare(password, passwordHash)`](#comparepassword-passwordhash)
- [Migrating from v1](#migrating-from-v1)
- [Installation](#installation)
- [Tests](#tests)
- [LICENSE](#license)

<!-- /TOC -->

## Example

Generate new password hash

```js
const passwordHash = require('pbkdf2-password-hash')

// generates random salt
passwordHash.hash('password')
  .then((hash) => {
    //> hash === 'sha512$65536$64$F8zraj9jMjo/GmV91lPNVX7MP8iaJX/NK6YG4u4NH+wUeBBfydb5kZl4Bc7nlChZAH78YaExx9l0WfPuEC39Ew==$UcjfxN4pmEv+iD8nUjyd4hEnlkkkuLYEtAy1V3Cr3s96AAeyBLbRUhVgJTwSRJZUj23xQ2cuOPTnH/YoAkNqOQ=='
  })
```

Generate password hash with different options

```js
passwordHash.hash('password', {iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16})
.then((hash) => {
  //> hash === 'sha1$100$16$fwzPKhZjCQSZMz+hY7A29A==$KdGdduxkKd08FDUuUVDVRQ=='
})
```

Validate password hash

```js
const hash = 'sha512$65536$64$F8zraj9jMjo/GmV91lPNVX7MP8iaJX/NK6YG4u4NH+wUeBBfydb5kZl4Bc7nlChZAH78YaExx9l0WfPuEC39Ew==$UcjfxN4pmEv+iD8nUjyd4hEnlkkkuLYEtAy1V3Cr3s96AAeyBLbRUhVgJTwSRJZUj23xQ2cuOPTnH/YoAkNqOQ=='
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

## Migrating from v1

> **⚠ NOTE:** v1 had an issue with low entropy for the salt as only base64 encoded values where used as input.

Therefore all stored strings do require updating the salt to maintain compatibility with >= v2.

_Example:_

```js
const convert = require('pbkdf2-password-hash/src/convert')

// update salt only...
const current = 'sha512$65536$64$c2FsdA==$kEGgeRm+ulyMV3QF5mbBAmN/YvShWUDnfxSfEQCtDFB6iBXU0BestPw5tLYB46qpXy3gqk40zUHa0D/LCzR8aQ=='
const newHash = convert(current)
//> newHash === 'sha512$65536$64$YzJGc2RBPT0=$kEGgeRm+ulyMV3QF5mbBAmN/YvShWUDnfxSfEQCtDFB6iBXU0BestPw5tLYB46qpXy3gqk40zUHa0D/LCzR8aQ=='
```

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
