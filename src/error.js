function raise(...args) {
  console.error(...args)
  process.exit(1)
}

module.exports = raise
