'use strict';

describe('AuthCtrl', function() {

  beforeEach(module('vacacionesPermanentes'));

  var $scope, $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_) {
  	$rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('AuthCtrl', { '$scope': $scope });
  }));

  beforeEach(function() {
    $scope.user.username = "Alejandro";
    $scope.user.password = "1234";
  });

  it('registra a un nuevo usuario', function () {
    $scope.register();

    expect($scope.test).toEqual("OK");
  });

  it('logea al usuario', function () {
    $scope.logIn();
      
    expect($scope.test).toEqual("OK");
  });
  
});