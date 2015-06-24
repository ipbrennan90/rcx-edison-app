var express = require('express');
var router = express.Router();
var passport = require('passport')
var bcrypt = require('bcrypt')

router.post("/", function (req, res, next) {
  passport.authenticate('local', function(err, user, info){

    if(err) {return next(err);}
    if(!user){

      return res.send({success:false, message: 'authentication failed'})
    }
    return res.send({success:true, message: 'authentication succeeded'})
  })
  //   req.logIn(account, function(){
  //     res.status(err ? 500 : 200).send( err ? err : account);
  //   });
  // })(this.req, this.res, this.next)
  res.end()
});

module.exports = router;
