const db = require("../db/connection")

function selectTopics() {
    return db.query(`SELECT * FROM topics;`).then((result) => {
        return result.rows
    })
}

function selectTopicByName(topicName) {
    return db.query(`SELECT * FROM topics
    WHERE slug = $1`, [topicName]).then((result) => {
        return result.rows
    })
}

module.exports = {selectTopicByName, selectTopics}