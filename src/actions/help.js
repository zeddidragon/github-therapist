const { pkg } = require('../config')
const helps = {
  a: aliases,
  aliases: aliases,
  nick: nicks,
  n: newIssue,
  new: newIssue,
  e: editIssue,
  edit: editIssue,
  h: help,
  c: newComment,
  comment: newComment,
  m: editComment,
  amend: editComment,
  C: close,
  close: close,
  r: deleteComment,
  retract: deleteComment,
}

function help(code = 0) {
  const { bin, name, version, description } = pkg
  if(helps[code]) return helps[code]()

  console.log(`
${name} ${version}
${description}

Usage: ${bin} [<flags>] [<command>] [<repo>] [<command arguments>]

Examples:
  ${bin}
  Lists all open issues assigned to you in all repos
  ${bin} my/project
  Lists all open issues in my/project
  ${bin} my/project 1313
  Shows issue 1313 in my/project an its comments
  ${bin} C 1313 "k done"
  Closes issue in default repo with comment
  ${bin} c 1313 "Let's talk about this tomorrow"
  Comment on issue in default repo
  ${bin} c -O 1313 "I made a mistake"
  Re-opens issue with comment

Commands:
  h, help       This help message
  a, alias      View or create aliases
  n, new        Create a new issue
  c, comment    Comment on an issue
  C, close      Close an issue
  R, reopen     Reopen an issue
 
`)
  process.exit(code ? 1 : 0)
}

function aliases(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} a[lias] [<alias> <full repo>]
Example:
  $ ${bin} alias bucks microbucks/corporate-project
  $ ${bin} alias
    > bucks => microbucks/corporate-project
  $ ${bin} bucks 1500
    > https://github.com/microbucks/corporate-project/issues/1500
    > Move the flim-flam button 2px to the right
    > =======================================================
    > [Urgent], [Back-End]
    > By: @qa  To: @You, @Devops, @TeamLeader
    > ...
  $ ${bin} a default bucks
  $ ${bin} 1500
    > https://github.com/microbucks/corporate-project/issues/1500
    > ...
  $ ${bin} a clear default`)
  process.exit(code)
}

function nicks(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} nick [<nickname> <full name>]
Example:
  $ ${bin} nick me octocat
  $ ${bin} nick
    > me => octocat
  $ ${bin} bucks 1500 -a me
    > https://github.com/microbucks/corporate-project/issues/1500
    > ...
    > By: @octocat  To: @octocat
    > ...
  $ ${bin} nick clear me`)
  process.exit(code)
}

function newIssue(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} n[ew] [<repo>] [<title>] [<body>]
  If you don't specify a title, your editor opens.

Example:
  $ ${bin} new bucks "Refactor the factory bean generator helper" "Needs refactoring"
  $ ${bin} new bucks "Adjust the flamboogle" -e
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue
  -t, --title <title>   set title of issue
  -b, --body <body>     set body of issue
  -a, --assign <user>   assign a user when creating issue
  -l, --label <label>   add label when creating issue
  -m, --milestone <id>  set milestone id`)
  process.exit(code)
}

function editIssue(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} e[dit] [<repo>] <issue> [<title>] [<body>]
  If you don't specify any changes, your editor opens.

Example:
  $ ${bin} edit bucks 1313 "Changed title"
  $ ${bin} edit bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue
  -t, --title <title>   set title of issue
  -b, --body <body>     set body of issue
  -a, --assign <user>   assign a user when creating issue
  -l, --label <label>   add label when creating issue
  -m, --milestone <id>  set milestone id
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it`)
  process.exit(code)
}

function newComment(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} c[comment] [<repo>] <issue> [<body>]
  If you don't specify any body, your editor opens.

Example:
  $ ${bin} comment bucks 1313 "Cannot reproduce"
  $ ${bin} c bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it`)
  process.exit(code)
}

function editComment(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} [a]m[end] [<repo>] <issue> [<body>]
  The latest comment you've written will be selected.
  If you don't specify any body, your editor opens.

Example:
  $ ${bin} comment bucks 1313 "nvm I can reproduce, will fix"
  $ ${bin} c bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it
  -i, --id              edit specific comment rather than latest one`)
  
  process.exit(code)
}

function deleteComment(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} r[etract] [<repo>] <issue> [<id>]
  Delete your latest comment or the specified one.

Example:
  $ ${bin} close bucks 1313 "nvm I can reproduce, will fix"
  $ ${bin} C bucks 1313

Flags:
  -i, --id              retract specific comment rather than latest one`)
  
  process.exit(code)
}

function close(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} close|C [<repo>] <issue> [<body>]
  Close issue, optionally with a comment.

Example:
  $ ${bin} close bucks 1313 "nvm I can reproduce, will fix"
  $ ${bin} C bucks 1313

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it`)
  
  process.exit(code)
}

Object.assign(help, {
  help,
  issues: help,
  aliases,
  newIssue,
  editIssue,
  newComment,
  editComment,
  deleteComment,
  close,
})

module.exports = help
