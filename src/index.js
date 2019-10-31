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
  const repoArgs = cmdArgs.slice()
  if(!repoArgs[0] || /^\d+$/.test(repoArgs[0])) {
    repoArgs.unshift('default')
  }

  if(flags.help) return actions.help(args[0])
  switch(command) {
    case 'help':
    case 'h':
      return actions.help(cmdArgs[0])
    case 'alias':
    case 'a':
      return actions.alias(cmdArgs)
    case 'new':
    case 'n':
      return actions.new(repoArgs)
    case 'edit':
    case 'e':
      return actions.edit(repoArgs)
    case 'comment':
    case 'c':
      return actions.comment(repoArgs)
    case 'amend':
    case 'm':
      return actions.amend(cmdArgs)
    case 'close':
    case 'C':
      return actions.close(cmdArgs)
    case 'retract':
    case 'r':
      return actions.retract(cmdArgs)
  }

  return actions.issues(args)
}

readConfig()
parseCli()
