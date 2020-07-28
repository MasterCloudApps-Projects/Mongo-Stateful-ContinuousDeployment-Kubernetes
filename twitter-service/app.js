
const Twit = require('twit')
require('dotenv').config()
const database = require('./database')


consumeTwitter = async () => {
  const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  })

  let resp = await T.get('trends/place', { id: 1})

  let trends = resp.data[0].trends

  let trend = trends[0].name
  console.log('info', 'listening twitter trend: ' + trend)
  var stream = T.stream('statuses/filter', { track: trend })

  let streamed = 0
  let stored = 0
  stream.on('tweet', async function (tweet) {
      streamed++
      await database.insertOne(tweet)
      stored++
  })

  setInterval(function() {
    console.log('Tweets per second:' + streamed + ' ## '+ 'Tweets stored per second:' + stored)
    console.log()
    stored = 0
    streamed = 0
  }, 1000)
}

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/twitter?replicaSet=rs0'

startup = async () => {
  try{
    await database.connect(MONGODB_URL)
    consumeTwitter()
  }catch(e) {
    console.error(e)
    throw Error('Exiting')
  }
}

startup()