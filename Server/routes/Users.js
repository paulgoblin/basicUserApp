'use strict';

const express = require('express');
const User = require('../models/userModel');

let router = express.Router();

router.get('/', function (req, res){
  User.find({}, function (err, users){
    res.status(err ? 400 : 200).send(err || users);
  })
})

router.post('/favorites', function (req, res){
  console.log(req.body, req.userId);
  User.findByIdAndUpdate(req.userId, {$addToSet: {favorites:req.body.favorites}}, function (err, updatedUser){
    res.status(err ? 400 : 200).send(err || updatedUser);
  });
})

router.post('/admin', function (req, res){
  console.log('hit', req.isAdmin);
  if (req.isAdmin){
    console.log('isAdmin');
    res.send('ok');
    // User.findByIdAndUpdate(req.body.id, {isAdmin: true}, function (err, newAdmin){
    //   res.status(err ? 400 : 200).send(err || newAdmin);
    // })
  }else{
    res.status(400).send('You are not authorized to do this action');
  }
})

router.put('/', function (req, res){
  if (req.userId === req.body.id){
    User.findByIdAndUpdate(req.userId, req.body, function (err, updatedUser){
      res.status(err ? 400 : 200).send(err || updatedUser);
    })
  }else if (req.isAdmin){
    User.findByIdAndUpdate(req.body.id, req.body, function (err, updatedUser){
      res.status(err ? 400 : 200).send(err || updatedUser);
    })
  }else{
    res.status(400).send('You are not authorized to do this action');
  }
})

router.delete('/', function (req, res){
  if (req.userId === req.body.id){
    User.findByIdAndRemove(req.body.id, function (err, removedUser){
      res.status(err ? 400 : 200).send(err || 'removed');
    })
  }else if (req.isAdmin){
    User.findByIdAndRemove(req.body.id, function (err, removedUser){
      res.status(err ? 400 : 200).send(err || 'removed');
    })
  }else{
    res.status(400).send('You are not authorized to do this action');
  }
})

module.exports = router;