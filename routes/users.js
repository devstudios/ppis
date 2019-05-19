const express = require('express');
const router = express.Router();

let signUpController = require('../controllers/userController').signUpController;

/* POST users listing. */
router.post('/register', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
