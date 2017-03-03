function onOpenRequest (handleAPICallEvent, input) {
  handleAPICallEvent('XMLHttpRequest', input[0], input[1])
}

function overrideXMLHttpRequest (handleAPICallEvent) {
  const proxied = window.XMLHttpRequest.prototype.open

  window.XMLHttpRequest.prototype.open = function () {
    onOpenRequest(handleAPICallEvent, arguments)
    return proxied.apply(this, arguments)
  }
}

module.exports = overrideXMLHttpRequest
