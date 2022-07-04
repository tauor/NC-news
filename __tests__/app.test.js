const request = require("supertest")
const app = require('../app.js');
const db = require('../db/connection.js');

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
});

describe.only('app - error handling', () => {
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
});