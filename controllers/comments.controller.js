const {insertCommentByArticleId, selectCommentsByArticleId} = require("../models/comments.model")
const { selectArticleById } = require("../models/articles.model")

function getCommentsByArticleId(req, res, next) {
    const { article_id } = req.params
    const { sort_by, order } = req.query
    const promises = [selectCommentsByArticleId(article_id, sort_by, order), selectArticleById(article_id)]

    Promise.all(promises).then((promiseResolutions) => {
        res.status(200).send({ comments: promiseResolutions[0]})
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