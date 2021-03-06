var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

/* Make sure to use the same secret as the one in models/User.js for generating tokens.
 * Again, we're hard-coding the token in this example but it is strongly recommended that
 * you use an environment variable for referencing your secret.
*/
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var User = mongoose.model('User');
var Destino = mongoose.model('Destino');
var Poi = mongoose.model('Poi');
var Viaje = mongoose.model('Viaje');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/viajes', auth, function(req, res, next) {
  var query = Viaje.find().where('usuario', req.payload.username);

  query.exec( function(err, viajes){
    if(err){ return next(err); }

    res.json(viajes);
  });
});

router.post('/viajes', auth, function(req, res, next) {
  var viaje = new Viaje(req.body);
  viaje.usuario = req.payload.username;

  viaje.save(function(err, viaje){
    if(err){ return next(err); }

    res.json(viaje);
  });
});

router.delete('/viajes/:viaje', auth, function(req, res, next) {
  viaje = req.viaje;

  viaje.remove(function(err, viaje){
    if(err){ return next(err); }

    if (viaje.destinos.length > 0) {
      for (var i = 0; i < viaje.destinos.length; i++) {
      	destino = viaje.destinos[i];
      	Destino.findById(destino).remove().exec();
      }
      res.json();
    } else {
      res.json();
    }
  });
});

router.param('viaje', function(req, res, next, id) {
  var query = Viaje.findById(id);

  query.exec(function (err, viaje){
    if (err) { return next(err); }
    if (!viaje) { return next(new Error('no se encuentra el viaje')); }

    req.viaje = viaje;
    return next();
  });
});

router.get('/viajes/:viaje', function(req, res, next) {
  req.viaje.populate('destinos', function(err, viaje) {
    if (err) { return next(err); }

      req.viaje.populate('pois', function(err, viaje) {
        if (err) { return next(err); }
 
        res.json(viaje);
    });
  });
});

router.post('/viajes/:viaje/destinos', auth, function(req, res, next) {
  var destino = new Destino(req.body);
  destino.viaje = req.viaje;

  destino.save(function(err, destino){
    if(err){ return next(err); }

    req.viaje.destinos.push(destino);
    req.viaje.save(function(err, viaje) {
      if(err){ return next(err); }

      res.json(destino);
    });
  });
});

router.post('/viajes/:viaje/pois', auth, function(req, res, next) {
  var poi = new Poi(req.body);
  poi.viaje = req.viaje;

  poi.save(function(err, poi){
    if(err){ return next(err); }

    req.viaje.pois.push(poi);
    req.viaje.save(function(err, viaje) {
      if(err){ return next(err); }

      res.json(poi);
    });
  });
});

router.delete('/viajes/:viaje/destinos/:destino', auth, function(req, res, next) {
  destino = req.destino;

  destino.remove(function(err, destino){
    if(err){ return next(err); }

    index = req.viaje.destinos.indexOf(destino);
    req.viaje.destinos.splice(index, 1);
    req.viaje.save(function(err, viaje) {
      if(err){ return next(err); }

      res.json();
    });
  });
});

router.param('destino', function(req, res, next, id) {
  var query = Destino.findById(id);

  query.exec(function (err, destino){
    if (err) { return next(err); }
    if (!destino) { return next(new Error('No se encuentra el destino')); }

    req.destino = destino;
    return next();
  });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Por favor, completa todos los campos'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Por favor, completa todos los campos'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;