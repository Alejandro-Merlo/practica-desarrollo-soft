'use strict';

describe('ViajesCtrl', function() {

  beforeEach(module('vacacionesPermanentes'));

  var scope, controller;

  beforeEach(inject(function($controller, $rootScope) {
  	scope = $rootScope.$new();
    controller = $controller('ViajesCtrl', { '$scope': scope });
  }));

  beforeEach(function() {
  	scope.viaje = { nombre: 'viajeEjemplo', usuario: 'Alejandro', destinos: [], pois: [] }
  	scope.ciudad.formatted_address = 'Buenos Aires, Argentina';
    scope.ciudad.name = 'Destino Ejemplo';
    scope.ciudad.geometry.location.A = '35.55';
    scope.ciudad.geometry.location.F = '38.25';
    scope.ciudad.icon = 'icono';
    scope.fechaArribo = new Date();
    scope.fechaPartida = new Date();
  });

  it('agrega un nuevo destino a un viaje', function () {
    scope.addDestino();

    expect(scope.viaje.destinos.length).toEqual(1);
  });

  it('borra un destino a un viaje', function () {
    scope.addDestino();
    scope.delDestino(scope.viaje._id, scope.viaje.destinos[0])

    expect(scope.viajes.destinos.length).toEqual(0);
  });
});