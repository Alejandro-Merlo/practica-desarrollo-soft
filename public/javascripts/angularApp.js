var app = angular.module('vacacionesPermanentes', ['ui.router', 'google.places', 'uiGmapgoogle-maps', 'ngDialog', 'ui.calendar', 'ui.bootstrap']);

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
    });

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

  $urlRouterProvider.otherwise('home');

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
}]);




app.factory('viajes', ['$http', 'auth', function($http, auth){
  var o = {
    viajes: []
  };

  getToken = function() {
  	return {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    };
  };

  o.getAll = function() {
    return $http.get('/viajes', getToken()).success(function(data){
      angular.copy(data, o.viajes);
    });
  };

  o.create = function(viaje) {
    return $http.post('/viajes', viaje, getToken()).success(function(data){
      o.viajes.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/viajes/' + id).then(function(res){
      return res.data;
    });
  };

  o.addDestino = function(id, destino) {
    return $http.post('/viajes/' + id + '/destinos', destino, getToken());
  };

  o.addPOI = function(id, poi) {
    return $http.post('/viajes/' + id + '/pois', poi, getToken());
  };

  o.delete = function(id) {
  	return $http.delete('/viajes/' + id, getToken()
  	).success(function(data) {
      o.getAll();
    });
  };

  o.delDestino = function(id, idDestino) {
  	return $http.delete('/viajes/' + id + '/destinos/' + idDestino, getToken());
  };

  return o;
}]);




app.controller('MainCtrl', [
'$scope',
'viajes',
'auth',
'ngDialog',
function($scope, viajes, auth, ngDialog){

  $scope.viajes = viajes.viajes;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addViaje = function(){
    if(!$scope.nombre || $scope.nombre === '') { return; }
  
    viajes.create({
      nombre: $scope.nombre,
    });
    $scope.test = 'OK';
    $scope.nombre = '';
  };

  $scope.delViaje = function(viaje){
  	var objeto = viaje.nombre;

  	ngDialog.openConfirm({
  	  template: 'deleteConfirmation',
  	  data: { objeto: objeto },
  	  className: 'ngdialog-theme-default'
  	}).then(function() {
  		viajes.delete(viaje._id);
  	});
  };

}]);





