require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const api = require('./routes/api')
const Pusher = require('pusher')

mongoose.connect(
  // 'mongodb+srv://bethea28:Javaninja1@cluster0-fbg69.mongodb.net/twilio-testOne?retryWrites=true&w=majority&replicaSet=rs',
  process.env.REACT_APP_NOT_MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
// mongoose.connect('mongodb://localhost/tasksDb?replicaSet=rs')

// const pusher = new Pusher({
//   appId: '1067633',
//   key: '33a5e107c36db56b195b',
//   secret: 'ff6b4145fcb83aaa9c73',
//   cluster: 'us2',
//   encrypted: true,
// })
// const channel = 'tasks'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', api)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection Error:'))

db.once('open', () => {
  app.listen(9000, () => {
    console.log('Node server running on port 9000')
  })

  // const taskCollection = db.collection('tasks')
  // const changeStream = taskCollection.watch()

  // changeStream.on('change', (change) => {
  //   console.log('this is CHANGE STREAM', change)

  //   if (change.operationType === 'insert') {
  //     const task = change.fullDocument
  //     pusher.trigger(channel, 'inserted', {
  //       id: task._id,
  //       task: task.task,
  //     })
  //   } else if (change.operationType === 'delete') {
  //     pusher.trigger(channel, 'deleted', change.documentKey._id)
  //   }
  // })
})
