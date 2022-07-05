const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((result) => result.rows);
}

exports.selectArticleById = (id) => {
    const dbQuery = (`SELECT articles.*, COUNT (*) AS comment_count
    FROM articles 
    INNER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = ${id}
    GROUP BY articles.article_id;`);
    return db.query(dbQuery)
        .then((result) => {
            result.rows[0];
            if (!result.rows[0]){ 
                return Promise.reject({
                    status: 404,
                    msg: 'No article found with that id'
                })
            }
            return result.rows[0];
        })
}

exports.changeArticleVotesById = (id,newVotes) => {
    if (newVotes === undefined){
        return Promise.reject({
            status: 400,
            msg: 'Invalid request body'
        })
    }
    return db.query(`UPDATE articles SET votes =  votes + $1 WHERE article_id = $2 RETURNING *`,[newVotes,id])
        .then((result) => {
            result.rows[0];
            if (!result.rows[0]){ 
                return Promise.reject({
                    status: 404,
                    msg: 'No article found with that id'
                })
            }
            return result.rows[0];
        })
}

exports.selectUsers = () => {
    return db.query('SELECT * FROM users')
        .then((result) => result.rows);
}