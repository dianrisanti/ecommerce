// NOTE import helpers
const transporter = require('../helpers/nodemailer')
const { asyncQuery, generateQuery } = require('../helpers/queryHelp')

const db = require('../database')

// NOTE import module
const handlebars = require('handlebars')
const fs = require('fs')


module.exports = {
    addCart: async(req, res) => {
        let {id_user, order_number, id_product, qty, harga, total} = req.body
        
        try{
            const checkOrder = `SELECT * FROM orders WHERE id_user = ${db.escape(id_user)} AND status = 1`
            const checkResult = await asyncQuery(checkOrder)
            
            order_number = checkResult.length !== 0 ? checkResult[0].order_number : order_number
            const date = new Date()

            if(checkResult.length === 0) {
                const addOrders = `INSERT INTO orders (date, order_number, id_user)
                VALUES ('${date.toLocaleDateString()}', '${order_number}', ${db.escape(id_user)})`
                await asyncQuery(addOrders)
            }

            const checkCart = `SELECT * FROM order_details 
            WHERE order_number = '${order_number}' AND id_product = ${+id_product}`
            const cartResult = await asyncQuery(checkCart)

            if(cartResult.length !== 0) {
                const updateQty = `UPDATE order_details SET quantity = (quantity + ${+qty}), total = (${+harga}*quantity)
                WHERE order_number = '${order_number}' AND id_product = ${+id_product}`
                await asyncQuery(updateQty)
            } 

            if(cartResult.length === 0){
                const addOrderDetail = `INSERT INTO order_details (order_number, id_product, quantity, price, total)
                VALUES ('${order_number}', ${+id_product}, ${+qty}, ${+harga}, ${+total})`
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
            const id_user = req.params.id ? parseInt(req.params.id) : 0
            const getCart = `SELECT o.order_number, od.id_product, p.name, od.quantity, p.price, od.total,  pi.image
            FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN products p ON od.id_product = p.id
            JOIN order_status os ON o.status = os.id_status
            JOIN product_img pi ON od.id_product = pi.product_id
            WHERE o.status = 1 AND o.id_user = ${id_user}
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
        const { id_product, order_number, qty } = req.body

        try {
            const editQty = `UPDATE order_details SET quantity = ${db.escape(qty)}, total = (${db.escape(qty)}*price)
            WHERE id_product = ${parseInt(id_product)} AND order_number = '${order_number}'`
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
            id_product = ${parseInt(id_product)} AND order_number = '${order_number}'`
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
            const id_user = req.params.id ? +req.params.id  : 0
            const history = `SELECT o.date , o.order_number, od.id_product, p.name, od.quantity, 
            p.price, od.total,  pi.image, os.status, o.payment_method
            FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN products p ON od.id_product = p.id
            JOIN order_status os ON o.status = os.id_status
            JOIN product_img pi ON od.id_product = pi.product_id
            WHERE (o.status = 2 OR o.status = 3 OR o.status = 4 OR o.status = 5 OR o.status = 6) AND o.id_user = ${id_user}
            GROUP BY od.id_product, o.order_number`
            const historyResult = await asyncQuery(history)

            let output = []
            historyResult.forEach(item => {
                let temp = {
                    order_number: item.order_number,
                    date: item.date,
                    payment_method: item.payment_method,
                    status: item.status,
                    products: [{
                        id_product: item.id_product,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                        image: item.image
                    }]
                }
                output.push(temp)
            })

            let out = []
            for(entry of output){
                const existingEntry = out.find(o => o.order_number === entry.order_number)
                if(existingEntry){
                  existingEntry.products = existingEntry.products.concat(entry.products)
                } else {
                  out.push(entry)
                }
            }

            res.status(200).send(out)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getSummary: async(req, res) => {
        try{
            const id_user = req.params.id ? +req.params.id  : 0
            const query = `SELECT o.order_number, sum(od.total) total, p.address
            FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN profile p ON o.id_user = p.id_user
            WHERE o.status = 1 AND o.id_user = ${id_user}
            GROUP BY od.order_number`
            const summary = await asyncQuery(query)

            res.status(200).send(summary)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
        
    },
    getInvoice: async(req, res) => {
        try{
            const id_user = +req.params.id
            console.log('id user ', id_user)
            const { order_number, payment_method } = req.body

            const query = `SELECT o.order_number, o.payment_method, sum(od.total) total, p.address, x.username
            FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN profile p ON o.id_user = p.id_user
            JOIN users x ON x.id = p.id_user
            WHERE o.status = 1 AND o.id_user = ${id_user}
            GROUP BY od.order_number`
            const summary = await asyncQuery(query)
            console.log(summary)

            const date = new Date().toDateString()
            
            const currencyFractionDigits = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'IDR',
            }).resolvedOptions().maximumFractionDigits;
            
            var value = summary[0].total.toLocaleString('de-DE', { maximumFractionDigits: currencyFractionDigits });
            
            console.log(value);
            const total_IDR = ("IDR " + value)


            console.log(summary[0])

            // send email notification to user
            const option = {
                from: `admin <cusunliem@gmail.com>`,
                to: 'finalprojectwarehouse3@gmail.com', // NOTE nanti ganti dengan email sesuai register
                subject: 'YOUR INVOICE',
                text: '',
            }

            //set up handlebars
            const emailFile = fs.readFileSync('./email/invoice.html').toString()
            // console.log(email)

            // compile data email
            const template = handlebars.compile(emailFile)

            // menambah properti html di dalam option 
            option.html = template({ 
                name: summary[0].username, 
                order_number: summary[0].order_number, 
                date: date, 
                payment_method: payment_method,
                total: total_IDR
            })

            // send email
            const info = await transporter.sendMail(option)

            const update = `UPDATE orders SET payment_method = '${payment_method}', status = 2 
            WHERE order_number = '${order_number}' AND id_user = ${id_user}`
            await asyncQuery(update)

            res.status(200).send(info.response)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
        
    }
}