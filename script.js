const express = require("express")
const router = express.Router();
// @route GET api / user
//@desc   Test route
//@access   public
router.get('/', (res, res) => user.send('user route'));