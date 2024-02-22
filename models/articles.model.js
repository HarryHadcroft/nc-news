const db = require("../db/connection")

function selectArticleById(articleId) {
   return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then((result) => {
    if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "not found"})
    }
    return result.rows[0]
   })
}

function selectArticles(sort_by = "created_at", order = "DESC") {
    const validsortBy = ["created_at"]

    let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`
    
    sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

    return db.query(sqlString).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 400, msg: "bad request"})
        }
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