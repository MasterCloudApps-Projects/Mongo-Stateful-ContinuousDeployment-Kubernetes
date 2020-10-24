
require('dotenv').config()
const server = require('./server')


process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1)
})



startup = async () => {
  try{

    server.start()
  }catch(e) {
    console.error(e)
    throw Error('Exiting')
  }
}

startup()