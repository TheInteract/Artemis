async function handleLoadEvent(e) {
    console.log(e)
    const result = await this.post('/event/load', { test: '1' })
    console.log(result)
}

module.exports = handleLoadEvent
