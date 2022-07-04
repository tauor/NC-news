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
  console.log(err);
  res.sendStatus(500);
});
  
module.exports = app;
