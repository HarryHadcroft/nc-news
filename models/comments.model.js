const db = require("../db/connection")

function selectCommentsByArticleId(article_id, sort_by = "created_at", order = "DESC") {
    const validSortBy = ["created_at", "votes", "author"]
    const validOrder = ["ASC", "DESC"]

    if(!validSortBy.includes(sort_by)){
        return Promise.reject({status: 400, msg: "bad request"})
    }

    if(!validOrder.includes(order)){
        return Promise.reject({status: 400, msg: "bad request"})
    }

    let sqlString = `SELECT * FROM comments WHERE article_id=$1`
    sqlString += ` ORDER BY ${sort_by} ${order}`
    return db.query(sqlString, [article_id]).then((result) => {
        return result.rows
    })
}

function insertCommentByArticleId(article_id, body) {
    if(Object.keys(body).length > 2){
        return Promise.reject({status: 400, msg: "bad request"})
    }
   return db.query(`INSERT INTO comments (article_id, author, body)
   VALUES ($1, $2, $3)
   RETURNING *`, [article_id, body.username, body.body])
   .then((result) => {
    return result.rows[0]
   })
}

function removeCommentById(comment_id) {
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`, [comment_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "not found"})
        }
    })
}

module.exports = {removeCommentById, insertCommentByArticleId, selectCommentsByArticleId}