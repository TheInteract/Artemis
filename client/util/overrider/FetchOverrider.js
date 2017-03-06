function onFetchStart (handleEvent, input) {
  const data = {
    protocol: 'Fetch',
    method: input[1].method,
    url: input[1].url
  }
  handleEvent(data)
}

function overrideFetch (handleEvent) {
  if (window.fetch) {
    const originalFetch = window.fetch
    window.fetch = function () {
      if (originalFetch.toString().includes('native code')) {
        onFetchStart(handleEvent, arguments)
      }
      return originalFetch.apply(this, arguments)
    }
  }
}

module.exports = overrideFetch
