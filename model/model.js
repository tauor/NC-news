const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((result) => result.rows);
}

exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`,[id])
        .then((result) => result.rows[0]);
}

exports.changeArticleVotesById = (id,newVotes) => {
    return db.query(`UPDATE articles SET votes =  votes + $1 WHERE article_id = $2 RETURNING *`,[newVotes,id])
    .then((result) => result.rows[0]);
}