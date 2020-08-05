const MongoClient = require('mongodb').MongoClient

const connectionOptions = {
  reconnectInterval: 3000,
  reconnectTries: 10
}

let _db;

async function tryConnect(url, attempts) {
  try {
    client =  await MongoClient.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    _db = client.db()
    console.log('info', 'Connected to MongoDB')
  } catch (error) {
    if(attempts) {
      console.log('warn', `Failed to connect to MongoDB (${attempts} remaining attempts)`)
      await new Promise(resolve => setTimeout(tryConnect,connectionOptions.reconnectInterval, url, --connectionOptions.reconnectTries))
    }else {
      console.log('error', 'Failed to connect to MongoDB', { error})
      throw Error('Failed to connect to MongoDB')
    }
  }
}

exports.insertOne = async (document) => {
   await _db.collection("dummy").insertOne(document)
}

exports.connect = (url) => {
   return tryConnect(url, connectionOptions.reconnectTries)
}
