const express = require("express")
const app = express()
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/api.controller")
const {getArticleById, getArticles} = require("./controllers/articles.controller")
const {handleInvalidEnpoint, handlePSQLErrors, handleCustomerErrors} = require("./controllers/errors.controller")
const {postCommentByArticleId, getCommentsByArticleId} = require("./controllers/comments.controller")

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.all("*", handleInvalidEnpoint)

app.use(handleCustomerErrors)

app.use(handlePSQLErrors)

module.exports = app;