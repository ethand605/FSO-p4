const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
})
describe('when there is initially blogs saved', () => {
    test('correct number of blogs are returned', async () => {
        const blogsAtStart = await helper.blogsInDb();
        expect(blogsAtStart.length).toBe(helper.initialBlogs.length);
    })

    test('the id field is defined', async () => {
        const blogsAtStart = await helper.blogsInDb();
        expect(blogsAtStart[0].id).toBeDefined();
    })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'test blog',
            author: 'test author',
            url: '123.com',
            likes: 2
        };
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201);
        
        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);
    })
})

describe('update likes of a blog', () => {
    test('successed with status 204 if ID is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogtoUpdate = blogsAtStart[0];

        await api
            .put(`/api/blogs/${blogtoUpdate.id}`)
            .send({likes: 100})
            .expect(200);


        const updatedBlog = await helper.blogById(blogtoUpdate.id);
        expect(updatedBlog.likes).toBe(100);
        
    })
})

describe('deletion of a blog', () => {
    test('successed with status 204 if ID is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogtoDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogtoDelete.id}`)
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

        const contents = blogsAtEnd.map(r => r.title);
        expect(contents).not.toContain(blogtoDelete.title);
    })
})




afterAll(() => {
    mongoose.connection.close();
})