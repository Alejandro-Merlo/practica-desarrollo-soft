var mongoose = require('mongoose');

var ViajeSchema = new mongoose.Schema({
  nombre: String,
  usuario: String,
  destinos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destino' }],
  pois: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poi' }],
});

mongoose.model('Viaje', ViajeSchema);