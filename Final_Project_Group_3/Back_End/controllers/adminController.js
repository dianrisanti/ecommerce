const { asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    getProductStock: async(req, res) => {
        try{
            const allProdQuery = `SELECT w.id_warehouse, p.id, p.name, wl.location, 
            w.booked, w.available, w.stock FROM warehouse w
            JOIN warehouse_loc wl ON w.location_id = wl.id 
            JOIN products p ON w.product_id = p.id
            ORDER BY p.id`
            const result = await asyncQuery(allProdQuery)

            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    editProductStock: async(req, res) => {
        const { id_product, warehouse } = req.body
        try{
            for await (item of warehouse) {
                let query
                if(item.location === 'Jakarta') {
                    query = `UPDATE warehouse SET stock = ${item.stock} WHERE product_id = ${+id_product} AND location_id = 1`
                }
                if(item.location === 'Medan') {
                    query = `UPDATE warehouse SET stock = ${item.stock} WHERE product_id = ${+id_product} AND location_id = 2`
                }
                if(item.location === 'Surabaya') {
                    query = `UPDATE warehouse SET stock = ${item.stock} WHERE product_id = ${+id_product} AND location_id = 3`
                }
                
                await asyncQuery(query) 
            }

            res.status(200).send("edit stock success")
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getAll: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.stock) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)

            res.status(200).send(productResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getJakarta: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.stock) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id
            WHERE w.location_id = 1
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)

            res.status(200).send(productResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getMedan: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.stock) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id
            WHERE w.location_id = 2
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)

            res.status(200).send(productResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getSurabaya: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.stock) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id
            WHERE w.location_id = 3
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)

            res.status(200).send(productResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
}