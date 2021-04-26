const db = require('../database')

const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    getProd: async(req, res) => {
        try{
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)
            const length = productResult.length
            let category = []
            for(let entry of productResult){
                const existingEntry = category.find(o => o === entry.category)
                if(!existingEntry){
                    category.push(entry.category)
                }
            }

            res.status(200).send({length, category})
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
    },

    getProductDetail: async(req, res) => {
        try{
            const queryDetail = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id
            WHERE main.id = ${+req.params.id} 
            GROUP BY main.id `
            const result2 = await asyncQuery(queryDetail)
            result2.map(item => item.images = item.images.split(','))

            res.status(200).send(result2)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductByCategory: async(req, res) => {
        const sortby  = req.params.sort

        let ORDERBY
        if(sortby === "asc") ORDERBY = "name"
        if(sortby === "desc") ORDERBY = "name DESC"
        if(sortby === "priceHigh") ORDERBY = "price DESC"
        if(sortby === "priceLow") ORDERBY = "price"

        try{
            const category = req.params.category
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id
            WHERE category = '${category}' 
            GROUP BY main.id
            ORDER BY ${ORDERBY}`
            const productResult = await asyncQuery(queryProduct)
            productResult.map(item => item.images = item.images.split(','))

            res.status(200).send(productResult)

        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductPagination: async(req, res) => {
        const sortby  = req.params.sort

        let ORDERBY
        if(sortby === "asc") ORDERBY = "name"
        if(sortby === "desc") ORDERBY = "name DESC"
        if(sortby === "priceHigh") ORDERBY = "price DESC"
        if(sortby === "priceLow") ORDERBY = "price"

        try{
            const itemsPerPage = 12
            const page = +req.params.page === 1 ? 0 : (+req.params.page - 1) * itemsPerPage
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id
            ORDER BY ${ORDERBY}
            LIMIT ${page}, ${itemsPerPage}`
            const productResult = await asyncQuery(queryProduct)
            productResult.map(item => item.images = item.images.split(','))

            res.status(200).send(productResult)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductNameASC: async(req, res) => {
        try{
            const page = +req.params.page
            const itemsPerPage = 12
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)
            productResult.sort((a,b) => a.name.localeCompare(b.name))

            const productSliced = productResult.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            productSliced.map(item => item.images = item.images.split(','))

            res.status(200).send(productSliced)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductNameDESC: async(req, res) => {
        try{
            const page = +req.params.page
            const itemsPerPage = 12
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)
            productResult.sort((a,b) => -1 * a.name.localeCompare(b.name))

            const productSliced = productResult.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            productSliced.map(item => item.images = item.images.split(','))

            res.status(200).send(productSliced)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductPriceASC: async(req, res) => {
        try{
            const page = +req.params.page
            const itemsPerPage = 12
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)
            productResult.sort((a,b) => b.price - a.price)

            const productSliced = productResult.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            productSliced.map(item => item.images = item.images.split(','))

            res.status(200).send(productSliced)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    getProductPriceDESC: async(req, res) => {
        try{
            const page = +req.params.page
            const itemsPerPage = 12
            const queryProduct = `SELECT main.*, GROUP_CONCAT(pi.image separator ',') images FROM (SELECT p.id, p.name, pc.category, p.description, p.price, SUM(w.available) total_stock FROM products p 
            JOIN product_category pc ON p.category_id = pc.id
            JOIN warehouse w ON p.id = w.product_id  
            GROUP BY p.id) main 
            JOIN product_img pi ON main.id = pi.product_id 
            GROUP BY main.id`
            const productResult = await asyncQuery(queryProduct)
            productResult.sort((a,b) => a.price - b.price)

            const productSliced = productResult.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            productSliced.map(item => item.images = item.images.split(','))

            res.status(200).send(productSliced)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}