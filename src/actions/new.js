const path = require('path')
const { dim, cyan } = require('kleur')
const prompts = require('prompts')
const raise = require('../error')
const { issue: formatIssue } = require('../format')
const { get, post } = require('../http')
const { resolve, resolveArgs } = require('./alias')
const { editIssue } = require('./editor')
const { flags } = require('../config')

async function newIssue(args) {
  const issue = {
    title: args[1] || flags.title,
    body: args[2] || flags.message || '',
    assignees: flags.assign || [],
    labels: flags.label || [],
  }
  if(flags.editor || !issue.title) {
    Object.assign(issue, await editIssue(issue))
    console.log(issue)
    delete issue.state
    if(!issue.assignees.length) delete issue.assignees
    if(!issue.labels.length) delete issue.labels
    if(!issue.body) delete issue.body
    if(!issue.milestone) delete issue.milestone
  }
  if(!issue.title) {
    raise('Title not provided!')
  }

  const repo = resolve(args[0] || 'default')

  console.log(`${dim('In repo:')} ${cyan(repo)}\n${formatIssue(issue)}`)
  const { ok } = await prompts({
    type: 'confirm',
    name: 'ok',
    message: 'Is this correct?',
    initial: true,
  })
  if(!ok) {
    console.error('Aborted')
    process.exit(0)
  }

  const response = await post(path.join('repos', repo, 'issues'), issue)
  console.log(formatIssue(response))
}

async function patchIssue(args) {
  const [repo, issue] = resolveArgs(args)
  const url = path.join('repos', repo, 'issues', issue)
  const original = await get(url)
  const editable = {
    title: original.title,
    body: original.body,
    user: original.user.login,
    milestone: original.milestone || '',
    assignees: original.labels.map(a => a.login),
    labels: original.labels.map(l => l.name),
    state: original.state,
  }
  var assignedFromCli = false
  for(const flag of ['title', 'body', 'milestone']) {
    const v = flags[flag]
    if(!v) continue
    editable[flag] = v
    assignedFromCli = true
  }
  for(const [flag, prop] of [['assign', 'assignees'], ['label', 'labels']]) {
    const v = flags[flag]
    if(!v) continue
    editable[prop] = Array.from(new Set(editable.prop.concat(v)))
    assignedFromCli = true
  }
  if(flags.close || flags.open) {
    editable.state = flags.close ? 'closed' : 'open'
    assignedFromCli = true
  }
  if(flags.editor || !assignedFromCli) {
    Object.assign(editable, await editIssue(editable))
  }
  if(!editable.milestone) editable.milestone = null

  const response = await post(url, editable, { method: 'PATCH' })
  console.log(formatIssue(response))
}

newIssue.editIssue = patchIssue

module.exports = newIssue
