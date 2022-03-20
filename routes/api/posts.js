const express = require("express")

const router = express.Router();
const { check, validationResult } = require("express-validator")
const auth = require("../../middleware/auth")

const Post = require("../../models/Post")
    // const Profile = require("../../models/Profile")
const User = require("../../models/User")
    // @route POST api/posts
    // @desc Create a post
    // @access Private
router.post("/",
    auth, [
        check("text", "Text is required").not().isEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select("-password")
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save()
            res.json(post)
        } catch (err) {
            console(err.message);
            res.status(500).send("Server Error")
        }
    });

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get("/", auth, async(req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console(err.message);
        res.status(500).send("Server Error")
    }
})

// @route GET api/posts/:id
// @desc Get post by ID
// @access Private
router.get("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post)

        // 
    } catch (err) {
        console(err.message);

        res.status(500).send("Server Error")
    }
});
router.post("/",
    auth, [
        check("text", "Text is required").not().isEmpty()
    ],
    async(req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(400).json({ errors: error.array() })
        }
        try {
            const user = await User.findById(req.user.id).select("-password")
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save()
            res.json(post)
        } catch (err) {
            console(err.message);
            res.status(500).send("Server Error")
        }
    });

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private
router.delete("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ msg: 'post not found' })
            return;
        }


        // check user
        if (post.user.toString() !== req.user.id) {
            res.status(401).json({ msg: "User not autherized" })
            return;
        }

        await post.remove();

        res.json({ msg: "post removed" })
    } catch (err) {
        console(err.message);
        if (err.kind === 'ObjectId') {
            res.status(404).json({ msg: 'post not found' })

        }
        res.status(500).send("Server Error")
    }
})

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put("/like/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            res.status(400).json({ msg: "post already liked" })
            return;
        }
        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (err) {
        console(err.message);
        res.status(500).send("Server Error");
    }
})

// @route PUT api/posts/unlike/:id
// @desc Like a post
// @access Private
router.put("/unlike/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            res.status(400).json({ msg: "post has not yet been liked " })
            return;
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1);

        await post.save()

        res.json(post.likes)
    } catch (err) {
        console(err.message);
        res.status(500).send("Server Error");
    }
})


// @route POST api/posts/comment/:id
// @desc comment on  a post
// @access Private
router.post("/comment/:id",
    auth, [
        check("text", "Text is required").not().isEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select("-password")

            const post = await Post.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment)

            await post.save()

            res.json(post.comments)
        } catch (err) {
            console(err.message);
            res.status(500).send("Server Error")
        }
    });

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Delete comment
// @access Private
router.delete("/comment/:id/:comment_id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // pull out the comment
        const comment = post.comments.find(comments => comments.id === req.params.comment_id)

        if (!comment) {
            res.status(404).json({ msg: "Comment does not exist" })
            return;
        }

        // check user
        if (comment.user.toString() !== req.user.id) {
            res.status(401).json({ msg: "User not authorized" })

        }

        // Get remove index
        const removeIndex = post.comments.map(like => like.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex, 1);

        await post.save()

        res.json(post.comments)
    } catch (err) {
        console(err.message);
        res.status(500).send("Server Error")
    }
});


module.exports = router;