const mongoose = require('mongoose');

// Her bir göz verisi noktası için şema
const GazeSchema = new mongoose.Schema({
  x:   { type: Number, required: true },     // Ekranın x-koordinatı
  y:   { type: Number, required: true },     // Ekranın y-koordinatı
  t:   { type: Number, required: true },     // Videodaki zaman (saniye)
  createdAt: { type: Date, default: Date.now } // Kayıt zamanı
});

// 'Gaze' adıyla model oluştur ve dışa aktar
module.exports = mongoose.model('Gaze', GazeSchema);