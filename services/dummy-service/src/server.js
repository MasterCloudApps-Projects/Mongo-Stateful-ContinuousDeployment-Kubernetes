const express = require('express')
const metrics = require('./prom-metrics')
const database = require('./database')
const server = express()
server.use(express.json())
server.use(express.raw())

server.post('/', async (req,res, next) => {
  metrics.concurrentRequests.inc()
  metrics.incomingRequest.inc()
  const sTimerEnd = metrics.requestDurationSecondsSummary.startTimer()
 // console.log('Request per second:' + streamed + ' ## '+ 'Request stored per second:' + stored)
  try {
    await database.insertOne(req.body)
    metrics.requestsStored.inc()
  } catch (error) {
    console.error(error)
    metrics.requestsErrorStored.inc()
    metrics.concurrentRequests.dec()
    next(error)
  }
  res.send()
  sTimerEnd()
  metrics.concurrentRequests.dec()
})

server.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.getContentType())
  res.end(await metrics.getMetrics())
})


server.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

const port = process.env.LISTEN_PORT || 8080

exports.start = () => {
  try{
    server.listen(port, () => {
      console.log(`Listening on port ${port}`)
    })
  }catch(e) {
    console.error(e)
    throw Error('Exiting')
  }
}