const express = require('express')
const morgan = require('morgan')

const app = express()

const carsRouter = require('./routes/carsRoutes')
const defaultRouter = require('./routes/defaultRoutes')

app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/', defaultRouter)
app.use('/api/v1/cars', carsRouter)

module.exports = app
