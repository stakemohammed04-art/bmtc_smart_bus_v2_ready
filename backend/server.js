const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./src/db');
const authRoutes = require('./src/routes/auth');
const walletRoutes = require('./src/routes/wallet');
const transactionRoutes = require('./src/routes/transaction');
const telemetryRoutes = require('./src/routes/telemetry');
const studentRoutes = require('./src/routes/student');
const adminRoutes = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'BMTC Smart Bus API v2' }));

app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/transaction', transactionRoutes);
app.use('/bus', telemetryRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// static frontend (if built)
const staticPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(staticPath));
app.get('/*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

db.init().then(()=>{
  app.listen(PORT, ()=> console.log(`Server running on http://127.0.0.1:${PORT}`));
}).catch(err=>{
  console.error('DB init failed', err);
});
