const express = require('express')
const server = express()
const metrics = require('./prom-metrics')

// Setup server to Prometheus scrapes:

server.get('/metrics', async (req, res) => {
	try {
    res.set('Content-Type', metrics.getContentType())
		res.end(await metrics.getMetrics())
	} catch (ex) {
    console.error(ex)
		res.status(500)
	}
})

exports.start = () => {
  const port = process.env.PORT || 3000
  console.log(
    `Server listening to ${port}, metrics exposed on /metrics endpoint`,
  )
  server.listen(port)
}