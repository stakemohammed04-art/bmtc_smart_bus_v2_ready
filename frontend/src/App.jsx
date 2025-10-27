import React from 'react';
import StudentPass from './components/StudentPass';
import AdminPanel from './components/AdminPanel';
import BusMap from './components/BusMap';

export default function App(){ 
  return (<div style={{padding:16}}>
    <h1>BMTC Smart Bus v2</h1>
    <div style={{display:'flex',gap:16}}>
      <div style={{flex:1}}><StudentPass /></div>
      <div style={{flex:1}}><AdminPanel /></div>
    </div>
    <div style={{marginTop:20}}><BusMap /></div>
  </div>);
}
