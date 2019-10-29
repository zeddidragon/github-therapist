const path = require('path')
const { cyan, dim, white } = require('kleur')
const { label, user, time } = require('../format')
const { get } = require('../http')
const { config } = require('../config')

function formatRow(row) {
  const labels = row.labels.map(label).join(' ')
  return `${cyan(row.html_url || row.url)} ${labels && '\n  ' + labels}
  ${dim('By:')} ${user(row.user)}\
  ${dim(`To:`)} ${row.assignees.map(user).join(', ')}\
  ${dim('At: ' + time(row.created_at))}
  ${row.title}`
}

async function list(repo) {
  const url = repo ? path.join('repos', repo, 'issues') : '/issues'
  const response = await get(url)
  console.log(response.map(formatRow).join('\n\n'))
  if(!response.length) {
    console.log(`No issues found!`)
  }
}

function formatBody(body) {
  return (
    body
      .replace(/(@.*) (commented on )\[(.*)\]\(https.*\)/gm, (m, ...groups) => {
        return `${dim('By:')} ${groups[0]}`
      })
      .replace(/@\w+/gm, match => user({ login: match.slice(1) }))
      .replace(/\*\*.+\*\*/gm, match => white().bold(match))
  )
}

function formatComment(comment) {
  const created = comment.created_at
  return [
    `${dim('#' + comment.id)} ${user(comment.user)}\
    ${dim(time(created))}`,
    formatBody(comment.body),
  ].map(row => '    ' + row).join('\n')
}

async function show(repo, issue) {
  console.log(`Fetching ${repo} #${issue}`)
  const [response, comments] = await Promise.all([
    get(path.join('repos', repo, 'issues', issue)),
    get(path.join('repos', repo, 'issues', issue, 'comments')),
  ])

  const {
    created_at: created,
    updated_at: updated,
    html_url: url,
    body,
  } = response
  const labels = response.labels.map(label).join(' ')
  const output = [
    cyan(url),
    labels,
    updated && created !== updated
      ? dim(`Created: ${created}    Updated: ${updated}`)
      : dim(time(created)),
    formatBody(response.body),
  ].filter(v => v).join('\n') + comments
    .map(formatComment)
    .join('\n\n')
  console.log(output)
}

function resolveArgs([repo, issue]) {
  const { aliases } = config
  if(!issue && /^\d+$/.test(repo)) {
    issue = repo
    repo = aliases.default
  }

  if(aliases[repo]) repo = aliases[repo]

  if(!repo) {
    console.error('Unable to resolve: ', { repo, issue })
    process.exit()
  }
  return [repo, issue]
}

function issues(args) {
  if(!args.length) return list()

  const [repo, issue] = resolveArgs(args)
  if(issue) return show(repo, issue)
  return list(repo)
}

module.exports = issues
