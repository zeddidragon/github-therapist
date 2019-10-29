const kleur = require('kleur')

const colors = [
  'cyan',
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'gray',
]

const bgs = [
  'bgCyan',
  'bgBlue',
  'bgGreen',
  'bgRed',
  'bgYellow',
  'bgMagenta',
]

function label(label) {
  const method = bgs[Math.floor(parseInt(label.color, 16) / (0xffff * 16 * 2.5))]
    || 'bgWhite'
  return kleur[method]().black(` ${label.name} `)
}

function user(user) {
  const color = colors[user.id % colors.length]
  return kleur[color](user.login)
}

module.exports = {
  label,
  user,
}
