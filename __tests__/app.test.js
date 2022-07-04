const request = require("supertest")
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data')

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    db.end();
});


describe('app - working', () => {
    describe('GET /api/topics', () => {
        test('Should return json of the topics with status 200', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                topics = body.topics;
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
    });
    describe('GET /api/articles/:article_id', () => {
        test('Should return json of an article with the corresponding id and staus 200', () => {
            const idToSearch = 3;
            return request(app)
            .get(`/api/articles/${idToSearch}`)
            .expect(200)
            .then(({body}) => {
                article = body.article;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: idToSearch,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                );
            });
        });
    });
    describe.only('PATCH /api/articles/:article_id', () => {
        test('Should return json of aupdated article and status 200', () => {
            const idToPatch = 3;
            const patchData = {inc_votes: 12}
            return request(app)
            .patch(`/api/articles/${idToPatch}`)
            .send(patchData)
            .expect(200)
            .then(({body}) => {
                article = body.article;
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
    });
});

describe('app - error handling', () => {
    describe('GET /api/carrots', () => {
        test('should return error message with 404 for invalid path', () => {
            return request(app)
            .get('/api/carrots')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Route not found');
            })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('should return error message with 404 for invalid path', () => {
            const patchData = {inc_votes: 12}
            return request(app)
            .patch('/api/articles/99999')
            .send(patchData)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('no article with that id');
            })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('should return error message with 404 for invalid path', () => {
            const patchData = {votes: 12}
            return request(app)
            .patch('/api/articles/3')
            .send(patchData)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('invalid request body');
            })
        });
    });
});