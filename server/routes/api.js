const Task = require('../models/task')
const express = require('express')
const router = express.Router()
const sendSms = require('../twilio.js')

/* CREATE */
router.post('/new', (req, res) => {
  let final = {}

  final.first = req.body.first
  final.last = req.body.last
  final.date = req.body.date
  final.time = req.body.time
  final.phoneNumber = '+13479741815'
  // final.phoneNumber = req.body.phoneNumber
  final.location = req.body.location
  let message = `Hey ${final.first} ${final.last}! Your upcoming court date is ${final.date} at ${final.time} located at ${final.location}`
  sendSms(final.phoneNumber, message)

  Task.create(final, (err, task) => {
    if (err) {
      console.log('CREATE Error: ' + err)
      res.status(500).send('Error')
    } else {
      res.status(200).json(final)
    }
  })
})

router.post('/sendSms', (req, res) => {
  let final = {}

  final.first = req.body.first
  final.last = req.body.last
  final.date = req.body.date
  final.time = req.body.time
  final.phoneNumber = '+13479741815'
  // final.phoneNumber = req.body.phoneNumber
  final.location = req.body.location

  let message = `Hey ${final.first} ${final.last}! Your upcoming court date is ${final.date} at ${final.time} located at ${final.location}`
  sendSms(final.phoneNumber, message)
})

router.get('/new', async (req, res) => {
  const final = await Task.find()

  res.send(final)
})

router
  .route('/:id')
  /* DELETE */
  .delete((req, res) => {
    Task.findById(req.params.id, (err, task) => {
      if (err) {
        console.log('DELETE Error: ' + err)
        res.status(500).send('Error')
      } else if (task) {
        task.remove(() => {
          res.status(200).json(task)
        })
      } else {
        res.status(404).send('Not found')
      }
    })
  })

module.exports = router
