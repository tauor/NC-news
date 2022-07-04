const {selectTopics, selectArticleById} = require('../model/model.js')


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

