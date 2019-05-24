const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Cart = require('../models/cart');
const Payment = require('../models/payment');

const csrfProtection = csrf();
router.use(csrfProtection);

let addUserController = require('../controllers/userController').addUserController;
let upgradeUserController = require('../controllers/userController').upgradeUserController;
let smsUserController = require('../controllers/userController').smsUserController;

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

/* POST send message */
router.post('/sms', smsUserController);

/* user routes */
router.get('/profile', isLoggedIn, function (req, res, next) {
  var email = req.user['email'];
  Payment.find({
    user: req.user
  }, function (err, orders) {

    if (err) {
      console.log(err);
    }

    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      cart.items = cart.generateArray();

    });

    if (orders[0] == undefined) {
      return res.render('user/profile', { msg: "<h3>You have no Order history.</h3>", email: email });
    }

    res.render('user/profile', { orders: orders, messages: req.flash('info'), email: email });
  });

});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});


// router.use('/', notLoggedIn, function (req, res, next) {
//   next();
// });

router.get("/signup", function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/profile');
  }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);

  } else {
    res.redirect('/profile');
  }
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}


var generateArray = function () {
  var arr = [];
  for (var id in this.items) {
    arr.push(this.items[id]);
  }
  return arr;
};

module.exports = router;
