'use strict';

describe('Pagina de registro', function() {

  beforeEach(function() {
  	module('vacacionesPermanentes');
  });

  var authCtrl,
  scope;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    authCtrl = $controller('AuthCtrl', {
      $scope: scope
    });
  }));
  it('debería dejar registrar a un usuario', function () {
    authCtrl.register()
    expect(scope.username).toEqual("Alejandro");
    expect(scope.password).toEqual("1234");
  });

});