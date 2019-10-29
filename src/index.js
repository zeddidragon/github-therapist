#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const prompt = require('prompts')
const userhome = require('userhome')
const package = require('../package.json')
const config = {}

const actions = require('./actions')

const flagMap = {
  t: 'type',
  d: 'debug',
  m: 'mode',
  o: 'offset',
  v: 'version',
  h: 'help', }

const help = `
${package.name} ${package.version}
${package.description}

Examples:
  # List all open issues assigned to you in all repos
  gth
  # List all open issues in my-project
  gth my-project
  # List all open issues in my-project assigned to you
  gth -a my-project
  # Show one issue
  gth my-project/1313
  # Close issue with comment
  gth 1313 -C "k done"
  # Comment on issue
  gth 1313 -c "Let's talk about this tomorrow"
  # Re-open issue with comment
  gth 1313 -O "I made a mistake"
`

const apiUrl = 'https://api.github.com'
const apiHeaders = {
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
}

async function get(path, query={}, opts={}) {
  var qs = Object.entries(query)
    .map(entry => entry.join('='))
    .join('&')
  if(qs) qs = `?${qs}`
  const url = new URL(path + qs, apiUrl)
  console.log(url)
  const response = await fetch(url, {
    ...opts,
    headers: {
      ...apiHeaders,
      ...(opts.headers || {}),
    }
  })

  return response.json()
}

async function post(path, body={}, opts={}) {
  const url = new URL(path, apiUrl)
  const response = await fetch(url, {
    body: JSON.stringify({ ...body }),
    method: 'POST',
    ...opts,
    headers: {
      ...apiHeaders,
      ...(opts.headers || {}),
    }
  })

  return response.json()
}

const configPath = path.resolve(userhome(), '.github-therapist.json')
function readConfig() {
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    Object.assign(config, JSON.parse(content))
  } catch {}
}

async function addConfig(cfg) {
  Object.assign(config, cfg)
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  return configPath
}

async function authenticate(user, pass, otp) {
  if(!user) user = await prompt({
    type: 'text',
    name: 'user',
    message: 'Enter Github username:'
  }).then(({ user }) => user)
  if(!pass) pass = await prompt({
    type: 'password',
    name: 'pass',
    message: 'password (not stored):'
  }).then(({ pass }) => pass)
  if(otp === true) otp = await prompt({
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
    scopes: ['repo'],
  }, { headers })

  if(response.message === 'Must specify two-factor authentication OTP code.') {
    return authenticate(user, pass, true)
  } else if(response.message) {
    throw new Error(`API error: ${response.message}`)
  }

  return response.token
}

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

async function parseCli() {
  const args = process.argv.slice(2)
  const opts = {}
  const plain = []

  const token = await getToken()
  apiHeaders.Authorization = `token ${token}`
  console.log(apiHeaders)

  const response = await get(`/issues`)
}

readConfig()
actions.list()
// parseCli()
