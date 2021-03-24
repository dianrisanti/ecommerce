const router = require('express').Router()

const orderController = require('../controllers/orderController')

router.post('/add', orderController.addCart)
router.get('/get/:id', orderController.getCart)
router.patch('/edit', orderController.editCart)
router.post('/delete', orderController.deleteCart)
router.get('/history/:id', orderController.getHistory)
router.get('/summary/:id', orderController.getSummary)
router.post('/invoice/:id', orderController.getInvoice)
router.post('/update_stock', orderController.updateStock)
router.post('/cancel/:order_number', orderController.cancelOrder)

module.exports = router