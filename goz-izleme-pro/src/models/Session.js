const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: {
    name: { type: String },
    age: { type: Number },
    gender: { type: String }
  },
  heatmaps: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
