const Blog = require('../models/blog');
const blogRouter = require('express').Router();

blogRouter.get('/', async (_, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findOne({'_id':request.params.id});
    response.json(blog.toJSON());
});

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
    const body = request.body;
    let blog = await Blog.findById(request.params.id);
    blog = blog.toJSON();
    const newblog = {
        title: blog.title,
        author: blog.author,
        author: blog.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newblog, { new: true });
    response.json(updatedBlog);
})

module.exports = blogRouter;