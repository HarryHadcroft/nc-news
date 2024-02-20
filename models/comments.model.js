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
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "not found"})
        }
        return result.rows
    })
}

module.exports = selectCommentsByArticleId