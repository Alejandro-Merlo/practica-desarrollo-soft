'use strict';

describe('AuthCtrl', function() {

  beforeEach(module('vacacionesPermanentes'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));
  
  describe('registro y logeo', function() {

  	beforeEach(function() {
      $scope = {};
  	  controller = $controller('AuthCtrl', { $scope: $scope });
    });

  	it('registra a un nuevo usuario', function () {
      $scope.user.username = "Alejandro";
      $scope.user.password = "1234";
      $scope.register();

      expect($scope.test).toEqual("OK");
    });
  });

  	it('logea al usuario', function () {
  	  $scope.user.username = "Alejandro";
      $scope.user.password = "1234";
  	  $scope.logIn();
      
      expect($scope.test).toEqual("OK");
    });
  });

});