const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, '..', '..', 'bmtc_v2.db');
function openDb(){ return new sqlite3.Database(dbPath); }

// file uploads stored in backend/uploads
const uploadDir = path.join(__dirname, '..', '..', 'backend_uploads');
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, `${Date.now()}-${uuidv4()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/request', upload.single('id_card'), (req,res)=>{
  const { name, email, college, route_from, route_to, route_option, valid_until } = req.body;
  const idCard = req.file ? req.file.filename : null;
  if(!email||!name) return res.status(400).json({error:'name and email required'});
  const db = openDb();
  db.serialize(()=>{
    db.run('INSERT OR IGNORE INTO users (name, email, college) VALUES (?,?,?)', [name, email, college], function(err){
      // ignore
    });
    db.get('SELECT id FROM users WHERE email = ?', [email], (err,row)=>{
      if(err) return res.status(500).json({error:err.message});
      const userId = row.id;
      db.run('INSERT INTO passes (user_id, route_from, route_to, route_option, valid_until, status, college_verified) VALUES (?,?,?,?,?, "pending", 0)',
        [userId, route_from, route_to, route_option||1, valid_until||null], function(err2){
          if(err2) return res.status(500).json({error:err2.message});
          res.json({success:true, pass_id: this.lastID});
        });
    });
  });
});

router.post('/:id/verify', (req,res)=>{
  const passId = req.params.id;
  const db = openDb();
  db.run('UPDATE passes SET college_verified=1, status="active" WHERE id = ?', [passId], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({success:true, updated:this.changes});
  });
});

router.get('/:id', (req,res)=>{
  const passId = req.params.id;
  const db = openDb();
  db.get('SELECT p.*, u.name, u.email FROM passes p JOIN users u ON p.user_id=u.id WHERE p.id = ?', [passId], (err,row)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!row) return res.status(404).json({error:'not found'});
    res.json(row);
  });
});

module.exports = router;
