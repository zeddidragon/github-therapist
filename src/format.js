const kleur = require('kleur')

const colors = [
  'cyan',
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'white',
]

const bgs = colors

function label(label) {
  const method = bgs[hashCode(label.name.toLowerCase()) % bgs.length]
  return kleur[method](`[${label.name}]`)
}

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i)
  }
  return hash;
}

function user(user) {
  const color = colors[hashCode(user.login.toLowerCase()) % colors.length]
  return kleur[color](`@${user.login}`)
}

function time(stamp) {
  return stamp
}

module.exports = {
  label,
  user,
  time,
}
