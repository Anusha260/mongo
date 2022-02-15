const express = require('express');
const router = express.Router();
// @routen GET api/posts
// @desc Test route
//@accesss public
router.get('/', (req, res) => res.send('posts route'));
module.exports = router;
//routes.js