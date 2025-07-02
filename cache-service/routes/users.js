const express = require('express')
// const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const multer = require('multer')


const db = require('../database')
const utils = require('../utils')
const mailer = require('../mailer')
const config = require('../config')

const router = express.Router()

const upload = multer({ dest: 'files' })

// test API
router.get('/test', (request, response) => {
    // Try a simple query to test DB connection
    db.pool.query('SHOW TABLES', (error, results) => {
        if (error) {
            console.error('Database connection failed:', error);
            return response.status(500).send('Database connection failed');
        }
        response.send({
            message: 'Server and database test successful',
            tables: results
        });
    });
})

// register
router.post('/register', (request, response) => {
    console.log(`method=${request.method}, url=${request.url}`)
    const { firstName, lastName, email, password } = request.body

    console.log(`
        firstName=${firstName},
        lastName=${lastName},
        email=${email},
        password=${password}
        `)

    // create sql statement
    const statement = `
            insert into users (firstName, lastName, email, password) values (?,?,?,?);
        `

    // encrypt the password
    // encryptedPassword = String(crypto.SHA256(password))

    db.pool.execute(statement, [firstName, lastName, email, utils.encryptedPassword(password)],
        (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return response.status(400).send({
                        status: 'error',
                        message: 'Email already registered. Please use a different email or log in.'
                    });
                }
                else {
                    response.send(utils.createError(error))
                }
            }
            else {
                // send the result to the client
                mailer.sendEmail(email, 'Welcome to food ordering application', `
                <h1> Welcome </h1>
                </br>
                <div>hello ${firstName}</div>
                </br>
                <div>Thank you !</div>
                <div>Admin.</div>
                `)

                // send the result to the client
                response.send(utils.createResult(error, result))
            }

        }
    )

})

// login
router.post('/login', (request, response) => {
    const { email, password } = request.body

    const statement = `
        select id, firstName, lastName from users where email=? and password=?;
    `
    // execute the query
    db.pool.query(statement,
        [email, utils.encryptedPassword(password)],
        (error, users) => {
            if (error) {
                // error while executing sql statement
                response.send(utils.createError(error))
            } else {
                if (users.length == 0) {
                    response.send(utils.createError(`user dosenot exist`))
                } else {
                    // response.send(utils.createSuccess(users[0]))
                    const { firstName, lastName, id } = users[0]

                    // create payload
                    const payload = {
                        id,
                        firstName,
                        lastName
                    }
                    // create a token
                    try {
                        const token = jwt.sign(payload, config.secret)
                        response.send(utils.createSuccess({
                            token,
                            firstName,
                            lastName
                        }))
                    } catch (ex) {
                        response.send(utils.createError(ex))
                    }
                }
            }
        }
    )

})

// forgot-password
router.post('/forgot-password', (request, response) => {
    const { email } = request.body

    const statement = `
        select id, firstName, lastName from users where email=?;
    `
    // execute the query
    db.pool.query(statement,
        [email],
        (error, users) => {
            if (error) {
                // error while executing sql statement
                response.send(utils.createError(error))
            } else {
                if (users.length == 0) {
                    response.send(utils.createError(`user dosenot exist`))
                } else {
                    // user exists
                    const user = users[0]

                    if (config.email.enabled) {
                        // // send email
                        // mailer.sendEmail(email,
                        //     `Reset Password`,
                        //     `
                        //     <h1>Reset Password</h1>
                        //     <br/>
                        //     <div>Dear ${user['first_name']},</div>
                        //     <div>Please click <a href="http://locolhost:5173/reset-password">here</a> to reset the password.</div>
                        //     <div>Thank you !</div>
                        //     <div>Admin.</div>
                        //     `)    
                    }

                    // send response
                    response.send(utils.createSuccess('Please check your email'))
                }
            }
        }
    )
})

// reset password
router.put('/reset-password/', (request, response) => {
    const { email, password } = request.body

    // SQL statement
    statement = `UPDATE users SET password = ? where email = ?;`

    db.pool.execute(statement, [utils.encryptedPassword(password), email], (error, result) => {
        response.send(utils.createResult(error, result))
    })
})

// get user profile
router.get('/profile', (request, response) => {

    // get the user id from request's user object
    const { id } = request['userInfo']

    // SQL statement
    const statement = `
        SELECT firstName, lastName, email FROM users where id = ?;
    `
    db.pool.query(statement, [id], (error, users) => {
        response.send(utils.createResult(error, users[0]))
    })



})

// update profile
router.put('/profile', (request, response) => {
    const { firstName, lastName, password } = request.body
    // create sql statement
    const statement = `
            UPDATE users set firstName = ?, lastName = ?, password = ? WHERE  id = ?;
        `

    // encrypt the password
    // encryptedPassword = String(crypto.SHA256(password))

    db.pool.execute(statement, [firstName, lastName, utils.encryptedPassword(password), request['userInfo']['id'],],
        (error, result) => {

            // send the result to the client
            // mailer.sendEmail(email, 'Welcome to food ordering application', `
            //     <h1> Welcome </h1>
            //     </br>
            //     <div>hello ${firstName}</div>
            //     </br>
            //     <div>Thank you !</div>
            //     <div>Admin.</div>
            //     `)

            // send the result to the client
            response.send(utils.createResult(error, result))
        }
    )
})

// update the profile image
router.put('/profile-image', upload.single('photo'), (request, response) => {
    console.log(request.file)

    const { profileImage } = request.body
    // create sql statement
    const statement = `
            UPDATE users set profileImage = ? WHERE  id = ?;
        `

    // encrypt the password
    // encryptedPassword = String(crypto.SHA256(password))

    db.pool.execute(statement, [request.file.fieldname, request['userInfo']['id']],
        (error, result) => {

            // send the result to the client
            // mailer.sendEmail(email, 'Welcome to food ordering application', `
            //     <h1> Welcome </h1>
            //     </br>
            //     <div>hello ${firstName}</div>
            //     </br>
            //     <div>Thank you !</div>
            //     <div>Admin.</div>
            //     `)

            // send the result to the client
            response.send(utils.createResult(error, result))
        }
    )
})




module.exports = router