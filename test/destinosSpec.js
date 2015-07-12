'use strict';

describe('ViajesCtrl', function() {

  beforeEach(module('vacacionesPermanentes'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));
  
  describe('$scope.addDestino', function() {

  	beforeEach(function() {
      $scope = {};
  	  controller = $controller('MainCtrl', { $scope: $scope });

  	  $scope.viaje = { nombre: 'viajeEjemplo', usuario: 'Alejandro', destinos: [], pois: [] }
  	  $scope.ciudad.formatted_address = 'Buenos Aires, Argentina';
      $scope.ciudad.name = 'Destino Ejemplo';
      $scope.ciudad.geometry.location.A = '35.55';
      $scope.ciudad.geometry.location.F = '38.25';
      $scope.ciudad.icon = 'icono';
      $scope.fechaArribo = new Date(2015, 07, 11);
      $scope.fechaPartida = new Date(2015, 07, 17);
    });

  	it('agrega un nuevo destino a un viaje', function () {
      $scope.addDestino();

      expect($scope.viaje.destinos.length).toEqual(1);
    });
  });

  	it('borra un destino a un viaje', function () {
      $scope.addDestino();
      $scope.delDestino($scope.viaje._id, $scope.viaje.destinos[0])

      expect($scope.viajes.destinos.length).toEqual(0);
    });
  });

});