const kleur = require('kleur')

const bgs = [
  'bgCyan',
  'bgBlue',
  'bgGreen',
  'bgRed',
  'bgYellow',
  'bgMagenta',
]

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
  'magenta',
  'gray',
  'cyan',
]

function formatLabel(label) {
  const method = bgs[Math.floor(parseInt(label.color, 16) / (0xffff * 16 * 2.5))]
    || 'bgWhite'
  return kleur.black()[method](` ${label.name} `)
}

function formatUser(user) {
  const color = colors[user.id % colors.length]
  return kleur[color](user.login)
}

function formatRow(row) {
  return `
${kleur.cyan(row.url)}
  ${row.title} ${row.labels.map(formatLabel).join(' ')}
  ${kleur.dim('By:')} ${formatUser(row.user)}   ${kleur.dim(`To:`)} ${row.assignees.map(formatUser).join(', ')}
  ${kleur.dim(new Date(row.created_at))}

    `.trim()
}

async function list() {
  const response = JSON.parse(require('fs').readFileSync('response.json', 'utf8'))

  console.log(response.map(formatRow).join('\n\n'))
}

module.exports = list
