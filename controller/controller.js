const {selectTopics, 
    selectArticleById,
    changeArticleVotesById,
    selectUsers,
    selectArticles,
    selectArticlesComments,
    addComment,
    removeComment
    } = require('../model/model.js')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.updateArticleVotes = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    changeArticleVotesById(article_id, inc_votes).then((article) => {
        res.status(200).send({article});
    })
    .catch(next);
}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query;
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next);
}

exports.getArticlesComments = (req, res, next) => {
    const {article_id} = req.params;
    selectArticlesComments(article_id).then((comments) => {
        res.status(200).send({comments});
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const {username, body} = req.body;
    addComment(article_id, username, body).then((comment) => {
        res.status(201).send({comment});
    })
    .catch(next);
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send();
    })
    .catch(next);
}

