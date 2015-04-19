var app = angular.module('vacacionesPermanentes', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['viajes', function(viajes){
          return viajes.getAll();
        }]
      }
    })

  $stateProvider
    .state('viajes', {
      url: '/viajes/{id}',
      templateUrl: '/viajes.html',
      controller: 'ViajesCtrl',
      resolve: {
        viaje: ['$stateParams', 'viajes', function($stateParams, viajes) {
          return viajes.get($stateParams.id);
        }]
      }
    });


  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

  $stateProvider    
    .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

  $urlRouterProvider.otherwise('home')

}]);





app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['vacaciones-permanentes-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['vacaciones-permanentes-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('vacaciones-permanentes-token');
  };

  return auth;
}])




app.factory('viajes', ['$http', 'auth', function($http, auth){
  var o = {
    viajes: []
  };

  o.getAll = function() {
    return $http.get('/viajes').success(function(data){
      angular.copy(data, o.viajes);
    });
  };

  o.create = function(viaje) {
    return $http.post('/viajes', viaje, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.viajes.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/viajes/' + id).then(function(res){
      return res.data;
    });
  };

  o.addDestino = function(id, destino) {
    return $http.post('/viajes/' + id + '/destinos', destino, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    })
  };

  o.delete = function(id) {
  	return $http.post('/viajes/' + id, {
  		headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data) {
      o.viajes.push(data);
    });
  };

  return o;
}]);




app.controller('MainCtrl', [
'$scope',
'viajes',
'auth',
function($scope, viajes, auth){

  $scope.viajes = viajes.viajes
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addViaje = function(){
    if(!$scope.nombre || $scope.nombre === '') { return; }
  
    viajes.create({
      nombre: $scope.nombre,
    });
    $scope.nombre = '';
  };

  $scope.delViaje = function(id){
  	viajes.delete(id);
  }

}]);





app.controller('ViajesCtrl', [
'$scope',
'viajes',
'viaje',
'auth',
'$state',
function($scope, viajes, viaje, auth, $state){

  $scope.viaje = viaje;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addDestino = function(){
    if(!$scope.ciudad || $scope.ciudad === '') { return; }
    if(!$scope.fechaArribo || $scope.fechaArribo === '') { return; }
    if(!$scope.fechaPartida || $scope.fechaPartida === '') { return; }

    viajes.addDestino(viaje._id, {
      ciudad: $scope.ciudad,
      fechaArribo: new Date($scope.fechaArribo),
      fechaPartida: new Date($scope.fechaPartida),
    }).success(function(destino) {
      $scope.viaje.destinos.push(destino);
    });
    $scope.ciudad = '';
    $scope.fechaArribo = '';
    $scope.fechaPartida = '';
  };

  $scope.goBack = function(){
    $state.go('home');
  };

}]);





app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])





app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);