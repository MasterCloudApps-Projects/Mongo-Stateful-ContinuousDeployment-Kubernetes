
const express = require('express')
require('dotenv').config()
const database = require('./database')

const app = express()
app.use(express.json())
app.use(express.raw())


const port = 8080

let streamed = 0
let stored = 0

app.post('/', async (req,res) => {
  streamed++
  await database.insertOne(req.body)
  stored++
  res.send()
})

metrics = () => {
  setInterval(function() {
    console.log('Request per second:' + streamed + ' ## '+ 'Request stored per second:' + stored)
    stored = 0
    streamed = 0
  }, 1000)
}

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/dummy?replicaSet=rs0'

startup = async () => {
  try{
    await database.connect(MONGODB_URL)

    app.listen(port, () => {
      console.log(`Listening on port ${port}`)
      metrics()
    })
  }catch(e) {
    console.error(e)
    throw Error('Exiting')
  }
}

startup()