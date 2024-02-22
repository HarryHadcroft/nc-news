const {updatedArticlebyId, selectArticleById, selectArticles} = require("../models/articles.model")

function getArticleById (req, res, next) {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

function getArticles(req, res, next) {
    const query = req.query
    selectArticles(query).then((articles) => {
        res.status(200).send({ articles })
    }).catch(next)
}

function patchArticleById(req, res, next) {
    const { article_id } = req.params
    const body = req.body
    updatedArticlebyId(article_id, body).then((updatedArticle) => {
        res.status(200).send({ updatedArticle })
    }).catch(next)
}

module.exports = {patchArticleById, getArticleById, getArticles}