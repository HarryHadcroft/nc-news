const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const { updatedArticlebyId } = require("../models/articles.model");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET/api/topics", () => {
  test("should return a status code 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(response.body.topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("should return appropriate error when endpoint misspelled", () => {
    return request(app)
      .get("/api.topcs")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Cannot find path");
      });
  });
});

describe("GET/api", () => {
  test("Should return a 200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  test("Should return an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.allEndpoints).toEqual(endpoints);
      });
  });
});

describe("GET/api/atricles/:article_id", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles/3").expect(200);
  });
  test("should return an article object corresponding to id input", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 3,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("should return appropriate error and message when passed a valid but non-existant article ID", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("not found");
      });
  });
  test("should return appropriate error and message when passed an invalid article ID", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("bad request");
      });
  });
});

describe("GET/api/articles", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("should return an array of articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return an array of articles matching the specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("STATUS - 400: should return appropriate error when passed an invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=switch")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("STATUS - 400: should return an appropriate error when passed an invalid query parameter", () => {
    return request(app)
      .get("/api/articles?author=rogersop")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("STATUS - 400: should return appropriate error when passed an empty topic query", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  describe("GET/api/articles/:article_id/comments", () => {
    test("should return a status code 200", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });
    test("should return an array of comments for the given article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(11);
          response.body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            });
          });
        });
    });
    test("should return an array of comments for the given article ordered by date created descending", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("should return an array of comments for the given article ordered by votes descending", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&&order=DESC")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    test("should return an array of comments for the given article ordered by author alphabetically", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author&&order=ASC")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toBeSortedBy("author", {
            descending: false,
          });
        });
    });
    test("should return an empty array when given an article_id that exists but has no comments", () => {
      return request(app)
        .get("/api/articles/13/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(0);
        });
    });
    test("should return appropriate error when passed a valid but non existant article ID ", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("not found");
        });
    });
    test("should return an appropriate error when passed an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=id")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("should return an appropriate error when passed an invalid order query", () => {
      return request(app)
        .get("/api/articles/1/comments?order=lowest")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
  });

  describe("POST/api/articles/:article_id/comments", () => {
    test("STATUS - 201: should add a new comment to the specified article and return the new comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "rogersop", body: "Very interesting" })
        .expect(201)
        .then((response) => {
          expect(response.body.newComment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Very interesting",
            article_id: 2,
            author: "rogersop",
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("STATUS - 400: Should return an appropriate error when passed an empty body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 400: should return appropriate error when passed invalid key in body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "rogersop", comment: "Very interesting" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 400: should return appropriate error when passed a body with too many keys", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "rogersop", comment: "Very interesting", age: 40 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 400: should return appropriate error when not passed a body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 404: should return appropriate error when passed a valid but non-existant article ID ", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({ username: "rogersop", body: "Very interesting" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("not found");
        });
    });
    test("STATUS - 404: should return appropriate error when passed a user not present in the database", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "baz", body: "Very interesting" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("not found");
        });
    });
  });

  describe("PATCH/api/articles/:article_id", () => {
    test("STATUS - 200: should update specified article with data passed in and return the updated article", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          expect(response.body.updatedArticle).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 3,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 10,
            article_img_url: expect.any(String),
          });
        });
    });
    test("STATUS - 404: should return an appropriate error when passed a valid but non-existant article ID", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("not found");
        });
    });
    test("STATUS - 400: should return appropriate error when not passed a body", () => {
      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 400: should return appropriate error when passed an invalid body format", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 10, username: "rogersop" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
    test("STATUS - 400: should return appropriate error when passed an empty body ", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
  });

  describe("DELETE/api/comments/:comment_id", () => {
    test("STATUS - 204: should return status code 204 and no content", () => {
      return request(app)
        .delete("/api/comments/4")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
    test("STATUS - 404: should return an appropriate error when passed a valid but non-existant comment ID", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("not found");
        });
    });
    test("STATUS - 400: should return appropriate error when passed an invalid comment ID", () => {
      return request(app)
        .delete("/api/comments/invalid-id")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("bad request");
        });
    });
  });

  describe("GET/api/users", () => {
    test("STATUS - 200: should return an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users.length).toBe(4);
          response.body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    test("STATUS - 404: should return appropriate error when passed invalid endpoint", () => {
      return request(app)
        .get("/api/uzers")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Cannot find path");
        });
    });
  });
});
