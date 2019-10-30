const issues = require('./issues')
const alias = require('./alias')
const newIssue = require('./new')
const help = require('./help')

module.exports = {
  issues: issues,
  alias: alias,
  new: newIssue,
  help: help,
}
