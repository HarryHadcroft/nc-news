const db = require("../db/connection")

function selectCommentsByArticleId(article_id) {
    return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`, [article_id]).then((result) => {
        return result.rows
    })
}

module.exports = selectCommentsByArticleId