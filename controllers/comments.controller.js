const selectCommentsByArticleId = require("../models/comments.model")

function getCommentsByArticleId(req, res, next) {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}

module.exports = getCommentsByArticleId