const { asyncQuery, generateQuery } = require('../helpers/queryHelp')

const db = require('../database')

module.exports = {
    addCart: async(req, res) => {
        let {id_user, order_number, id_product, qty, harga, total} = req.body
        
        try{
            const checkOrder = `SELECT * FROM orders WHERE id_user = ${db.escape(id_user)} AND status = 1`
            const checkResult = await asyncQuery(checkOrder)
            
            order_number = checkResult.length !== 0 ? checkResult[0].order_number : order_number

            if(checkResult.length === 0) {
                const addOrders = `INSERT INTO orders (order_number, id_user)
                VALUES ('${order_number}', ${db.escape(id_user)})`
                await asyncQuery(addOrders)
            }

            const checkCart = `SELECT * FROM order_details 
            WHERE order_number = ${+order_number} AND id_product = ${+id_product}`
            const cartResult = await asyncQuery(checkCart)

            if(cartResult.length !== 0) {
                const updateQty = `UPDATE order_details SET quantity = (quantity + ${+qty}), total = (${+harga}*quantity)
                WHERE order_number = ${+order_number} AND id_product = ${+id_product}`
                await asyncQuery(updateQty)
            } 

            if(cartResult.length === 0){
                const addOrderDetail = `INSERT INTO order_details (order_number, id_product, quantity, total)
                VALUES (${+order_number}, ${+id_product}, ${+qty}, ${+total})`
                await asyncQuery(addOrderDetail)
            }

            res.status(200).send('Add to cart success')
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getCart: async (req, res) => {
        try {
            const getCart = `SELECT o.order_number, od.id_product, p.name, od.quantity, p.price, od.total,  pi.image
            FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN products p ON od.id_product = p.id
            JOIN order_status os ON o.status = os.id_status
            JOIN product_img pi ON od.id_product = pi.product_id
            WHERE o.status = 1 AND o.id_user = ${parseInt(req.params.id)}
            GROUP BY od.id_product`

            const result = await asyncQuery(getCart)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    editCart: async (req, res) => {
        const { id_product, order_number, ...input } = req.body

        try {
            const editQty = `UPDATE order_details SET${generateQuery(input)}
            WHERE id_product = ${+id_product} AND order_number = ${+order_number}`
            await asyncQuery(editQty)

            res.status(200).send(`edit cart for id_product ${+id_product} success`)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    deleteCart: async (req, res) => {
        const { id_product, order_number } = req.body

        try {
            const deleteItem = `DELETE FROM order_details WHERE 
            id_product = ${+id_product} AND order_number = ${+order_number}`
            await asyncQuery(deleteItem)

            res.status(200).send(`delete cart for id_product ${id_product} success`)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    checkout: async(req, res) => {
        try{

        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getHistory: async(req, res) => {
        try{

        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
}