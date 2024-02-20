const getAllEndpoints = require("../models/api.model")

function getEndpoints (req, res, next) {
    const allEndpoints = getAllEndpoints()
    res.status(200).send({ allEndpoints })
}

module.exports = getEndpoints