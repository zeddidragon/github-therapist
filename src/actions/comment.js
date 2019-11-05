const { dim, cyan, red, green } = require('kleur')
const prompts = require('prompts')
const raise = require('../error')
const { comment: formatComment } = require('../format')
const { get, post, destroy, getIssue } = require('../http')
const { resolve, resolveArgs } = require('./alias')
const { editComment } = require('./editor')
const { flags } = require('../config')

async function maybeClose(repo, issue) {
  if(flags.close || flags.open) {
    const state = flags.close ? 'closed' : 'open'
    const url = `/repos/${repo}/issues/${issue}`
    await post(url, { state }, { method: 'PATCH' })
    console.log(`Issue ${flags.close ? red('closed') : green('opened')}`)
  }
}

async function newComment(args) {
  const comment = { body: args[2] || flags.body || '' }
  const [repo, issue] = resolveArgs(args)

  if(flags.editor || !comment.body) {
    const [main, comments] = await getIssue(repo, issue)
    Object.assign(comment, await editComment(comment, main, comments))
  }

  if(!comment.body) {
    raise('Body not provided!')
  }

  console.log(`${dim('In repo:')} ${cyan(repo)}\n${formatComment(comment)}`)

  const url = `/repos/${repo}/issues/${issue}/comments`
  const response = await post(url, comment)
  await maybeClose(repo, issue)
  console.log(formatComment(response))
}

function getComment(comments, repo, issue) {
  const comment = flags.id
    ? comments.find(c => c.id === +flags.id)
    : comments.filter(c => c.author_association = 'OWNER').pop()

  if(!comment && flags.id) {
    raise(`No comment found in ${repo} #${issue} with id ${flags.id}`)
  } else if(!comment) {
    raise(`No comment by you found in  ${repo} #${issue}`)
  }

  return comment
}

async function patchComment(args) {
  const [repo, issue] = resolveArgs(args)
  const [main, comments] = await getIssue(repo, issue)
  const comment = getComment(comments)

  const changes = {
    body: args[2] || flags.body,
  }

  if(flags.editor || !changes.body) {
    changes.body = comment.body
    Object.assign(changes, await editComment(changes, main, comments))
  }

  const url = `/repos/${repo}/issues/comments/${comment.id}`
  const response = await post(url, changes, { method: 'patch'})
  await maybeClose(repo, issue)
  console.log(formatComment(response))
}

async function close(args) {
  flags.close = true
  if(args.length > 2 || flags.body) return newComment(args)

  const [repo, issue] = resolveArgs(args)
  return maybeClose(repo, issue)
}

async function deleteComment(args) {
  const [repo, issue] = resolveArgs(args)

  var id = args[3] || flags.id
  if(!id) {
    const url = `/repos/${repo}/issues/${issue}/comments`
    const comments = await get(url)
    id = getComment(comments).id
  }

  const url = `/repos/${repo}/issues/comments/${id}`
  await destroy(url, {}, { method: 'DELETE' })
  console.log(`Issue ${cyan(id)} deleted`)
}

newComment.editComment = patchComment
newComment.close = close
newComment.deleteComment = deleteComment

module.exports = newComment
