const db = require('../db/connection.js');
const {convertTimestampToDate} = require('../db/helpers/utils.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics')
        .then((result) => result.rows);
}

exports.selectArticleById = (id) => {
    return db.query(`SELECT articles.*, COUNT (*) :: int AS comment_count
        FROM articles 
        FULL OUTER JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,[id])
        .then((result) => {
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

exports.selectArticles = () => {
    return db.query(`SELECT articles.*, COUNT (*) :: int AS comment_count
    FROM articles 
    FULL JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then((result) => {
        return result.rows;
    })
}

exports.selectArticlesComments = async (id) => {
    const articles = await db.query(`SELECT * FROM articles WHERE article_id = $1`,[id])
    return db.query(`SELECT * FROM comments WHERE article_id = $1`,[id])
    .then((result) => {
        if (articles.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'No article found with that id'
            })
        }
        return result.rows;
    })
}

exports.addComment = (articleId, author, body) => {

    return db.query(`INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *`,[body,articleId,author])
    .then((result) => {
        return result.rows[0]
    })
}