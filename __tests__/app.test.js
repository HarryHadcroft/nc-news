const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")


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

describe('GET/api', () => {
    test('Should return a 200 status code', () => {
        return request(app)
        .get("/api")
        .expect(200)
    });
    test('Should return an object describing all available endpoints', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(endpoints)
        })
    });
    test('should return appropriate error when endpoint is mis-typed', () => {
        return request(app)
        .get("/ap")
        .expect(404)
        .then((response) => {
            const error = response.body
            expect(error.msg).toBe("Cannot find path")
        })
    });
});

describe('GET/api/atricles/:article_id', () => {
    test('should return a 200 status code', () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
    });
    test('should return an article object corresponding to id input', () => {
        return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
            const article = response.body.article
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 3,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    });
    test('should return appropriate error and message when passed a valid but non-existant article ID', () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
            const error = response.body
            console.log(error)
            expect(error.msg).toBe("Article does not exist")
        })
    });
    test('should return appropriate error and message when passed an invalid article ID', () => {
        return request(app)
        .get("/api/articles/invalid-id")
        .expect(400)
        .then((response) => {
            const error = response.body
            console.log(error)
            expect(error.msg).toBe("Bad request")
        })
    });
});