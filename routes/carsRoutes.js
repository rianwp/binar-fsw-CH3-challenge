const express = require('express')
const carsController = require('../controllers/carsController')
const router = express.Router()

router.param('id', carsController.checkId)

router
	.route('/')
	.get(carsController.getAllCars)
	.post(carsController.isRequiredPropsValid, carsController.createCar)

router
	.route('/:id')
	.get(carsController.getCarById)
	.put(carsController.editCar)
	.delete(carsController.deleteCar)

module.exports = router
