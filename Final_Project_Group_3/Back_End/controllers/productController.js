const db = require('../database')

const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    getProd: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.*, SUM(w.stock) total_stock FROM products p 
            JOIN warehouse w ON p.id = w.product_id  GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const result = await asyncQuery(queryProduct)
            result.map(item => item.images = item.images.split(','))

            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getCarousel: async(req, res) => {
        try{
            const queryCarousel = `SELECT * FROM carousel`
            const result = await asyncQuery(queryCarousel)

            res.status(200).send(result)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}