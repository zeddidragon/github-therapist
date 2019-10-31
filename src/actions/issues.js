const { issue: formatIssue, issueRow, comment } = require('../format')
const { get, getIssue } = require('../http')
const { resolveArgs } = require('./alias')

async function list(repo) {
  const url = repo ? `/repos/${repo}/issues` : '/issues'
  const response = await get(url)
  console.log(response.map(issueRow).join('\n\n'))
  if(!response.length) {
    console.log(`No issues found!`)
  }
}

async function show(repo, issue) {
  console.log(`Fetching ${repo} #${issue}`)
  const [response, comments] = await getIssue(repo, issue)
  const output = [
    formatIssue(response),
    ...comments.map(comment)
  ].join('\n\n')
  console.log(output)
}

function issues(args) {
  if(!args.length) return list()

  const [repo, issue] = resolveArgs(args)
  if(issue) return show(repo, issue)
  return list(repo)
}

issues.getIssue = getIssue
module.exports = issues
