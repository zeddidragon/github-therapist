const { pkg } = require('../config')
const helps = {
  a: aliases,
  aliases: aliases,
  n: newIssue,
  new: newIssue,
  e: editIssue,
  edit: editIssue,
  h: help,
  c: newComment,
  comment: newComment,
  m: editComment,
  amend: editComment,
}

function help(code = 0) {
  const { bin, name, version, description } = pkg
  if(helps[code]) return helps[code]()

  console.log(`
${name} ${version}
${description}

Usage: ${bin} [<flags>] [<command>] [<repo>] [<command arguments>]

Examples:
  # List all open issues assigned to you in all repos
  ${bin}
  # List all open issues in my-project
  ${bin} my-project
  # List all open issues in my-project assigned to you
  ${bin} -a my-project
  # Show one issue
  ${bin} my-project/1313
  # Close issue with comment
  ${bin} 1313 -C "k done"
  # Comment on issue
  ${bin} 1313 -c "Let's talk about this tomorrow"
  # Re-open issue with comment
  ${bin} 1313 -O "I made a mistake"

Flags:
  -b, --body    include issue body in the list
  -e, --editor  opens your editor to write the body of the issue/comment
  -a, --assign  assign a user when creating issue
  -l, --label   add label when creating issue

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
  -e, --editor          opens your editor to write the body of the issue/comment
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
  -e, --editor          opens your editor to write the body of the issue/comment
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
  $ ${bin} comment bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue/comment
  -b, --body <body>     set body of issue
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it`)
  process.exit(code)
}

function editComment(code = 0) {
  const { bin } = pkg
  console.log(`
Usage: ${bin} [a]m[end] [<repo>] <issue> [<body>]
  If you don't specify any body, your editor opens.

Example:
  $ ${bin} comment bucks 1313 "Cannot reproduce"
  $ ${bin} comment bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue/comment
  -b, --body <body>     set body of issue
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it`)
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
})

module.exports = help
