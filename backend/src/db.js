const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbFile = path.join(__dirname, '..', '..', 'bmtc_v2.db');

function init() {
  return new Promise((resolve, reject) => {
    const needSeed = !fs.existsSync(dbFile);
    const db = new sqlite3.Database(dbFile, (err) => {
      if (err) return reject(err);
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT UNIQUE, email TEXT UNIQUE, college TEXT, verified INTEGER DEFAULT 0)`);
        db.run(`CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, balance REAL DEFAULT 0)`);
        db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, wallet_id INTEGER, amount REAL, type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        db.run(`CREATE TABLE IF NOT EXISTS telemetry (id INTEGER PRIMARY KEY AUTOINCREMENT, bus_id TEXT, latitude REAL, longitude REAL, speed REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        db.run(`CREATE TABLE IF NOT EXISTS passes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, route_from TEXT, route_to TEXT, route_option INTEGER DEFAULT 1, valid_until TEXT, status TEXT DEFAULT 'pending', college_verified INTEGER DEFAULT 0)`);
      });
      resolve();
    });
  });
}

module.exports = { init, dbFile };
