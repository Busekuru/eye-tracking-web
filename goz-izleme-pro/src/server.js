const express = require('express');
require('./db');             // db.js’i çalıştır, bağlantıyı kurar
const path = require('path');          
const Gaze = require('./models/Gaze');  
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));



app.post('/api/saveGaze', async (req, res) => {
    try {
        const docs = await Gaze.insertMany(req.body);
        console.log(`✅ ${docs.length} kayıt MongoDB’ye eklendi.`);
        res.json({ status: 'kaydedildi', received: docs.length });

    }catch (err) {
        console.error('❌ MongoDB kaydetme hatası:', err);
        res.status(500).json({ status: 'hata', message: err.message });
    }

});
    

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde dinliyor`);
});