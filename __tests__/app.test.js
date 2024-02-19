const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")


afterAll(() => {
    db.end()
})

describe('GET/api/topics', () => {
    test('should return a status code 200', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
    });
    test('should return an array of topic objects', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3)
            const topics = response.body.topics
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
    test('should return appropriate error when endpoint misspelled', () => {
        return request(app)
        .get("/api.topcs")
        .expect(404)
        .then((response) => {
            const error = response.body
            expect(error.msg).toBe("Cannot find path")
        })
    });
});