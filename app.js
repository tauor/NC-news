const express = require('express');
const app = express();
app.use(express.json());

const {PSQLErrors, customErrors, unhandledErrors, routeError} = require('./handlers/error-handlers.js')

const apiRouter = require('./routes/api-router.js');
const topicsRouter = require('./routes/topics-router.js');
const articlesRouter = require('./routes/articles-router.js');
const usersRouter = require('./routes/users-router.js');
const commentsRouter = require('./routes/comments-router.js');
    

app.use('/api', apiRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);


app.use(PSQLErrors);
app.use(customErrors);
app.use(unhandledErrors);

app.all('/*', routeError);   



  
module.exports = app;
