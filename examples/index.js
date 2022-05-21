import passwordHash from '../src/index.js'

Promise.resolve()
  .then(() => {
    // generates random salt
    return passwordHash.hash('password')
      .then((hash) => {
        console.log(hash)
        // > hash === 'sha512$120000$64$hBKkXNgl006VdFvQPyCawVYwdT78Uns1x0VnixvHHKfVzjS0Y0p58auWZ5AVV6MFGt/E1HaJ2MOqJSlKkaDspA==$zkq/ubSJoqflS23Ot5EkI6H+LE+D26p+6C0wtPHIr4HPVZPfXR/ZiflXAQ01b2uXCfHN8XUzOXWY9MqcvBYIog=='
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
    const hash = 'sha512$120000$64$hBKkXNgl006VdFvQPyCawVYwdT78Uns1x0VnixvHHKfVzjS0Y0p58auWZ5AVV6MFGt/E1HaJ2MOqJSlKkaDspA==$zkq/ubSJoqflS23Ot5EkI6H+LE+D26p+6C0wtPHIr4HPVZPfXR/ZiflXAQ01b2uXCfHN8XUzOXWY9MqcvBYIog=='
    return passwordHash.compare('password', hash)
      .then((isValid) => {
        console.log(isValid)
        // > isValid === true
      })
  })
