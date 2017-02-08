const PROPERTIES = require('./properties')
const pickProperties = require('../../util/pickProperties')

function handleLoadEvent (e) {
  const data = pickProperties(e, PROPERTIES)
  data.uid = this.uid
  this.fetch.post('/event/load', data)
    .then(response => {
      const enabledFeatures = [
        '[interact-feature="card-1"]:not([interact-feature-type="b"])',
        '[interact-feature="card-2"]:not([interact-feature-type="a"])'
      ]

      const selectors = enabledFeatures.join(', ')
      const elements = document.querySelectorAll(selectors)
      elements.forEach(element => { element.remove() })
    })
}

module.exports = handleLoadEvent
