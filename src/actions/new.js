const path = require('path')
const { dim, cyan } = require('kleur')
const prompts = require('prompts')
const raise = require('../error')
const { issue: formatIssue } = require('../format')
const { post } = require('../http')
const { resolve } = require('./alias')
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

module.exports = newIssue
