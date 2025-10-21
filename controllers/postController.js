const Post = require('../models/postsModel');
exports.getAllPosts = async (req, res) => { 
    try {
        let pageNum=0;
        const {page} = req.query;
        const postsPerPage = 10;
        if (page<=1) {
            pageNum=0
        }
        else{
            pageNum = (page - 1);
        }
        const posts = await Post.find()
            .skip(pageNum * postsPerPage)
            .limit(postsPerPage)
            .sort({ createdAt: -1 })
            .populate({ path: 'userId', select: 'email' });
        res.status(200).json({ success: true, message: 'All posts retrieved successfully', data: posts });
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }   
}

exports.createPost = async (req, res) => { 
    const {title, description} = req.body;
    const {id} = req.user;
    try {
        const result = await Post.create({
            title,
            description,
            userId: id
        });
        res.status(201).json({ success: true, message: 'Post created successfully', data: result });
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }   
}

exports.getSinglePost = async (req, res) => { 
    const {_id} = req.query;
    try {
        const result = await Post.findOne({_id})
       .populate({ path: 'userId', select: 'email' });
        if (!result) {

            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Single post retrieved successfully', data: result });
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }   
}

exports.updatePost = async (req, res) => { 
    const {title, description} = req.body;
    const {_id} = req.query;
    const {id} = req.user;
    try {
        const existingPost = await Post.findOne(
            { _id }
        );
        if (!existingPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (existingPost.userId.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this post' });
        }
        existingPost.title = title;
        existingPost.description = description;
        await existingPost.save();

        res.status(200).json({ success: true, message: 'Post updated successfully', data: existingPost });
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }   
}

exports.deletePost = async (req, res) => { 
    const {_id} = req.query;
    const {id} = req.user;
    try {
        const existingPost = await Post.findOne(
            { _id }
        );
        if (!existingPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (existingPost.userId.toString() !== id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
        }
        await existingPost.deleteOne({ _id });

        res.status(200).json({ success: true, message: 'Post deleted successfully'});
    }   
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error', data: err.message });
    }   
}
