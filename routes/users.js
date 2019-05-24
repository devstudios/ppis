const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Cart = require('../models/cart');
const Payment = require('../models/payment');

const csrfProtection = csrf();
router.use(csrfProtection);

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


router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get("/signin", function (req, res, next) {
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