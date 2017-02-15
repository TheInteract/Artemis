const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleLoadEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.customerCode = this.customerCode
  this.fetch.post('/event/onload', data)
    .then(response => {
      const enabledFeatures = response.enabledFeatures.map(feature => {
        return `[interact-feature="${feature.name}"]:not([interact-feature-type="${feature.type}"])`
      })

      const selectors = enabledFeatures.join(', ')
      const elements = document.querySelectorAll(selectors)
      elements.forEach(element => { element.remove() })
    })
}

module.exports = handleLoadEvent
