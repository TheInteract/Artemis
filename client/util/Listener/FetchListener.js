function onFetchStart (handleAPICallEvent, input) {
  handleAPICallEvent('Fetch', input[1].method, input[1].url)
}

function overrideFetch (handleAPICall) {
  if (window.fetch) {
    const originalFetch = window.fetch
    window.fetch = function () {
      if (originalFetch.toString().includes('native code')) {
        onFetchStart(handleAPICall, arguments)
      }
      return originalFetch.apply(this, arguments)
    }
  }
}

module.exports = overrideFetch
