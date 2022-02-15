const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
    // const { body } = require('express-validator')
const { check, validationResult } = require('express-validator/check');
const { JsonWebTokenError } = require('jsonwebtoken');
const User = require("../../models/User");
// @route POST api / users
// @desc Register user
//@access Public
router.post('/', [check('name', 'Name is required')
        .not()
        .isEmpty(),
        check('email', 'please include a valid email').isEmail(),
        check(
            "password",
            "please enter a password with 6 or more characters"
        ).isLength({ min: 6, max: 12 }),
        check('password').custom((password, { req }) => {
            if (password !== req.body.passwordConfirmation) {
                throw new Error('Password confirmation is incorrect');
            }
            return true
        }),
        check("email").custom(async(email, { req }) => {
            let user = await User.findOne({ email })
            if (user) {
                throw new Error("email is already exist")
            }
            return true
        })

    ],
    async(req, res) => {
        const errors = validationResult(req);
        const { name, email, password } = req.body;
        try {

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            user = new User({
                name,
                email,
                avatar,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)
            await user.save();
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });




            // Return jsonwebtoken
            // res.send('User Registered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')

        }

    });

module.exports = router;