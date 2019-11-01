const { yellow } = require('kleur')
const { config, addConfig } = require('../config')
const { aliases: help } = require('./help')
const raise = require('../error')

function list(prop, highlight) {
  const aliases = Object.entries(config[prop] || {})
  if(!aliases.length) {
    console.log(`You have no ${prop}`)
    return help()
  }

  const max = aliases.map(([k]) => k.length).reduce((a, b) => Math.max(a, b))
  console.log(aliases.map(([k, v]) => {
    const str = `${k.padStart(max)} => ${v}`
    return highlight === k ? yellow(str) : str
  }).join('\n'))
}

function listAliases(highlight) {
  return list('aliases', highlight)
}

function listNicks(highlight) {
  return list('nicks', highlight)
}

const reserved = [
  'alias',
  'help',
  'list',
  'show',
  'n',
  'c',
  'C',
]

function add(prop, symbol, linked) {
  const single = {
    aliases: 'alias',
    nicks: 'nick',
  }[prop]
  if(!linked) raise(`No ${single} specified`)
  const aliases = config[prop] || {}
  if(symbol === 'clear') {
    delete aliases[linked]
    addConfig({ [prop]: aliases })
    console.log(`Cleared ${single} ${linked}`)
    process.exit(0)
  }

  aliases[symbol] = linked
  addConfig({ [prop]: aliases })
}

function addAlias(symbol, repo) {
  if(reserved.includes(symbol)) {
    raise(`Cannot alias reserved token:  ${symbol}
The following tokens are reserved: \n  ${reserved.join(', ')}`)
  }
  if(/\//.test(symbol)) {
    raise(`Alias cant not contain slashes:  ${symbol}`)
  }

  add('aliases', symbol, repo)
  listAliases(symbol)
}

function addNick(symbol, user) {
  add('nicks', symbol, user)
  listNicks(symbol)
}

function alias(args) {
  if(!args.length) return listAliases()
  return addAlias(...args)
}

function nick(args) {
  if(!args.length) return listNicks()
  return addNick(...args)
}

function resolve(repo) {
  const aliases = config.aliases || {}
  if(repo === 'default' && !aliases.default) {
    raise('No default repo set')
  }
  if(repo === 'default') repo = aliases.default
  if(/\//.test(repo)) return repo

  if(!aliases[repo]) {
    raise(`No repo found for alias:  ${repo}`)
  }

  return aliases[repo]
}

function resolveArgs([repo, issue]) {
  if(!issue && /^\d+$/.test(repo)) {
    issue = repo
    repo = 'default'
  }

  repo = resolve(repo)
  return [repo, issue]
}

function resolveNick(nick) {
  const nicks = config.nicks || {}
  return nicks[nick] || nick
}

alias.resolve = resolve
alias.resolveArgs = resolveArgs
alias.resolveNick = resolveNick
alias.nick = nick

module.exports = alias
