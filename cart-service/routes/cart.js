const express = require('express')

const router = express.Router()

const db = require('../database')
const utils = require('../utils')

router.get('/', (request, response) => {
    const statement = `SELECT c.id, c.foodItemId, c.quantity, c.price from cart c where c.userid = ?`
    db.pool.execute(statement, [request['userInfo']['id']], (error, result) => {
        response.send(utils.createResult(error, result))
    })

})

router.post('/', (request, response) => {
    const { foodItemId, quantity, price } = request.body
    // const priceQuery = `SELECT price FROM foodItem WHERE id = ?`;
    const statement = `INSERT INTO cart(userId, foodItemId, quantity, price) VALUES (?, ?, ?, ?)`
    db.pool.query(statement, [request['userInfo']['id'], foodItemId, quantity, price], (error, result) => {
                response.send(utils.createResult(error, result))
            })
    // db.pool.query(priceQuery, [foodItemId], (error, result) => {
    //     if (error) {
    //         response.send(utils.createError(error))
    //     }
    //     else if (result.length === 0) {
    //         response.send(utils.createError(`Food item not found`))
    //     }
    //     else {
    //         // const price = result[0].price;
            
            
    //     }
    // })
})

router.put('/:id', (request, response) => {
    const { id } = request.params
    const { quantity, price } = request.body
    const statement = `UPDATE cart SET quantity=?, price=? WHERE id=? `
    db.pool.execute(statement, [quantity, price, id], (error, result) => {
        response.send(utils.createResult(error, result))
    })
})

router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `DELETE FROM cart where id = ? and userId = ?`
    db.pool.execute(statement, [id, request['userInfo']['id']], (error, result) => {
        response.send(utils.createResult(error, result))
    })
})



module.exports = router