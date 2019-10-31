function resolveArgs([repo, issue]) {
  if(!issue && /^\d+$/.test(repo)) {
    issue = repo
    repo = 'default'
  }

  repo = resolve(repo)
  return [repo, issue]
}

return resolveIssue
