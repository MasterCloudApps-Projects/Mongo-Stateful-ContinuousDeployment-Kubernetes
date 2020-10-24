
const express = require('express')
require('dotenv').config()
const database = require('./database')
const server = require('./server')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy'

startup = async () => {
  try {
    await database.connect(MONGODB_URI)
    server.start()
  }catch {
    console.error(e)
    throw Error('Exiting')
  }
}

startup()