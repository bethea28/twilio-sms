require('dotenv').config()

// const mySid = 'ACd96ec502d74f65f1e5dfc1d58f013ab6'
// const myToken = 'c785c5ad4772cddd851ec177ba8b5e60'
// const myFromNumber = '+19198834589'
// const myToNumber = '+13479741815'
// const TWILIO_ACCOUNT_SID = 'ACfb60597cbe096449469458e1d839718c'
// const TWILIO_AUTH_TOKEN = 'c0030a68ed337e1ff495c06a82b87bf5'
// const TWILIO_NUMBER = '+14155927981'
// MY TWILIO CredentialS
const sendSms = (phone, message) => {
  const client = require('twilio')(
    process.env.REACT_APP_NOT_mySid,
    process.env.REACT_APP_NOT_myToken
  )
  client.messages
    .create({
      body: message,
      // body: 'BRYAN WORKS',
      from: process.env.REACT_APP_NOT_myFromNumber,
      to: phone,
    })
    .then((message) => console.log(message.sid))
}

// STANFORDS TWILIO CREDENTIALS
// const sendSms = (phone, message) => {
//   console.log('DOES IT GET HERE')
//   const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
//   client.messages
//     .create({
//       body: message,
//       // body: 'BRYAN WORKS',
//       from: TWILIO_NUMBER,
//       to: phone,
//     })
//     .then((message) => console.log(message.sid))
// }

module.exports = sendSms
