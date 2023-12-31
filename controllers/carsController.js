const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const dataCarsPath = `${__dirname}/../data/data.json`
const dataCarsJson = fs.readFileSync(dataCarsPath, 'utf-8')
const dataCars = [...JSON.parse(dataCarsJson)]

const isRequiredPropsValid = (req, res, next) => {
	const requiredProps = ['plate', 'manufacture', 'model']
	for (const prop of requiredProps) {
		if (typeof req.body[prop] !== 'string') {
			return res.status(400).json({
				status: 'failed',
				message:
					'Request body harus memiliki plate, manufacture, dan model dengan format string',
			})
		}
	}
	next()
}

const checkId = (req, res, next, val) => {
	const carIndex = dataCars.findIndex((car) => car.id === val)
	if (carIndex === -1) {
		return res.status(404).json({
			status: 'failed',
			message: `Data dengan id ${val} tidak ditemukan`,
		})
	}
	next()
}

const isArrayofStrings = (arr) => {
	return (
		Array.isArray(arr) && arr.every((element) => typeof element === 'string')
	)
}

const getAllCars = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			cars: dataCars,
		},
	})
}

const getCarById = (req, res) => {
	const id = req.params.id

	const carIndex = dataCars.findIndex((car) => car.id === id)

	res.status(200).json({
		status: 'success',
		data: {
			car: dataCars[carIndex],
		},
	})
}

const createCar = (req, res) => {
	// terdapat validasi untuk add data, jadi format harus sesuai dengan satuan data pada json
	const {
		plate,
		manufacture,
		model,
		image,
		rentPerDay,
		capacity,
		description,
		availableAt,
		transmission,
		available,
		type,
		year,
		options,
		specs,
	} = req.body
	const id = uuidv4()
	const addedCar = {
		id,
		plate,
		manufacture,
		model,
		image: typeof image === 'string' ? image : '',
		rentPerDay: typeof rentPerDay === 'number' ? rentPerDay : 0,
		capacity: typeof capacity === 'number' ? capacity : 1,
		description: typeof description === 'string' ? description : '',
		availableAt:
			typeof availableAt === 'string' ? availableAt : new Date().toISOString(),
		transmission: typeof transmission === 'string' ? transmission : '',
		available: typeof available === 'boolean' ? available : true,
		type: typeof type === 'string' ? type : '',
		year: typeof year === 'number' ? year : new Date().getFullYear(),
		options: isArrayofStrings(options) ? options : [],
		specs: isArrayofStrings(specs) ? specs : [],
	}
	dataCars.push(addedCar)
	fs.writeFile(dataCarsPath, JSON.stringify(dataCars), (err) => {
		res.status(201).json({
			status: 'success',
			data: {
				cars: dataCars,
			},
		})
	})
}

const editCar = (req, res) => {
	// terdapat validasi untuk update data
	const id = req.params.id

	const carIndex = dataCars.findIndex((car) => car.id === id)

	const {
		plate,
		manufacture,
		model,
		image,
		rentPerDay,
		capacity,
		description,
		availableAt,
		transmission,
		available,
		type,
		year,
		options,
		specs,
	} = req.body
	const updatedCar = {
		id: dataCars[carIndex].id,
		plate: typeof model === 'string' ? plate : dataCars[carIndex].plate,
		manufacture:
			typeof model === 'string' ? manufacture : dataCars[carIndex].manufacture,
		model: typeof model === 'string' ? model : dataCars[carIndex].model,
		image: typeof image === 'string' ? image : dataCars[carIndex].image,
		rentPerDay:
			typeof rentPerDay === 'number'
				? rentPerDay
				: dataCars[carIndex].rentPerDay,
		capacity:
			typeof capacity === 'number' ? capacity : dataCars[carIndex].capacity,
		description:
			typeof description === 'string'
				? description
				: dataCars[carIndex].description,
		availableAt:
			typeof availableAt === 'string'
				? availableAt
				: dataCars[carIndex].availableAt,
		transmission:
			typeof transmission === 'string'
				? transmission
				: dataCars[i].transmission,
		available:
			typeof available === 'boolean' ? available : dataCars[carIndex].available,
		type: typeof type === 'string' ? type : dataCars[carIndex].type,
		year: typeof year === 'number' ? year : dataCars[carIndex].year,
		options: isArrayofStrings(options) ? options : dataCars[carIndex].options,
		specs: isArrayofStrings(specs) ? specs : dataCars[carIndex].specs,
	}
	dataCars[carIndex] = updatedCar
	fs.writeFile(dataCarsPath, JSON.stringify(dataCars), (err) => {
		res.status(200).json({
			status: 'success',
			data: {
				car: updatedCar,
			},
		})
	})
}

const deleteCar = (req, res) => {
	const id = req.params.id

	const carIndex = dataCars.findIndex((car) => car.id === id)

	const deletedCar = dataCars[carIndex]
	dataCars.splice(carIndex, 1)
	fs.writeFile(dataCarsPath, JSON.stringify(dataCars), (err) => {
		res.status(200).json({
			status: 'success',
			data: {
				car: deletedCar,
			},
		})
	})
}

module.exports = {
	getAllCars,
	getCarById,
	createCar,
	editCar,
	deleteCar,
	isRequiredPropsValid,
	checkId,
}
