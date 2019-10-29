const fs = require('fs')
const os = require('os')
const path = require('path')
const configPath = path.resolve(os.homedir(), '.github-therapist.json')

const config = {}
const package = {}

function readConfig() {
  try {
    const content = fs.readFileSync(configPath, 'utf8')
    Object.assign(config, JSON.parse(content))
  } catch {}
  const json = require('../package.json')
  Object.assign(package, json, {
    bin: Object.keys(json.bin)[0],
  })
}

async function addConfig(cfg) {
  Object.assign(config, cfg)
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  return configPath
}

module.exports = {
  readConfig,
  addConfig,
  config,
  package,
}