const express = require("express")

const router = express.Router();
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")

// const { body } = require("express-validator")

const User = require("../../models/User")


// @route   post api/users
// @desc    registerconst gravatar = require("gravatar")
// const bc user
// @access  public
router.post("/", [
        check("name", "Name is required") // with rout we can listen another routes
        .not()
        .isEmpty(),
        check("email", "please include a valid email").isEmail(),
        check(
            "password",
            "please enter a password with 6 or more characters"
        ).isLength({ min: 6, max: 12 }),

        //    confirmation code
        check("password").custom((password, { req }) => {
            if (password !== req.body.passwordconfirmation) {
                throw new Error("password confirmation is incorrect")
            }
            return true
        }),
        // email checking
        check("email").custom(async(email) => {
            const user = await User.findOne({ email })
            if (user) {
                throw new Error("email is already exist")
            }
            return true
        })

    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return;
        }

        const { name, email, password } = req.body;

        try {
            // see if user exists

            // get user gravatar
            const avatar = gravatar.url(email, {
                s: "200", // size defaultfindOne
                r: "pg", // rating
                d: "mm" // default mm(default image like a user icon)
            })

            const user = new User({
                    name,
                    email,
                    avatar,
                    password
                })
                // token
                // encrypt password by using bcrypt
            const salt = await bcrypt.genSalt(10); // 10 how much we will give that much it is protected

            user.password = await bcrypt.hash(password, salt)

            await user.save();
            // return json webtoken
            // res.send("user registered");
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get("jwtSecret"), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })

        } catch (err) {
            console(err.message);
            res.status(500).send("server error");


        }
    })
module.exports = router;