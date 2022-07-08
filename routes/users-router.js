const usersRouter = require('express').Router();
const {selectUsers} = require('../model/model.js');

usersRouter.get('/',(req,res,next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch(next);
})

module.exports = usersRouter;