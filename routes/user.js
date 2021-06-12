var express = require('express');
var router = express.Router();
const userHelpers=require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = req.session.user
  console.log(user)
  res.render('user/home', {user})
})
router.get('/login', (req,res) => {
  if(req.session.user){
    res.redirect('/')
  }
  else{
    res.render('user/login', {"loginErr": req.session.userLoginErr})
    req.session.userLoginErr = false
  }
})
router.get('/signup', (req,res) => {
  res.render('user/signup')
})
router.post('/signup', (req,res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.user = response
    req.session.userLoggedIn = true
    res.redirect('/')
  })
})
router.post('/login', (req, res) =>{
  userHelpers.doLogin(req.body).then((response) => {
    if(response.status){
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/')
    }
    else{
      req.session.userLoginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.userLoggedIn = false
  res.redirect('/')
})
router.get('/admission-info', function(req,res){
  res.render('user/admission-info', {user: req.session.user})
})
router.get('/help-desk', function(req,res){
  res.render('user/help-desk', {user: req.session.user})
})
router.get('/students', (req, res) => {
  res.render('user/students', {user: req.session.user})
})
router.get('/staff', (req, res) => {
  res.render('user/staff', {user: req.session.user})
})
router.get('/contact-us', (req, res) => {
  res.render('user/contact-us', {user: req.session.user})
})

module.exports = router;