const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');
function openDb(){ return new sqlite3.Database(dbPath); }

const AUTO_TOPUP_THRESHOLD = 50.0;
const AUTO_TOPUP_AMOUNT = 200.0;

router.post('/', (req,res)=>{
  const { user_id, amount } = req.body;
  if(!user_id||!amount) return res.status(400).json({error:'user_id and amount required'});
  const db = openDb();
  db.get('SELECT * FROM wallets WHERE user_id = ?', [user_id], (err,w)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!w) return res.status(404).json({error:'wallet not found'});
    if(w.balance < amount) return res.status(402).json({error:'Insufficient balance'});
    const newBal = w.balance - parseFloat(amount);
    db.run('UPDATE wallets SET balance = ? WHERE id = ?', [newBal, w.id]);
    db.run('INSERT INTO transactions (wallet_id, amount, type) VALUES (?,?,?)', [w.id, -parseFloat(amount), 'fare']);
    let finalBal = newBal;
    let auto_topup=false;
    if(finalBal < AUTO_TOPUP_THRESHOLD){
      finalBal += AUTO_TOPUP_AMOUNT;
      db.run('UPDATE wallets SET balance = ? WHERE id = ?', [finalBal, w.id]);
      db.run('INSERT INTO transactions (wallet_id, amount, type) VALUES (?,?,?)', [w.id, AUTO_TOPUP_AMOUNT, 'autotopup']);
      auto_topup=true;
    }
    res.json({wallet:{id:w.id, balance:finalBal}, auto_topup});
  });
});

module.exports = router;
