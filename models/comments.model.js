const db = require("../db/connection")

function selectCommentsByArticleId(article_id, sort_by = "created_at", order = "DESC") {
    console.log(sort_by)
    const validSortBy = ["created_at", "votes", "author"]
    const validOrder = ["ASC", "DESC"]
    let sqlString = `SELECT * FROM comments WHERE article_id=$1`
    sqlString += ` ORDER BY ${sort_by} ${order}`
    return db.query(sqlString, [article_id]).then((result) => {
        return result.rows
    })
}

module.exports = selectCommentsByArticleId