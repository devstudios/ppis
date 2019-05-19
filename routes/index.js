const express = require('express');
const router = express.Router();

let addUserController = require('../controllers/userController').addUserController;
let upgradeUserController = require('../controllers/userController').upgradeUserController;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CHR | Welcome' });
});

/* GET adduser. */
router.get('/adduser', function (req, res, next) {
  res.render('adduser', { title: 'CHR | Register' });
});

/* POST adduser */
router.post('/adduser', addUserController);

/* GET upgradeuser. */
router.get('/upgrade', function (req, res, next) {
  res.render('upgrade', { title: 'CHR | Upgrade' });
});

/* POST upgradeuser */
router.post('/upgrade', upgradeUserController);

module.exports = router;
