const express = require('express')
const db = require("../database")
const utils = require("../utils")
const router = express.Router()

router.get('/', (request, response) => {
    const statement = `SELECT id, addressId, totalPrice, discount, finalAmount, paymentStatus, paaymentId, status FROM orderMaster where userId = ?`;
    db.pool.query(statement, [request['userInfo']['id']], (error, result) => {
        response.send(utils.createResult(error, result))
    });
})

router.post('/', (request, response) => {
    const { discount, addressId} = request.body
    // get all the cart items
    const statement = `SELECT foodItemId, price, quantity from cart where userId = ?`;
    db.pool.execute(statement, [request['userInfo']['id']], (error, items) => {
        if (error) {
            response.send(utils.createError(error))
        } else {
            // calculate the total price
            let totalPrice = 0;
            for (const item of items)
                totalPrice += item['price'] * item['quantity']
            // calculate the final amount
            const finalAmount = totalPrice - discount

            // create order in orderMaster table and get orderId
            const statementOrderMaster = `insert into orderMaster (userId, addressId, totalPrice, discount, finalAmount) values (?,?,?,?,?)`
            db.pool.execute(statementOrderMaster, [request['userInfo']['id'], addressId, totalPrice, discount, finalAmount], (error, result) => {
                if (error) {
                    response.send(utils.createError(error))
                } else {
                    // get the orderId from the result
                    const orderId = result['insertId']
                    // iterate over the items and inset them one by one into the order details table 
                    const rows = []
                    for (const item of items) {
                        rows.push(`(${orderId}, ${item['foodItemId']}, ${item['quantity']}, ${item['price']})`)
                    }
                    statementOrderDetails = `insert into orderDetails(orderId, foodItemId, quantity, price) values ${rows.join(',')} `
                    console.log(statementOrderDetails)
                    db.pool.execute(statementOrderDetails, (error, result) => {
                        if (error) {
                            response.send(utils.createError(error))
                        } else {
                            db.pool.execute(`delete from cart where userId = ?`,[request['userInfo']['id']], (error, result) => {
                                response.send(utils.createResult(error, result))
                            })
                        }
                    })

                }
            })
        }
    });
})

router.patch('/update-status/:orderId/:status', (request, response) => {
    const { orderId, status } = request.params
    const statement = `UPDATE orderMaster set status = ? where id = ?`;
    db.pool.execute(statement,[status, orderId], (error, result) => {
        response.send(utils.createResult(error, result))
    });
})

router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `UPDATE orderMaster set status = "cancled" where id = ?`;
    db.pool.execute(statement,[id], (error, result) => {
        response.send(utils.createResult(error, result))
    });
})

module.exports = router