const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route  POST api/posts
// @desc   create post
// @access Private

router.post("/", [auth,
 [ 
  check('text', 'Text is required').not().isEmpty()
 ]
],  async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()})
  }

  try {
  const user = await User.findById(req.user.id).select('-password');

  const newPost = new Post ({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async(req, res) => {
try {
  const posts = await Post.find().sort({date: -1});
  res.json(posts);
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
  }
});


// @route  GET api/posts/:id
// @desc   Get posts by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
   
    if(!posts) return res.status(404).json({ msg: 'Post not found'});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
     
    return res.status(404).json({ msg: 'Post not found' });
  }
}
});
// @route  DELETE api/posts/:id
// @desc   Delete posts by id
// @access Private
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     x = await Post.findOneAndRemove({_id:req.params.id});
//     console.log(x);
//     res.json({ msg: 'Post deleted' });
//   } catch(err){
//     console.error(err.message)
//     if (err.kind === 'ObjectId')
//       return res.status(404).json({ msg: 'Post not found' });
//   }
// });

router.delete('/:id', auth, async (req, res) => {
  try {
  const post = await Post.findById(req.params.id); 
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    //check user
  if(post.user.toString() !== req.user.id) {
    return res.status(401).json({msg: 'User not authorized'});
  }
    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch(err){
    console.error(err.message);
    if (err.kind === 'ObjectId')
    return res.status(404).json({ msg: 'Post not found' });
  }
});


// @route  PUT api/posts/like/:post_id
// @desc   Find the post and like
// @access Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    console.log(req.params.post_id);
    //Check if this post has already been liked this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      
      return res.status(400).json({ msg: 'Post already liked' });
    }
   
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/posts/unlike/:post_id
// @desc   Find the post and unlike
// @access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    console.log(post);
    console.log(req.params.post_id);
    //Check if this post has already been liked this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
    return res.status(400).json({ msg: 'Post has not yet been liked'});
    }
    // Get the index of like to be undone
    const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  POST api/posts/comment/:post_id
// @desc   Comment on a post
// @access Private
router.post('/comment/:post_id', [auth,
  [
    check('text', 'Text is required').not().isEmpty()
  ]
], async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);
    console.log(post);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };
    console.log(newComment);

    post.comments.unshift(newComment);
   
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc   Delete comment
// @access Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
try {
    //const post = await Post.findOne({_id:req.params.post_id});
    const post = await Post.findById(req.params.post_id);

    //Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    console.log(comment);
    // const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);


    //Make sure comment exists
    if(!comment) {
      return res.status(404).json({ msg: 'Comment does not exist'})
    }

    //Check user
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'You are not authorized'});
    }
    //Get remove index
    //const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
    // const removeIndex = post.comments.map(comment => comment.txt).indexOf(req.params.comment_id);
    const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
