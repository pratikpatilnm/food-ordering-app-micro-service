const express = require('express')
const utils = require('../utils')
const router = express.Router()


const nodemailer = require('nodemailer')
const config = require('../config')


// generate app password: https://myaccount.google.com/apppasswords
router.post('/', async(request, response) => {
  const {email, subject, body} = request.body
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  })
  const result = await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject,
    html: body,
  })

  response.send(utils.createSuccess(result))
})

// sendEmail(
//     'pratikpatilnm@gmail.com',
//     'test subject',
//     'test body',
//     (result) => {
//     console.log('insiide callback ', result)
// })



module.exports = router