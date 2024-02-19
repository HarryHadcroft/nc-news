const express = require("express")
const app = express()
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/api.controller")
const getArticleById = require("./controllers/articles.controller")

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "Cannot find path"})
    next()
})
module.exports = app;