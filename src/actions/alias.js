const { config, package, addConfig } = require('../config')
const { aliases: help } = require('../help')
const { yellow } = require('kleur')

function list(highlight) {
  const aliases = Object.entries(config.aliases || {})
  if(!aliases.length) {
    console.log('You have no aliases')
    return help()
  }

  const max = aliases.map(([k]) => k.length).reduce((a, b) => Math.max(a, b))
  console.log(aliases.map(([k, v]) => {
    const str = `${k.padStart(max)} => ${v}`
    return highlight === k ? yellow(str) : str
  }).join('\n'))
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
function add(symbol, repo) {
  if(reserved.includes(symbol)) {
    console.error(`Cannot alias reserved token: ${symbol}
The following tokens are reserved: \n  ${reserved.join(', ')}`)
    process.exit()
  }

  const aliases = config.aliases || {}
  if(symbol === 'clear-default') {
    delete aliases.default
    addConfig({ aliases })
  }

  if(!repo) {
    console.error('No repo specified')
    return help()
  }

  aliases[symbol] = repo

  addConfig({ aliases })
  return list(symbol)
}

function alias(args) {
  if(!args.length) return list()
  return add(...args)
}

module.exports = alias
