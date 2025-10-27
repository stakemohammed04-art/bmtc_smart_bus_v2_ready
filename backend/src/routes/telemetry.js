const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');
function openDb(){ return new sqlite3.Database(dbPath); }

router.post('/update', (req,res)=>{
  const { bus_id, latitude, longitude, speed } = req.body;
  if(!bus_id||latitude===undefined||longitude===undefined) return res.status(400).json({error:'bus_id, latitude, longitude required'});
  const db = openDb();
  db.run('INSERT INTO telemetry (bus_id, latitude, longitude, speed) VALUES (?,?,?,?)', [bus_id, latitude, longitude, speed||0], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({ok:true, id:this.lastID});
  });
});

router.get('/latest', (req,res)=>{
  const db = openDb();
  db.all(`SELECT t.* FROM telemetry t INNER JOIN (SELECT bus_id, MAX(timestamp) maxts FROM telemetry GROUP BY bus_id) mx ON t.bus_id=mx.bus_id AND t.timestamp=mx.maxts`, [], (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({buses:rows});
  });
});

module.exports = router;
