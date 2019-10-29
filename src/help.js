const { package } = require('./config')

function help() {
  const { bin, name, version, description } = package
  console.log(`
${name} ${version}
${description}

Usage: ${bin} [n|c|C|O]

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
`)
  process.exit(0)
}

function aliases() {
  const { bin } = package
  console.log(`
    Usage: ${bin} alias [<alias> <full repo>]
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
      $ ${bin} alias default bucks
      $ ${bin} 1500
        > https://github.com/microbucks/corporate-project/issues/1500
        > ...
      $ ${bin} alias clear-default
      $ ${bin} 1500
        > https://github.com/current/repo/issues/1500
        > ...
        

  `)
  process.exit(0)
}

module.exports = {
  help,
  aliases,
}
