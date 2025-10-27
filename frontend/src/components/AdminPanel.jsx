import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function AdminPanel(){
  const [pending,setPending]=useState([]);
  const [msg,setMsg]=useState(null);
  const load = async ()=>{
    try{ const res = await axios.get('/admin/pending-passes'); setPending(res.data.pending); }catch(e){}
  };
  useEffect(()=>{ load(); },[]);
  const verify = async(id)=>{
    try{ await axios.post('/admin/verify/'+id); setMsg('Verified '+id); load(); }catch(e){ setMsg('Error'); }
  };
  return (<div>
    <h3>Admin Panel</h3>
    {msg && <div>{msg}</div>}
    <ul>
      {pending.map(p=> (<li key={p.id}>{p.name} - {p.email} - {p.route_from} → {p.route_to} <button onClick={()=>verify(p.id)}>Verify</button></li>))}
    </ul>
  </div>);
}
