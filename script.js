const express = require("express")

const router = express.Router();
// @route GET api / user
// @desc   Test route
// @access   public
router.get('/', (res, user) => user.send('user route'));