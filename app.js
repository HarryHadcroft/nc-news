const express = require("express")
const app = express()
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/api.controller")

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "Cannot find path"})
    next()
})
module.exports = app;