require('dotenv').config()

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
