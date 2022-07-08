const articlesRouter = require('express').Router();
const {selectArticles, 
    selectArticleById, 
    selectArticlesComments,
    changeArticleVotesById,
    addComment
    } = require('../model/model.js');


articlesRouter.get('/', (req,res,next) => {
    const {sort_by, order, topic} = req.query;
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next);
})


articlesRouter
    .route('/:article_id')
    .get((req,res,next) => {
        const {article_id} = req.params;
        selectArticleById(article_id).then((article) => {
            res.status(200).send({article});
        })
        .catch(next);
    })
    .patch((req,res,next) => {
        const {article_id} = req.params;
        const {inc_votes} = req.body;
        changeArticleVotesById(article_id, inc_votes).then((article) => {
            res.status(200).send({article});
        })
        .catch(next);
    })


articlesRouter 
    .route('/:article_id/comments')
    .get((req,res,next) => {
        const {article_id} = req.params;
        selectArticlesComments(article_id).then((comments) => {
            res.status(200).send({comments});
        })
        .catch(next);
    })
    .post((req,res,next) => {
        const {article_id} = req.params;
        const {username, body} = req.body;
        addComment(article_id, username, body).then((comment) => {
            res.status(201).send({comment});
        })
        .catch(next);
    })

module.exports = articlesRouter;

