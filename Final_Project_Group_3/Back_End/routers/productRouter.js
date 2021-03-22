const router = require('express').Router()

const { productController } = require('../controllers')

router.get('/all', productController.getProd)
router.get('/getcarousel', productController.getCarousel)
router.get('/detail/:id', productController.getProductDetail)

module.exports = router