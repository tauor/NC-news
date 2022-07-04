const express = require('express');
const app = express();
app.use(express.json());

const {getTopics, getArticleById, updateArticleVotes} = require('./controller/controller.js')

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', updateArticleVotes);




app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }else if (err.code === '22P02'){
        res.status(400).send({msg: 'Bad request'});
    }else{
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});
  



  
module.exports = app;
