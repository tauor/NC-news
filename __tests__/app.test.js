const request = require("supertest")
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    db.end();
});


describe('app', () => {
    describe('GET /api/topics', () => {
        test('Should return json of the topics with status 200', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                const topics = body.topics;
                expect(topics).toBeInstanceOf(Array);
                expect(topics.length > 0).toBeTruthy()
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    );
                });
            });
        });
        test('should return error message with 404 for invalid path', () => {
            return request(app)
            .get('/api/carrots')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Route not found');
            })
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('Should return json of an article with the corresponding id, including a comment count and staus 200', () => {
            const idToSearch = 3;
            return request(app)
            .get(`/api/articles/${idToSearch}`)
            .expect(200)
            .then(({body}) => {
                const article = body.article;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: idToSearch,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 0,
                        comment_count: 2
                    })
                );
            });
        });
        test('should return error message with 400 for bad request', () => {
            return request(app)
            .get('/api/articles/carrots')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            })
        });
        test('should return error message with 404 for invalid article id', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('No article found with that id');
            })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('Can add votes to corresponding article and return json of updated article with status 200', () => {
            const idToPatch = 3;
            const patchData = {inc_votes: 12}
            return request(app)
            .patch(`/api/articles/${idToPatch}`)
            .send(patchData)
            .expect(200)
            .then(({body}) => {
                const article = body.article;
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: idToPatch,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 12
                    })
                )
            });
        });
        test('Can subtract votes to corresponding article and return json of updated article with status 200', () => {
            const idToPatch = 1;
            const patchData = {inc_votes: -60}
            return request(app)
            .patch(`/api/articles/${idToPatch}`)
            .send(patchData)
            .expect(200)
            .then(({body}) => {
                const article = body.article;
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: idToPatch,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 40,
                    })
                )
            });
        });
        test('should return error message with 404 for invalid path', () => {
            const patchData = {votes: 12}
            return request(app)
            .patch('/api/articles/3')
            .send(patchData)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Invalid request body');
            })
        });
        test('should return error message with 404 for invalid path', () => {
            const patchData = {inc_votes: 12}
            return request(app)
            .patch('/api/articles/9999')
            .send(patchData)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('No article found with that id');
            })
        });
    });
    describe('GET /api/users', () => {
        test('Should return json of the users with status 200', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                const users = body.users;
                expect(users).toBeInstanceOf(Array);
                expect(users.length === 4).toBeTruthy();
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    )
                })
            });
        });
        test('should return error message with 404 for invalid path', () => {
            return request(app)
            .get('/api/carrots')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Route not found');
            })
        });
    });
    describe('GET /api/articles', () => {
        test('Should return json of the articles, orderd by date in descending order with status 200', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const articles = body.articles;
                expect(articles).toBeInstanceOf(Array);
                expect(articles.length === 12)
                expect(articles).toBeSortedBy('created_at',{descending:true});
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    )
                })
            });
        });
        test('should return error message with 404 for invalid path', () => {
            return request(app)
            .get('/api/carrots')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Route not found');
            })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('Should return json of comments related to that article with status 200', () => {
            const idToSearch = 9
            return request(app)
            .get(`/api/articles/${idToSearch}/comments`)
            .expect(200)
            .then(({body}) => {
                const comments = body.comments;
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length === 2).toBeTruthy();
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            article_id: idToSearch,
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String)
                        })
                    )
                })
            });
        });
        test('if an article has no comments responds with empty array and status 200', () => {
            const idToSearch = 10
            return request(app)
            .get(`/api/articles/${idToSearch}/comments`)
            .expect(200)
            .then(({body}) => {
                const comments = body.comments;
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length === 0 ).toBeTruthy();
                expect(comments).toEqual([]);
            });
        });
        test('should return error message with 400 for bad request', () => {
            return request(app)
            .get('/api/articles/carrots/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            })
        });
        test('should return error message with 404 for invalid article id', () => {
            return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('No article found with that id');
            })
        });
    });
    describe('POST /api/articles/:article_id/comments', () => {
        test('Should post a new comment to comments with the specifed article, respond with the json of that comment and status 201', () => {
            const idToPost = 9
            const commentToPost = {
                username: 'rogersop',
                body: 'test comment :)'
            }
            return request(app)
            .post(`/api/articles/${idToPost}/comments`)
            .send(commentToPost)
            .expect(201)
            .then(({body}) => {
                const comment = body.comment;
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: 19,
                        body: 'test comment :)',
                        article_id: idToPost,
                        author: 'rogersop',
                        votes: 0,
                        created_at: expect.any(String)
                    })
                )
            }).then(() => {
                return db.query('SELECT * FROM comments WHERE comment_id = 19')
                .then((addedComment) => {
                    expect(addedComment.rows.length === 1).toBeTruthy();
                })
            })
        });
        test('should return error message with 404 for invalid article id', () => {
            const commentToPost = {
                username: 'rogersop',
                body: 'test comment :)'
            }
            return request(app)
            .post('/api/articles/9999/comments')
            .send(commentToPost)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('No article found with that id');
            })
        });
        test('should return error message with 400 for invalid username', () => {
            const commentToPost = {
                username: 'tom',
                body: 'test comment :)'
            }
            return request(app)
            .post('/api/articles/9/comments')
            .send(commentToPost)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('No user with that username');
            })
        });
    });
});
