const db = require('../db/connection.js');

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

exports.selectArticles = (sort_by, order, topic) => {
    if (sort_by === undefined){
        sort_by = 'created_at'
    }
    if (order === undefined){
        order = 'desc'
    }
    //console.log(order)
    if (order !== 'asc' && order !== 'desc'){
        return Promise.reject({
            status: 400,
            msg: 'Bad order request'
        })
    }
    //console.log(sort_by, order, topic)
    if (topic === undefined){
        return db.query(`SELECT articles.*, COUNT (*) :: int AS comment_count
        FROM articles 
        FULL JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order}`)
        .then((result) => {
            return result.rows;
        })
    }else{
        return db.query(`SELECT articles.*, COUNT (*) :: int AS comment_count
        FROM articles 
        FULL JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.topic = $1
        GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order}`,[topic])
        .then((result) => {
            if (result.rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: 'No topic with that name'
                })
            }
            return result.rows;
        }) 
    }
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

exports.addComment = async (articleId, author, body) => {
    if (author === undefined || body === undefined){
        return Promise.reject({
            status: 400,
            msg: 'Bad request'
        })
    }
    const articles = await db.query(`SELECT * FROM articles WHERE article_id = $1`,[articleId]);
    if (articles.rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: 'No article found with that id'
        })
    }
    const users = await db.query(`SELECT * FROM users WHERE username = $1`,[author]);
    if (users.rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: 'No user with that username'
        })
    }
    return db.query(`INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *`,[body,articleId,author])
    .then((result) => {
        return result.rows[0]
    })
}

exports.removeComment = async (idToDelete) => {
    const comments = await db.query(`SELECT * FROM comments WHERE comment_id = $1`,[idToDelete])
    if (comments.rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: 'No article found with that id'
        })
    }
    return db.query(`DELETE FROM comments WHERE comment_id = $1`,[idToDelete])
}