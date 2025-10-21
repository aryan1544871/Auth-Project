const express = require('express');
const router = express.Router();
const { identifier } = require('../middlewares/identification');
const postController = require('../controllers/postController');

router.get('/all-posts', postController.getAllPosts);
router.get('/single-post', postController.getSinglePost);
router.post('/create-post',identifier, postController.createPost);
router.put('/update-post',identifier, postController.updatePost);
router.delete('/delete-post',identifier, postController.deletePost);

module.exports = router;