const passwordHash = require('..')

Promise.resolve()
  .then(() => {
    // generates random salt
    return passwordHash.hash('password')
      .then((hash) => {
        console.log(hash)
        // > hash === 'sha512$65536$64$F8zraj9jMjo/GmV91lPNVX7MP8iaJX/NK6YG4u4NH+wUeBBfydb5kZl4Bc7nlChZAH78YaExx9l0WfPuEC39Ew==$UcjfxN4pmEv+iD8nUjyd4hEnlkkkuLYEtAy1V3Cr3s96AAeyBLbRUhVgJTwSRJZUj23xQ2cuOPTnH/YoAkNqOQ=='
      })
  })
  .then(() => {
    // use different options
    return passwordHash.hash('password', {
      iterations: 100,
      digest: 'sha1',
      keylen: 16,
      saltlen: 16
    })
      .then((hash) => {
        console.log(hash)
        // > hash === 'sha1$100$16$fwzPKhZjCQSZMz+hY7A29A==$KdGdduxkKd08FDUuUVDVRQ=='
      })
  })
  .then(() => {
    // Validate password hash
    const hash = 'sha512$65536$64$F8zraj9jMjo/GmV91lPNVX7MP8iaJX/NK6YG4u4NH+wUeBBfydb5kZl4Bc7nlChZAH78YaExx9l0WfPuEC39Ew==$UcjfxN4pmEv+iD8nUjyd4hEnlkkkuLYEtAy1V3Cr3s96AAeyBLbRUhVgJTwSRJZUj23xQ2cuOPTnH/YoAkNqOQ=='
    return passwordHash.compare('password', hash)
      .then((isValid) => {
        console.log(isValid)
        // > isValid === true
      })
  })
