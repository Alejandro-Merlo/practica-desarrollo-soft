var mongoose = require('mongoose');

var PoiSchema = new mongoose.Schema({
  types: [String],
  ciudad: String,
  nombre: String,
  localizacion: [String],
  icono: String,
  viaje: { type: mongoose.Schema.Types.ObjectId, ref: 'Viaje' }
});

mongoose.model('Poi', PoiSchema);