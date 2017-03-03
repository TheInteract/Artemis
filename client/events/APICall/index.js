function handleAPICallEvent (protocol, method, url) {
  const data = {
    method,
    url
  }
  data.API_KEY = this.API_KEY
  if (data.url.includes(process.env.COLLECTOR_BASE || 'http://localhost:3000/')) {
    console.log('Ignore Artemis API call')
  } else {
    console.log('API CALL!!!', protocol, data.method, data.url, data.API_KEY)
    // this.fetch.post('/event/onAPICall', data)
  }
}

module.exports = handleAPICallEvent
