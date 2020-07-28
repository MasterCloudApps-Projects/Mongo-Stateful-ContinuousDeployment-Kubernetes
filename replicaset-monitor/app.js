
require('dotenv').config()
const database = require('./database')


checkReplicaset = async () => {

  setInterval( async () => {
    let status = await database.replSetGetStatus()

    console.log('###############################')
    status.members.forEach(member => {
    console.log('---')
    console.log('name: '.concat(member.name))
    console.log('stateStr:: '.concat(member.stateStr))
    });

  }, 1000)
}

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017?replicaSet=rs0'

startup = async () => {
  try{
    await database.connect(MONGODB_URL)
    checkReplicaset()
  }catch(e) {
    console.error(e)
    throw Error('Exiting')
  }
}

startup()