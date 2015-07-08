var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , connString = "postgres:@localhost/rcx"
    , client = new pg.Client(connString)
    , bcrypt = require('bcrypt')
    , session = require('express-session')
    , bodyParser = require('body-parser');
    
router.get('/',function(req,res){

  req.session.destroy(function(err){
    if(err){
    console.log(err);
    }else{
    res.send(200);
  }
});
