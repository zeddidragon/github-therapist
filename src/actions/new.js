const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { dim, white, cyan } = require('kleur')
const prompts = require('prompts')
const raise = require('../error')
const { issue: formatIssue } = require('../format')
const { post } = require('../http')
const { resolve } = require('./alias')
const { newIssue: help } = require('./help')
const { flags } = require('../config')

async function newIssue(args) {
  if(flags.editor) {
    if(args.length < 1 || args.length > 2) {
      console.error('Wrong amount of arguments, should be 1 or 2: ', args)
      return help(1)
    }
    const body = await new Promise(resolve => {
      const editor = process.env.EDITOR || 'vi';

      const filePath = '/tmp/github-therapist.md'

      const title = args[args.length - 1]
      fs.writeFileSync(filePath, `[//] # (Comment body for issue: "${title}")\n\n`)
      const child = spawn(editor, [filePath], {
          stdio: 'inherit'
      });

      child.on('exit', async () => {
        const body = fs.readFileSync(filePath, 'utf8')
          .split('\n')
          .filter(line => !/^\[\/\/\] #/.test(line))
          .join('\n')
          .trim()
        resolve(body)
      });
    })
    if(!body) raise('No message provided, aborting...')
    args.push(body)
  }

  if(args.length < 2 || args.length > 3) {
    console.error('Wrong amount of  arguments, should be 2 or 3: ', args)
    return help(1)
  }
  const [repo, title, body] = args.length === 3
    ? [resolve(args[0]), args[1], args[2]]
    : [resolve('default'), ...args]

  console.log(`${dim('In repo:')} ${cyan(repo)}
${white(title)}
${white(title.replace(/./g, '='))}
${(body.length < 78 ? body : body.slice(0, 75) + '...').split('\n').join(' ')}
  `)
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

  const response = await post(path.join('repos', repo, 'issues'), {
    title,
    body,
    assignees: flags.assign || [],
    labels: flags.label || [],
  })
  
  console.log(formatIssue(response))
}

module.exports = newIssue
