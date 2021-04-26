const router = require('express').Router()

const { productController } = require('../controllers')

router.get('/getproduct', productController.getProd)
router.get('/getcarousel', productController.getCarousel)
router.get('/detail/:id', productController.getProductDetail)
router.get('/category/:category/sort=:sort', productController.getProductByCategory)
router.get('/page/:page/sort=:sort', productController.getProductPagination)
router.get('/sort_asc/:page', productController.getProductNameASC)
router.get('/sort_desc/:page', productController.getProductNameDESC)
router.get('/sort_priceASC/:page', productController.getProductPriceASC)
router.get('/sort_priceDESC/:page', productController.getProductPriceDESC)

module.exports = router