const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // room for base64 image refs if you send them

const breedsRouter = require('./routes/breeds');
const scansRouter = require('./routes/scans');

app.use('/api/breeds', breedsRouter);
app.use('/api/scans', scansRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SIH25004 backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
