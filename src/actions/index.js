const issues = require('./issues')
const alias = require('./alias')
const newIssue = require('./new')
const newComment = require('./comment')
const help = require('./help')

module.exports = {
  issues: issues,
  alias: alias,
  nick: alias.nick,
  new: newIssue,
  edit: newIssue.editIssue,
  help: help,
  comment: newComment,
  amend: newComment.editComment,
  close: newComment.close,
  retract: newComment.deleteComment,
}
