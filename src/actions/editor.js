const fs = require('fs')
const { spawn } = require('child_process')
const raise = require('../error')

function stripComments(line) {
  return !/^\[\/\/\] #/.test(line)
}

async function editIssue(issue) {
  const propsHeader = '[//] # (PROPERTIES)'
  const text = `# ${issue.title || 'Title'}
${issue.body || ''}
[//] # (Enter your issue message. Lines beginning with \`[//] #\` will be stripped)
[//] # (The first line is the issue's title)\
${issue.user ? `\n[//] # Created by @${issue.user}\n` : ''}\
${propsHeader}
state = ${issue.state || 'open'}
milestone = ${issue.milestone || ''}
labels = ${(issue.labels || []).join(', ')}
assignees = ${(issue.assignees || []).join(', ')}`

  const written = await new Promise(resolve => {
    const editor = process.env.EDITOR || 'vi';
    const filePath = '/tmp/github-therapist.md'

    fs.writeFileSync(filePath, text)
    const child = spawn(editor, [filePath], { stdio: 'inherit' })
    child.on('exit', () => {
      resolve(fs.readFileSync(filePath, 'utf8'))
    })
  })

  const lines = written.split('\n').map(line => line.trim())
  const propsIndex = lines.indexOf(propsHeader)
  if(!propsIndex) {
    raise(`Unable to find property header:\n${propsHeader}`)
  }
  const title = lines[0].replace(/^#/, '').trim()
  const body = lines.slice(1, propsIndex)
    .filter(stripComments)
    .join('\n')
    .trim()

  const props = lines.slice(propsIndex)
    .filter(stripComments)
    .filter(line => /.*=.*/.test(line))
    .map(line => line.split('=').map(str => str.trim()))
    .reduce((acc, [k, v]) => Object.assign(acc, { [k]: v }), [])
  const milestone = props.milestone || null
  const labels = (props.labels || '')
    .split(',')
    .map(str => str.trim())
    .filter(str => str)
  const assignees = (props.assignees || '')
    .split(',')
    .map(str => str.trim())
    .filter(str => str)
  const state = props.state === 'closed' ? 'closed' : 'open'

  return {
    title,
    body,
    milestone,
    labels,
    assignees,
    state,
  }
}

module.exports = {
  editIssue
}
