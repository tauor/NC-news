const topicsRouter = require('express').Router();
const {selectTopics} = require('../model/model.js')

topicsRouter.get('/', (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
})

module.exports = topicsRouter;
