const raise = require('./error')
const { flags } = require('./config')

const flagMap = {
  e: 'editor',
  t: 'title',
  b: 'body',
  a: 'assign',
  A: 'unassign',
  l: 'label',
  L: 'unlabel',
  m: 'milestone',
  C: 'close',
  O: 'open',
  i: 'id',
}

const flagTypes = {
  assign: Array,
  unassign: Array,
  label: Array,
  unlabel: Array,
  body: String,
  milestone: Number,
}

const validFlags = Object.values(flagMap)

function processArgs(args = process.argv.slice(2)) {
  const plain = []
  var flag = null
  for(var i = 0; i < args.length; i++) {
    const arg = args[i]

    if(/^--\w+/.test(arg)) {
      flag = arg.slice(2)
    } else if(/^-\w+$/.test(arg)) {
      const singleFlags = arg.slice(1).split('').map(f => {
        return flagMap[f] || f
      })
      for(const f of singleFlags.slice(0, -1)) {
        if(!validFlags.includes(f)) {
          raise(`Unknown flag: ${f}`)
        }
        flags[f] = true
      }
      flag = singleFlags.pop()
    } else {
      flag = null
    }

    if(!flag) {
      plain.push(arg)
      continue
    }

    if(!validFlags.includes(flag)) {
      raise(`Unknown flag: ${arg}`)
    }

    const type = flagTypes[flag]

    if(flag === 'open') delete flags.close
    if(flag === 'close') delete flags.open
    if(!type) {
      flags[flag] = true
      continue
    }

    const value = args[++i]
    if(!value) {
      raise(`No argument provided for flag:  ${flag}`)
    }
  
    if(type === Array && flags[flag]) {
      flags[flag].push(value)
    } else if(type === Array) {
      flags[flag] = [value]
    } else {
      flags[flag] = type(value)
    }
  }

  return plain
}

module.exports = processArgs
