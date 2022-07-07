const express = require('express');
const app = express();
app.use(express.json());

const {getTopics, 
    getArticleById, 
    updateArticleVotes, 
    getUsers,
    getArticles,
    getArticlesComments,
    postComment,
    deleteComment
    } = require('./controller/controller.js')
    
const {PSQLErrors, customErrors, unhandledErrors, routeError} = require('./handlers/error-handlers.js')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getArticlesComments);

app.patch('/api/articles/:article_id', updateArticleVotes);

app.post('/api/articles/:article_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment)


app.all('/*', routeError); 

app.use(PSQLErrors);
app.use(customErrors);
app.use(unhandledErrors);

  



  
module.exports = app;
