const { cyan, dim } = require('kleur')
const { label, user } = require('../format')
const { get } = require('../http')

function formatRow(row) {
  const labels = row.labels.map(label).join(' ')
  return `${cyan(row.url)} ${labels && '\n  ' + labels}
  ${row.title}
  ${dim('By:')} ${user(row.user)}   ${dim(`To:`)} ${row.assignees.map(user).join(', ')}
  ${dim(new Date(row.created_at))}`
}

async function list() {
  const response = await get(`/issues`)
  console.log(response.map(formatRow).join('\n\n'))
}

module.exports = list
