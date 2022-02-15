const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { body } = require('express-validator')
const { check, validationResult } = require('express-validator/check');
const { JsonWebTokenError } = require('jsonwebtoken');
const auth = require('../../middleware/auth');
// @routen GET api / auth
// @desc Authenticate user & get token
//@accesss public

router.get('/', auth, (req, res) => res.send('Auth route'));
module.exports = router;
router.post('/', [

        check('email', 'please include a valid email').isEmail(),
        check(
            "password",
            "password is required"
        ).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] })
            }

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
                })


            // Return jsonwebtoken
            // res.send('User Registered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error')

        }

    });
router.get('/', auth, (req, res) => res.send('Auth route'));
module.exports = router;