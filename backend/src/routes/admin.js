const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');
function openDb(){ return new sqlite3.Database(dbPath); }

// list pending passes
router.get('/pending-passes', (req,res)=>{
  const db = openDb();
  db.all('SELECT p.id, u.name, u.email, p.route_from, p.route_to, p.valid_until FROM passes p JOIN users u ON p.user_id=u.id WHERE p.status="pending"', [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({pending: rows});
  });
});

// verify pass
router.post('/verify/:id', (req,res)=>{
  const id = req.params.id;
  const db = openDb();
  db.run('UPDATE passes SET status="active", college_verified=1 WHERE id=?', [id], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({success:true, changes:this.changes});
  });
});

module.exports = router;
