const os = require('os')
const prompts = require('prompts')
const raise = require('./error')
const { config, addConfig } = require('./config')
const { post } = require('./http')

async function getToken() {
  if(config.token) return config.token
  const token = await authenticate()

  if(!token) {
    throw new Error('Failed to acquire token')
  }

  const path = await addConfig({ token })
  console.log(`Token stored in ${path}`)
  return token
}

async function authenticate(user, pass, finger, otp) {
  if(!user) user = await prompts({
    type: 'text',
    name: 'user',
    message: 'Enter Github username'
  }).then(({ user }) => user)
  if(!pass) pass = await prompts({
    type: 'password',
    name: 'pass',
    message: 'password (not stored)'
  }).then(({ pass }) => pass)
  if(!finger) finger = await prompts({
    type: 'text',
    name: 'finger',
    message: 'fingerprint',
    initial: os.hostname(),
  })
  if(otp === true) otp = await prompts({
    type: 'text',
    name: 'otp',
    message: 'OTP code:',
  }).then(({ otp }) => otp)

  const basic = Buffer
    .from(`${user}:${pass}`)
    .toString('base64')
  const headers = {}
  headers.authorization = `Basic ${basic}`
  if(otp) headers['x-github-otp'] = otp

  const response = await post('/authorizations', {
    note: 'github-therapist',
    note_url: 'https://github.com/zeddidragon/github-therapist',
    scopes: ['repo'],
    fingerprint: finger,
  }, { headers })

  if(response.message === 'Must specify two-factor authentication OTP code.') {
    return authenticate(user, pass, finger, true)
  } else if(response.message) {
    raise(`API error: ${response.message}`)
  }

  return response.token
}

module.exports = {
  getToken,
}
