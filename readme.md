Github Therapist
================

Small program to manage your github issues.

## Installation
`npm i -g github-therapist`
or
```
  git clone git@github.com:zeddidragon/github-therapist.git
  cd github-therapist
  npm link
```

## General

```
Usage: gth [<flags>] [<command>] [<repo>] [<command arguments>]

Examples:
  gth
  Lists all open issues assigned to you in all repos
  gth my/project
  Lists all open issues in my/project
  gth my/project 1313
  Shows issue 1313 in my/project an its comments
  gth C 1313 "k done"
  Closes issue in default repo with comment
  gth c 1313 "Let's talk about this tomorrow"
  Comment on issue in default repo
  gth c -O 1313 "I made a mistake"
  Re-opens issue with comment

Commands:
  h, help       This help message
  a, alias      View or create aliases
  n, new        Create a new issue
  c, comment    Comment on an issue
  C, close      Close an issue
  R, reopen     Reopen an issue
```

## Aliases
Before regular use, you should set up aliases for your relevant repos.
```
Usage: gth a[lias] [<alias> <full repo>|clear <alias>]
Example:
  $ gth alias bucks microbucks/corporate-project
  $ gth alias
    > bucks => microbucks/corporate-project
  $ gth bucks 1500
    > https://github.com/microbucks/corporate-project/issues/1500
    > Move the flim-flam button 2px to the right
    > =======================================================
    > [Urgent], [Back-End]
    > By: @qa  To: @You, @Devops, @TeamLeader
    > ...
  $ gth a default bucks
  $ gth 1500
    > https://github.com/microbucks/corporate-project/issues/1500
    > ...
  $ gth a clear default
```

## New issue
```
Usage: gth n[ew] [<repo>] [<title>] [<body>]
  If you don't specify a title, your editor opens.

Example:
  $ gth new bucks "Refactor the factory bean generator helper" "Needs refactoring"
  $ gth new bucks "Adjust the flamboogle" -e
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue
  -t, --title <title>   set title of issue
  -b, --body <body>     set body of issue
  -a, --assign <user>   assign a user when creating issue
  -l, --label <label>   add label when creating issue
  -m, --milestone <id>  set milestone id
```
All properties can be assigned from within the editor.

## Edit issue
```
Usage: gth e[dit] [<repo>] <issue> [<title>] [<body>]
  If you don't specify any changes, your editor opens.

Example:
  $ gth edit bucks 1313 "Changed title"
  $ gth edit bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the issue
  -t, --title <title>   set title of issue
  -b, --body <body>     set body of issue
  -a, --assign <user>   assign a user when creating issue
  -l, --label <label>   add label when creating issue
  -m, --milestone <id>  set milestone id
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it
```

## Comment
```
Usage: gth c[comment] [<repo>] <issue> [<body>]
  If you don't specify any body, your editor opens.

Example:
  $ gth comment bucks 1313 "Cannot reproduce"
  $ gth c bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it
```

## Edit Comment
```


Usage: gth [a]m[end] [<repo>] <issue> [<body>]
  The latest comment you've written will be selected.
  If you don't specify any body, your editor opens.

Example:
  $ gth comment bucks 1313 "nvm I can reproduce, will fix"
  $ gth c bucks 1313
  Opens up an editor to fill in the body

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it
  -O, --open            reopen issue, -C will override it
  -i, --id              edit specific comment rather than latest one
```

## Delete Comment
```


Usage: gth r[etract] [<repo>] <issue> [<id>]
  Delete your latest comment or the specified one.

Example:
  $ gth close bucks 1313 "nvm I can reproduce, will fix"
  $ gth C bucks 1313

Flags:
  -i, --id              retract specific comment rather than latest one
```

## Close Issue
```
Usage: gth close|C [<repo>] <issue> [<body>]
  Close issue, optionally with a comment.

Example:
  $ gth close bucks 1313 "nvm I can reproduce, will fix"
  $ gth C bucks 1313

Flags:
  -e, --editor          opens your editor to write the body of the comment
  -b, --body <body>     set body of comment
  -C, --close           close issue, -O will override it
```

## Token
The token is stored in `~/.github-therapist`

If you haven't made one, Therapist will walk you through making one.

You might have issues if a token has already been made with the used fingerprint. In that case you will have to manage your tokens:
https://github.com/settings/tokens

## Contributing
Features will be added whenever the lack of them annoys me or you make a good pull request.

If you don't know how to make pull requests, check the Contributing section of every other repo on the Internet.
