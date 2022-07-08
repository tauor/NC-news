const commentsRouter = require('express').Router();
const {removeComment} = require('../model/model');

commentsRouter.delete('/:comment_id', (req,res,next) => {
    const {comment_id} = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send();
    })
    .catch(next);
})

module.exports = commentsRouter;