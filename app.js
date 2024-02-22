const express = require("express")
const app = express()
const getTopics = require("./controllers/topics.controller")
const getEndpoints = require("./controllers/api.controller")
const {patchArticleById, getArticleById, getArticles} = require("./controllers/articles.controller")
const {handleInvalidEnpoint, handlePSQLErrors, handleCustomerErrors} = require("./controllers/errors.controller")
const {deleteCommentById, postCommentByArticleId, getCommentsByArticleId} = require("./controllers/comments.controller")
const getUsers = require("./controllers/users.controller")

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("*", handleInvalidEnpoint)

app.use(handleCustomerErrors)

app.use(handlePSQLErrors)

module.exports = app;