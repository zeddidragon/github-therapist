#!/usr/bin/env node
const actions = require('./actions')

const { readConfig } = require('./config')
const { getToken } = require('./auth')
const { apiHeaders } = require('./http')

async function parseCli() {
  const token = await getToken()
  apiHeaders.Authorization = `token ${token}`

  const args = process.argv.slice(2)

  if(args[0] === 'alias') {
    return actions.alias(args.slice(1))
  }

  return actions.issues(args)
}

readConfig()
parseCli()
