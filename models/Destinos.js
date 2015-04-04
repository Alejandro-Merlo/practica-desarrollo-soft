var mongoose = require('mongoose');

var DestinoSchema = new mongoose.Schema({
  ciudad: String,
  viaje: { type: mongoose.Schema.Types.ObjectId, ref: 'Viaje' }
});

mongoose.model('Destino', DestinoSchema);