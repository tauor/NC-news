const usersRouter = require('express').Router();
const {selectUsers, selectUserByUsername} = require('../model/model.js');

usersRouter.get('/',(req,res,next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch(next);
})

usersRouter.get('/:username',(req,res,next) => {
    const {username} = req.params;
    selectUserByUsername(username).then((user) => {
        res.status(200).send({user});
    })
    .catch(next);
})


module.exports = usersRouter;