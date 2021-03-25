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
    }
}