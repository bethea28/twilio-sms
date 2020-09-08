const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema(
  {
    task: String,
    first: String,
    last: String,
    location: String,
    time: String,
    date: Date,
    phoneNumber: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Task', taskSchema)
