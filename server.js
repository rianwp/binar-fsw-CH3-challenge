const app = require('./app')

const port = process.env.port || 8000

app.listen(port, () => {
	console.log(`Server Berjalan di port ${port}...`)
})