app.controller('ViajesCtrl', [
'$scope',
'viajes',
'viaje',
'auth',
'$state',
'$window',
'ngDialog',
function($scope, viajes, viaje, auth, $state, $window, ngDialog){

  $scope.viaje                = viaje;
  $scope.isLoggedIn           = auth.isLoggedIn;
  $scope.autocompleteOptions1 = { types: ['(cities)'] };
  $scope.autocompleteOptions2 = { types: ['establishment'] };
  $scope.autocompleteOptions3 = { types: ['lodging'] };
  $scope.googlemap            = {};
  $scope.eventSources         = [];
  $scope.fechaArribo          = new Date();
  $scope.fechaPartida         = new Date();
  $scope.selected             = {show: false, lodging: false};

  // Configuración del calendario
  $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

  // Configuración de google map
  $scope.mapOptions = {
      minZoom: 3,
      zoomControl: false,
      draggable: true,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: false,
      keyboardShortcuts: true,
      markers: {
          selected: {}
      },
      styles: [{
          featureType: "poi",
          elementType: "labels",
          stylers: [{
              visibility: "off"
          }]
      }, {
          featureType: "transit",
          elementType: "all",
          stylers: [{
              visibility: "off"
          }]
      }],
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.map = {
  	center: {
  	  latitude: 32.779680,
  	  longitude: -79.935493
    },
    zoom: 14,
    control:{} ,
    options:$scope.mapOptions,
    events: {
      tilesloaded: function (maps, eventName, args) {},
      dragend: function (maps, eventName, args) {},
      zoom_changed: function (maps, eventName, args) {}
    }
  };

  // Resuelve la ruta a seguir en el viaje
  if (viaje.destinos.length !== 0) {
    var paths  = [];
    var events = [];

    for(var i = 0; i < viaje.destinos.length; i++) {
      var destino = viaje.destinos[i];

      events.push({
        title: destino.ciudad,
        start: destino.fechaArribo,
        end: destino.fechaPartida,
        className: [destino.ciudad]
      });

      paths.push({
      	latitude: destino.localizacion[0],
      	longitude: destino.localizacion[1]
      });
    }

    $scope.eventSources = [events];
  	$scope.map.center   = { latitude: viaje.destinos[0].localizacion[0], longitude: viaje.destinos[0].localizacion[1] };
    $scope.lines        = { path: paths, stroke: { color: "#DAA520", weight: 10, opacity: 0.75 } };
  }

  if (viaje.pois.length !== 0) {
    var models = [];

    for(var o = 0; o < viaje.pois.length; o++) {
      var poi = viaje.pois[o];
      var isLodging = false;

      for(var e = 0; e < poi.types.length; e++) {
      	if (poi.types[e] == 'lodging') {
      		isLodging = true;
      	}
      }

      marker = {
      	id: o+1,
      	latitude: poi.localizacion[0],
      	longitude: poi.localizacion[1],
      	icon: poi.icono,
      	title: poi.nombre,
      	address: poi.ciudad,
      	lodging: isLodging,
      	show: false
      };

      models.push(marker);
    }

    $scope.markers = { models: models };
  }

  marker.showInfo = function() {
    $scope.map.center = { latitude: poi.localizacion[0], longitude: poi.localizacion[1] };
    console.log("Marcador: ", marker);
    $scope.selected.show = false;
    $scope.selected = marker;
    $scope.selected.show = !$scope.selected.show;
    marker.show = $scope.selected.show;
    $scope.$apply();
  };

  marker.closeClick = function() {
    $scope.selected.show = false;
    marker.show = false;
    console.log("Marcador cerrado", marker);
    $scope.$apply();
  };

  $scope.addDestino = function(){
    if(!$scope.ciudad || $scope.ciudad === '') { return; }
    if(!$scope.fechaArribo || $scope.fechaArribo === '') { return; }
    if(!$scope.fechaPartida || $scope.fechaPartida === '') { return; }

    viajes.addDestino(viaje._id, {
      ciudad: $scope.ciudad.formatted_address,
      nombre: $scope.ciudad.name,
      localizacion: [$scope.ciudad.geometry.location.A, $scope.ciudad.geometry.location.F],
      icono: $scope.ciudad.icon,
      fechaArribo: $scope.fechaArribo,
      fechaPartida: $scope.fechaPartida,
    }).success(function(destino) {
      $scope.viaje.destinos.push(destino);
    });

    $scope.ciudad = '';
    $scope.fechaArribo = '';
    $scope.fechaPartida = '';
    $window.location.reload();
  };

  $scope.addPOI = function(){
  	if(!$scope.poi || $scope.poi === '') { return; }

  	viajes.addPOI(viaje._id, {
  	  types: $scope.poi.types,
      ciudad: $scope.poi.formatted_address,
      nombre: $scope.poi.name,
      localizacion: [$scope.poi.geometry.location.A, $scope.poi.geometry.location.F],
      icono: $scope.poi.icon,
    }).success(function(poi) {
      $scope.viaje.pois.push(poi);
    });

  	$scope.poi = '';
  	$window.location.reload();
  };

  $scope.goBack = function(){
    $state.go('home');
  };

  $scope.printDate = function(stringDate){
    return stringDate.split("T")[0];
  };

  $scope.delDestino = function(viaje_id, destino){
  	var objeto = 'ruta a ' + destino.ciudad;

  	ngDialog.openConfirm({
  	  template: 'deleteConfirmation',
  	  data: { objeto: objeto },
  	  className: 'ngdialog-theme-default'
  	}).then(function() {
  		viajes.delDestino(viaje_id, destino._id);
  		$window.location.reload();
  	});

  };

  $scope.isLodging = function() {
  	console.log('poi:', $scope.selected);
  	return $scope.selected.lodging;
  };

  $scope.openDatepicker1 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened1 = true;
  };

  $scope.openDatepicker2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened2 = true;
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
      $scope.test = 'OK';
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $scope.test = 'OK';
      $state.go('home');
    });
  };
}]);





app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);