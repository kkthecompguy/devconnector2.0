const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const router = express.Router();


// @route GET api/auth
// @desc Get auth token
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    return res.status(200).json(user);

  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});


// @route POST api/auth
// @desc Authenticate user and get token
// @access Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {email, password } = req.body;

  try {
    const user =  await User.findOne({ email });

    if (!user) return res.status(400).json({ errors:  [{  msg: 'Invalid Credentials' }] });

    if (!user.active) return res.status(400).json({ errors: [{ msg: 'Your account is deactivated. Please consult the site admin to activate' }] });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ errors: [{  msg: 'Invalid Credentials'  }] });

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jsonSecret'), { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token })
    })

  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
})

module.exports = router;