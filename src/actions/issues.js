const path = require('path')
const { cyan, dim } = require('kleur')
const { label, user, time, issueRow, body, comment } = require('../format')
const { get } = require('../http')
const { resolve } = require('./alias')

async function list(repo) {
  const url = repo ? path.join('repos', repo, 'issues') : '/issues'
  const response = await get(url)
  console.log(response.map(issueRow).join('\n\n'))
  if(!response.length) {
    console.log(`No issues found!`)
  }
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
  } = response
  const labels = response.labels.map(label).join(' ')
  const output = [
    cyan(url),
    labels,
    updated && created !== updated
      ? dim(`Created: ${created}    Updated: ${updated}`)
      : dim(time(created)),
    body(response.body),
  ].filter(v => v).join('\n') + comments
    .map(comment)
    .join('\n\n')
  console.log(output)
}

function resolveArgs([repo, issue]) {
  if(!issue && /^\d+$/.test(repo)) {
    issue = repo
    repo = 'default'
  }

  repo = resolve(repo)
  return [repo, issue]
}

function issues(args) {
  if(!args.length) return list()

  const [repo, issue] = resolveArgs(args)
  if(issue) return show(repo, issue)
  return list(repo)
}

module.exports = issues
