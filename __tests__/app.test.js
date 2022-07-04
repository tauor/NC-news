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
                expect(topics.length === 3).toBeTruthy()
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
});