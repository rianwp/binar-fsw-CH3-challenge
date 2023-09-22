const express = require('express')
const defaultController = require('../controllers/defaultController')
const router = express.Router()

router.route('/').get(defaultController.pingServer)

module.exports = router
