exports.routeError = (req,res) => {
    res.status(404).send({ msg: 'Route not found' });
    next(err)
}

exports.PSQLErrors = (err, req,res, next) => {
    if (err.code === '22P02' || err.code === '42703'){
        res.status(400).send({msg: 'Bad request'});
    }
    next(err)
}

exports.customErrors = (err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
    next(err);
}

exports.unhandledErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
}


