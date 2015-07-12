'use strict';

describe('MainCtrl', function() {

  beforeEach(module('vacacionesPermanentes'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));
  
  describe('agregado y borrado de viajes', function() {

  	beforeEach(function() {
      $scope = {};
  	  controller = $controller('MainCtrl', { $scope: $scope });
  	  $scope.nombre = 'viajeEjemplo';
    });

  	it('agrega un nuevo viaje', function () {
      $scope.addViaje();

      expect($scope.viajes.length).toEqual(1);
    });
  });

  	it('borra un viaje', function () {
      $scope.addViaje();
      $scope.delViaje($scope.viajes[0])

      expect($scope.viajes.length).toEqual(0);
    });
  });

});