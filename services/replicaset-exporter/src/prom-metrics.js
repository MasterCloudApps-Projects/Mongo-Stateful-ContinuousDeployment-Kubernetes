const client = require('prom-client')
const database = require('./database')

const _healthGauge = new client.Gauge({
  name: 'mongodb_replset_member_health',
  help: 'MongoDB replicaSet Member Health',
  labelNames: ['name'],
})
const _stateGauge = new client.Gauge({
  name: 'mongodb_replset_member_state',
  help: 'MongoDB replicaSet Member state',
  labelNames: ['name'],
})

const _downtimeGauge = new client.Gauge({
  name: 'mongodb_replset_member_downtime_total',
  help: 'MongoDB replicaSet Member total down time',
  labelNames: ['name'],
})

const _membersDowntime = []

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017?replicaSet=rs0'

checkReplicaset = async () => {
  await database.connect(MONGODB_URI)
    let status = await database.replSetGetStatus()
    status.members.forEach(member => {
      _healthGauge.set({ name: member.name}, member.health)
      _stateGauge.set({ name: member.name}, member.state)
      _downtimeGauge.set({name: member.name}, 0)

      if(!member.health && !_membersDowntime[member.name]) {
        startDowntimeTimer(member)
      } else if(member.health && _membersDowntime[member.name]) {
        stopDowntimeTimer(member)
      }
    })
}

startDowntimeTimer = (member) => {
  _membersDowntime[member.name] =  _downtimeGauge.startTimer({name: member.name})
}

stopDowntimeTimer = (member) => {
  //call the endTimer function
  _membersDowntime[member.name]()
  _membersDowntime[member.name] = false
}

exports.getContentType = () => {
  return client.register.contentType
}

exports.getMetrics = async () => {
  await checkReplicaset()
  return client.register.metrics()
}