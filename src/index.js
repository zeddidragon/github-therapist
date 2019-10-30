#!/usr/bin/env node
const actions = require('./actions')

const { readConfig, flags } = require('./config')
const { getToken } = require('./auth')
const { apiHeaders } = require('./http')
const processArgs = require('./args')


async function parseCli() {
  const token = await getToken()
  apiHeaders.Authorization = `token ${token}`

  const args = processArgs()
  const [command, ...cmdArgs] = args

  switch(command) {
    case 'help':
    case 'h':
      return actions.help(cmdArgs[0])
    case 'alias':
    case 'a':
      return actions.alias(cmdArgs)
    case 'new':
    case 'n':
      return actions.new(cmdArgs)
  }

  return actions.issues(args)
}

readConfig()
parseCli()
