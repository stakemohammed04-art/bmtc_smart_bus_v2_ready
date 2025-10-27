import React, {useState} from 'react';
import axios from 'axios';

export default function StudentPass(){
  const [form,setForm]=useState({name:'',email:'',college:'',route_from:'Home',route_to:'College',route_option:1});
  const [msg,setMsg]=useState(null);
  const submit=async(e)=>{
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(k=>data.append(k, form[k]));
    try{
      const res = await axios.post('/student/request', data, { headers: {'Content-Type':'multipart/form-data'} });
      setMsg('Pass requested. ID: '+res.data.pass_id);
    }catch(err){ setMsg('Error: '+(err.response?.data?.error || err.message)); }
  };
  return (<div>
    <h3>Student Pass</h3>
    <form onSubmit={submit}>
      <input placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
      <input placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
      <input placeholder='College' value={form.college} onChange={e=>setForm({...form,college:e.target.value})}/>
      <input placeholder='Route from' value={form.route_from} onChange={e=>setForm({...form,route_from:e.target.value})}/>
      <input placeholder='Route to' value={form.route_to} onChange={e=>setForm({...form,route_to:e.target.value})}/>
      <label>Option</label>
      <select value={form.route_option} onChange={e=>setForm({...form,route_option:parseInt(e.target.value)})}>
        <option value={1}>Option 1</option>
        <option value={2}>Option 2</option>
      </select>
      <button type='submit'>Request Pass</button>
    </form>
    {msg && <div style={{marginTop:8}}>{msg}</div>}
  </div>);
}
