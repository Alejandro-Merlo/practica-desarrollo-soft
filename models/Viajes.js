var mongoose = require('mongoose');

var ViajeSchema = new mongoose.Schema({
  nombre: String,
  usuario: String,
  destinos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destino' }],
  /*time: String*/
});

mongoose.model('Viaje', ViajeSchema);