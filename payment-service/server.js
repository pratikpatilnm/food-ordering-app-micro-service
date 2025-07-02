// import express
const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./config')
const utils = require('./utils')
// const dotenv = require('dotenv')


// // load the configuration from .env file
// dotenv.config()
// console.log(process.env['DUMMY_KEY'])

// create app
const app = express()
// set PORT
const PORT = 4006;

// set the middleware
app.use(express.json())
app.use(express.urlencoded())

// extract the token to authorize the user
app.use((request, response, next) => {
    // check if the token is required
    if (request.url == '/user/register' || request.url == '/user/login') {
        // token is not required
        return next()
    } else {
        // ins the middleware to check token
        console.log('in the middlewar to check token')
        // read the token from request headers
        let token = request.headers['authorization']

        if (!token) {
            return response.send(utils.createError('token is missing'))
        }
        // Safely remove "Bearer" prefix
        // token = token.replace('Bearer ','')
        token = token.replace('Bearer', '').trim();
        console.log(token)

        try {
            // verify the token
            if (jwt.verify(token, config.secret)) {
                // get the payload
                const payload = jwt.decode(token)
                console.log(`payload: `, payload)

                // add the payload in the request with key 'user'
                request['userInfo'] = payload

                // go to the required route
                next()
            } else {
                response.send(`invalid token`)
                console.log('verification failed !')
            }
        } catch (ex) {
            response.send(utils.createError('invalid toen'))
        }


    }


})

// add the routes
const userRouter = require('./routes/users')
const userAddress = require('./routes/address')
const categoryRouter = require('./routes/categories')
const foodItemRouter = require('./routes/foodItems') 
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/orders')

app.use('/user', userRouter)
app.use('/address', userAddress)
app.use('/category', categoryRouter)
app.use('/food-item', foodItemRouter)
app.use('/cart', cartRouter)
app.use('/order',orderRouter )

// start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server started on port ${PORT}`)
})