const router = require('express').Router()

const orderController = require('../controllers/orderController')

router.post('/add', orderController.addCart)
router.get('/get/:id', orderController.getCart)
router.post('/edit', orderController.editCart)
router.post('/delete', orderController.deleteCart)
router.get('/history/:id', orderController.getHistory)
router.get('/summary/:id', orderController.getSummary)

module.exports = router