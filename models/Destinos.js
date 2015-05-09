var mongoose = require('mongoose');

var DestinoSchema = new mongoose.Schema({
  ciudad: String,
  localizacion: [String], // Las coordenadas del lugar
  icono: String,
  fechaArribo: Date,
  fechaPartida: Date,
  viaje: { type: mongoose.Schema.Types.ObjectId, ref: 'Viaje' }
});

mongoose.model('Destino', DestinoSchema);