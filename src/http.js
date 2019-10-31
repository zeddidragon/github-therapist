const fetch = require('node-fetch')
const apiUrl = 'https://api.github.com'

const apiHeaders = {
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
}

async function get(path, query={}, opts={}) {
  var qs = Object.entries(query)
    .map(entry => entry.join('='))
    .join('&')
  if(qs) qs = `?${qs}`
  const url = new URL(path + qs, apiUrl)
  const response = await fetch(url, {
    ...opts,
    headers: {
      ...apiHeaders,
      ...(opts.headers || {}),
    }
  })
  if(!response.ok) {
    console.error('Problem trying to fetch:')
    console.error(url.href)
    console.error(await response.json().then(data => data.message))
    process.exit(1)
  }

  return response.json()
}

async function post(path, body={}, opts={}) {
  const url = new URL(path, apiUrl)
  const response = await fetch(url, {
    body: JSON.stringify({ ...body }),
    method: 'POST',
    ...opts,
    headers: {
      ...apiHeaders,
      ...(opts.headers || {}),
    }
  })

  if(!response.ok) {
    console.error('Problem trying to fetch:')
    console.error(url.href, { body })
    console.error(await response.json().then(data => data.message))
    process.exit(1)
  }

  return response.json()
}

module.exports = {
  get,
  post,
  apiHeaders,
}
