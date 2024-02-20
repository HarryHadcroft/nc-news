const db = require("../db/connection")

function selectArticleById(articleId) {
   return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then((result) => {
    if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Article does not exist"})
    }
    return result.rows[0]
   })
}

function selectArticles(topic, author, sort_by = "created_at", order = "DESC") {
    const validsortBy = ["created_at", "votes"]
    const validQueries = []

    let sqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    if(topic){
        sqlString += ` WHERE articles.topic=$1`
        validQueries.push(topic)
    }

    if(author){
        sqlString += ` WHERE articles.author=$1`
        validQueries.push(author)
    }
    
    sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

    return db.query(sqlString, validQueries).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 400, msg: "bad request"})
        }
        return result.rows
    })
}

module.exports = {selectArticleById, selectArticles}