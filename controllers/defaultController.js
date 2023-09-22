const pingServer = (req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'ping successfully',
	})
}

module.exports = {
	pingServer,
}
