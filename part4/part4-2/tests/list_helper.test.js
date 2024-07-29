// tests/list_helper.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    const blogs = [];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const blogs = [{ title: 'Blog1', author: 'Author1', likes: 5 }];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog1', author: 'Author1', likes: 5 },
      { title: 'Blog2', author: 'Author2', likes: 10 },
      { title: 'Blog3', author: 'Author3', likes: 15 },
    ];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 30);
  });
});

describe('favoriteBlog', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, equals that blog', () => {
    const blogs = [{ title: 'Blog1', author: 'Author1', likes: 5 }];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[0]);
  });

  test('of a bigger list is the blog with most likes', () => {
    const blogs = [
      { title: 'Blog1', author: 'Author1', likes: 5 },
      { title: 'Blog2', author: 'Author2', likes: 10 },
      { title: 'Blog3', author: 'Author3', likes: 15 },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[2]);
  });
});

describe('mostBlogs', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = listHelper.mostBlogs(blogs);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, equals the author of that blog', () => {
    const blogs = [{ title: 'Blog1', author: 'Author1', likes: 5 }];
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: 'Author1', blogs: 1 });
  });

  test('of a bigger list is the author with most blogs', () => {
    const blogs = [
      { title: 'Blog1', author: 'Author1', likes: 5 },
      { title: 'Blog2', author: 'Author1', likes: 10 },
      { title: 'Blog3', author: 'Author3', likes: 15 },
      { title: 'Blog4', author: 'Author2', likes: 7 },
      { title: 'Blog5', author: 'Author3', likes: 8 },
      { title: 'Blog6', author: 'Author3', likes: 9 },
    ];
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: 'Author3', blogs: 3 });
  });
});

describe('mostLikes', () => {
  test('of empty list is null', () => {
    const blogs = [];
    const result = listHelper.mostLikes(blogs);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, equals the likes of that blog', () => {
    const blogs = [{ title: 'Blog1', author: 'Author1', likes: 5 }];
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: 'Author1', likes: 5 });
  });

  test('of a bigger list is the author with most likes', () => {
    const blogs = [
      { title: 'Blog1', author: 'Author1', likes: 5 },
      { title: 'Blog2', author: 'Author2', likes: 10 },
      { title: 'Blog3', author: 'Author3', likes: 15 },
      { title: 'Blog4', author: 'Author1', likes: 7 },
      { title: 'Blog5', author: 'Author3', likes: 8 },
      { title: 'Blog6', author: 'Author3', likes: 9 },
    ];
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: 'Author3', likes: 32 });
  });
});
