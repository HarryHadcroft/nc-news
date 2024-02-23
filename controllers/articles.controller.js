const {updatedArticlebyId, selectArticleById, selectArticles} = require("../models/articles.model")
const {selectTopicByName, selectTopics} = require("../models/topics.model")

function getArticleById (req, res, next) {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

function getArticles(req, res, next) {
    const query = req.query
    const promises = [selectArticles(query)]

    if(query.topic){
        promises.push(selectTopicByName(query.topic))
    }

    Promise.all(promises).then((promiseResolutions) => {
        res.status(200).send({ articles: promiseResolutions[0] })
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