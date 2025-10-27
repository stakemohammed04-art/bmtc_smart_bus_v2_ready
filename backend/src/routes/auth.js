const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');

function openDb(){ return new sqlite3.Database(dbPath); }

router.post('/otp', (req, res)=>{
  const { phone, name, email } = req.body;
  if(!phone) return res.status(400).json({error:'phone required'});
  const db = openDb();
  db.get('SELECT * FROM users WHERE phone = ?', [phone], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(row) return res.json({user:row});
    db.run('INSERT INTO users (name, phone, email, verified) VALUES (?,?,?,?)', [name||null, phone, email||null, 0], function(err2){
      if(err2) return res.status(500).json({error:err2.message});
      const userId = this.lastID;
      db.run('INSERT INTO wallets (user_id, balance) VALUES (?,?)', [userId, 200], ()=>{});
      db.get('SELECT * FROM users WHERE id = ?', [userId], (e,u)=> res.json({user:u}));
    });
  });
});

module.exports = router;
