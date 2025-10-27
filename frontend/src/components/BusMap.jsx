import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default function BusMap(){
  const [buses,setBuses]=useState([]);
  const fetchBuses=async()=>{
    try{ const res = await axios.get('/bus/latest'); setBuses(res.data.buses || []); }catch(e){}
  };
  useEffect(()=>{ fetchBuses(); const id=setInterval(fetchBuses,3000); return ()=>clearInterval(id); },[]);
  return (<div style={{height:400}}>
    <MapContainer center={[12.9716,77.5946]} zoom={13} style={{height:'100%', width:'100%'}}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {buses.map((b,i)=>(<Marker key={i} position={[b.latitude,b.longitude]}><Popup>{b.bus_id}</Popup></Marker>))}
    </MapContainer>
  </div>);
}
