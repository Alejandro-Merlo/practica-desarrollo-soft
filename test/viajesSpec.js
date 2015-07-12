'use strict';

describe('Pagina principal', function() {

  beforeEach(module('vacacionesPermanentes'));

  var $scope, $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_) {
  	$rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('MainCtrl', { '$scope' : $scope });
  }));

  describe('MainCtrl', function() {
  	beforeEach(function() {
  	  $scope.nombre = 'viajeEjemplo';
    });

    it('deberia poder agregar un nuevo viaje', function () {
      $scope.addViaje();

      expect($scope.test).toEqual('OK');
    });

    it('deberia poder borrar un viaje', function () {
      $scope.addViaje();
      $scope.delViaje($scope.viajes[0])

      expect($scope.viajes.length).toEqual(0);
    });
  });
  
});