function onOpenRequest (handleEvent, input) {
  const data = {
    protocol: 'XMLHttpRequest',
    method: input[0],
    url: input[1]
  }
  handleEvent(data)
}

function overrideXMLHttpRequest (handleEvent) {
  const proxied = window.XMLHttpRequest.prototype.open

  window.XMLHttpRequest.prototype.open = function () {
    onOpenRequest(handleEvent, arguments)
    return proxied.apply(this, arguments)
  }
}

module.exports = overrideXMLHttpRequest
