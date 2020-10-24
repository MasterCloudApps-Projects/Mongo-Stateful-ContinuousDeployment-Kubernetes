const MongoClient = require('mongodb').MongoClient

const connectionOptions = {
  reconnectInterval: 3000,
  reconnectTries: 10
}

let _db;

async function tryConnect(url, attempts) {
  try {
    console.log('info', 'Connecting to: ' + url)
    client =  await MongoClient.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    _db = client.db()
    console.log('info', 'Connected to MongoDB')
  } catch (error) {
    if(attempts) {
      console.log(error)
      console.log('warn', `Failed to connect to MongoDB (${attempts} remaining attempts)`)
      await new Promise(resolve => setTimeout(tryConnect,connectionOptions.reconnectInterval, url, --connectionOptions.reconnectTries))
    }else {
      console.log('error', 'Failed to connect to MongoDB', { error})
      throw Error('Failed to connect to MongoDB')
    }
  }
}

exports.isConnected = () => {
  return _db ? true : false
}

exports.connect = (url) => {
  return tryConnect(url, connectionOptions.reconnectTries)
}

exports.replSetGetStatus = async () => {
   return await _db.admin().replSetGetStatus()
}


