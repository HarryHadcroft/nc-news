const db = require("../db/connection")
const {selectTopics, selectTopicByName} = require("./topics.model")

function selectArticleById(articleId) {
   return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then((result) => {
    if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "not found"})
    }
    return result.rows[0]
   })
}

async function selectArticles(query, sort_by = "created_at", order = "DESC") {
    const queryVals = []
    const queryKey = Object.keys(query)
    let alltopics = await selectTopics()
    const validQueryVals = alltopics.map((topic) => {
        return topic.slug
    })

    if(queryKey.length !== 0 && !queryKey.includes("topic") || query.topic === ""){
        return Promise.reject({status: 400, msg: "bad request"})
    }

    let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    if(query.topic){
        if(!validQueryVals.includes(query.topic)){
            console.log("here")
            console.log(query.topic)
            return Promise.reject({status: 400, msg: "bad request"})
        }
        sqlString += ` WHERE articles.topic=$1`
        queryVals.push(query.topic)
    }
    
    sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

    return db.query(sqlString, queryVals).then((result) => {
        return result.rows
    })
}

function updatedArticlebyId(article_id, body) {
    const bodyKeys = Object.keys(body);
    if (bodyKeys.length !== 1 || !bodyKeys.includes('inc_votes')) {
        return Promise.reject({ status: 400, msg: "bad request" });
    }
    return db.query(`UPDATE articles 
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *`, [article_id, body.inc_votes])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "not found"})
        }
        return result.rows[0]
    })
}
module.exports = {updatedArticlebyId, selectArticleById, selectArticles}