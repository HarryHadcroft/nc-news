const {selectArticleById, selectArticles} = require("../models/articles.model")

function getArticleById (req, res, next) {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

function getArticles(req, res, next) {
    const { topic, author } = req.query
    selectArticles(topic, author).then((articles) => {
        res.status(200).send({ articles })
    }).catch(next)
}

module.exports = {getArticleById, getArticles}