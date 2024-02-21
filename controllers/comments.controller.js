const {insertCommentByArticleId, selectCommentsByArticleId} = require("../models/comments.model")

function getCommentsByArticleId(req, res, next) {
    const { article_id } = req.params
    const { sort_by, order } = req.query
    selectCommentsByArticleId(article_id, sort_by, order).then((articles) => {
        res.status(200).send({articles})
    }).catch(next)
}

function postCommentByArticleId(req, res, next) {
    const { article_id } = req.params
    const body = req.body
    insertCommentByArticleId(article_id, body).then((newComment) => {
        res.status(201).send({newComment})
    }).catch(next)
}

module.exports = {postCommentByArticleId, getCommentsByArticleId}