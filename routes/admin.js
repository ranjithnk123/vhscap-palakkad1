var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers')
var objectId = require('mongodb').ObjectID
const verifyLogin = (req, res, next) => {
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/', verifyLogin, function(req, res, next) {
  let admin = req.session.admin
  console.log(admin)
  if(req.session.admin){
    res.render('', {admin})
  }
});
router.get('/login', (req,res) => {
  if(req.session.admin){
    res.redirect('/admin')
  }
  else{
    res.render('admin/login', {"loginErr": req.session.adminLoginErr})
    req.session.adminLoginErr = false
  }
})
router.get('/signup', (req,res) => {
  res.render('admin/signup')
})
router.post('/signup', (req,res) => {
  adminHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.admin = response
    req.session.adminLoggedIn = true
    res.redirect('/admin')
  })
})
router.post('/login', (req, res) =>{
  adminHelpers.doLogin(req.body).then((response) => {
    if(response.status){
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    }
    else{
      req.session.adminLoginErr = "Invalid username or password"
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin = null
  req.session.adminLoggedIn = false
  res.redirect('/admin')
})
router.get('/users', verifyLogin, async(req, res) => {
  let users = await adminHelpers.getAllUsers().then((users) => {
    res.render('admin/users', {users, admin: req.session.admin})
  })
})

module.exports = router;