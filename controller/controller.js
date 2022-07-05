const {selectTopics, 
    selectArticleById,
    changeArticleVotesById,
    selectUsers,
    selectArticles
    } = require('../model/model.js')


exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
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

exports.getUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    })
}

exports.getArticles = (req, res) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles});
    })
}

