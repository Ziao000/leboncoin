const Post = require('../models/post.model');
const UploadFileModel = require('../models/uploadFile.model');
const uploadOneFileInAws = require('../utils/aws-s3');
const mongoose = require('mongoose');

const PostController = {
    async createPost(req, res) {
        const { title, content, address, city, postalCode, latitude, longitude } = req.body;

        try {
            const post = new Post({
                title,
                content,
                address,
                city,
                postalCode,
                latitude,
                longitude
            });
            await post.save();

            await Promise.all(req.files.map(async (file) => {

                const uploadFileInAws = await uploadOneFileInAws(file, post._id);
                const uploadFile = new UploadFileModel({
                    ...uploadFileInAws,
                    post: post._id
                });
                await uploadFile.save();
                post.uploadFiles.push(uploadFile);
            }));

            await post.save();

            res.status(201).send(post);
        } catch (error) {
            res.status(409).send({ message: error.message });
        }
    },
    async getPosts(req, res) {
        const posts = await Post.find().populate('uploadFiles');
        res.status(200).send(posts);
    },
    async getPost(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findById(id).populate('uploadFiles');
            res.status(200).send(post);
        } catch (error) {
            res.status(404).send({ message: error.message });
        }
    },
    async updatePost(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        const { title, content, address, city, postalCode, latitude, longitude } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            content,
            address,
            city,
            postalCode,
            latitude,
            longitude
            }, { new: true });
            if (!updatedPost) {
                return res.status(404).send(`No post with id: ${id}`);

                
        }

        try {
            await updatedPost.save();
            res.status(200).send(updatedPost);
        } catch (error) {
            res.send(409).send({ message: error.message })
        }
    },
    async deletePost(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        await Post.findByIdAndRemove(id);
        res.status(200).send({ message: 'Post deleted successfully.' });
    }
}

module.exports = PostController