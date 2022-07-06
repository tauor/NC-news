const {selectTopics, 
    selectArticleById,
    changeArticleVotesById,
    selectUsers,
    selectArticles,
    selectArticlesComments
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
    selectArticles().then((articles) => {
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

