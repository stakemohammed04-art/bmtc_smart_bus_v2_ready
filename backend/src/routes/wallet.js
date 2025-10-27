const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');
function openDb(){ return new sqlite3.Database(dbPath); }

router.get('/:user_id', (req,res)=>{
  const db = openDb();
  db.get('SELECT * FROM wallets WHERE user_id = ?', [req.params.user_id], (err,w)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!w) return res.status(404).json({error:'wallet not found'});
    db.all('SELECT id, amount, type, timestamp FROM transactions WHERE wallet_id = ? ORDER BY timestamp DESC LIMIT 20', [w.id], (err2,txs)=>{
      res.json({wallet:w, transactions: txs});
    });
  });
});

router.post('/topup', (req,res)=>{
  const { user_id, amount } = req.body;
  if(!user_id||!amount) return res.status(400).json({error:'user_id and amount required'});
  const db = openDb();
  db.get('SELECT * FROM wallets WHERE user_id = ?', [user_id], (err,w)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!w) return res.status(404).json({error:'wallet not found'});
    const newBal = w.balance + parseFloat(amount);
    db.run('UPDATE wallets SET balance = ? WHERE id = ?', [newBal, w.id]);
    db.run('INSERT INTO transactions (wallet_id, amount, type) VALUES (?,?,?)', [w.id, parseFloat(amount),'topup']);
    res.json({wallet:{id:w.id, balance:newBal}});
  });
});

module.exports = router;
