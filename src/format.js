const kleur = require('kleur')
const { flags } = require('./config')
const { cyan, dim, white } = kleur

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

function issueRow(row) {
  const labels = row.labels.map(label).join(' ')
  return `${cyan(row.html_url || row.url)} ${labels && '\n  ' + labels}
  ${dim('By:')} ${user(row.user)}\
  ${dim(`To:`)} ${row.assignees.map(user).join(', ')}\
  ${dim('At: ' + time(row.created_at))}
  ${row.title}${flags.body ? '\n' + body(row.body) : ''}`
}

function body(body) {
  return (
    body
      .replace(/(@.*) (commented on )\[(.*)\]\(https.*\)/gm, (m, ...groups) => {
        return `${dim('By:')} ${groups[0]}`
      })
      .replace(/@\w+/gm, match => user({ login: match.slice(1) }))
      .replace(/\*\*.+\*\*/gm, match => white().bold(match))
  )
}

function issue(response) {
  const {
    created_at: created,
    updated_at: updated,
    html_url: url,
  } = response
  const labels = response.labels.map(label).join(' ')
  return [
    cyan(url),
    labels,
    updated && created !== updated
      ? dim(`Created: ${created}    Updated: ${updated}`)
      : dim(time(created)),
    body(response.body),
  ].filter(v => v).join('\n')
}

function comment(comment) {
  const created = comment.created_at
  return [
    `${dim('#' + comment.id)} ${user(comment.user)}\
    ${dim(time(created))}`,
    body(comment.body),
  ].map(row => '    ' + row).join('\n')
}

module.exports = {
  label,
  user,
  time,
  issueRow,
  issue,
  body,
  comment,
}
