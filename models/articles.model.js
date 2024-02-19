const db = require("../db/connection")

function selectArticleById(articleId) {
   return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then((result) => {
    if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: "Article does not exist"})
    }
    return result.rows[0]
   })
}

module.exports = selectArticleById