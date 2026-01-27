// src/components/Icon_Incident/hazardous-incident.jsx
import React from 'react';
import { 
  FaWater,      // น้ำท่วม
  FaFireAlt,    // ไฟ/ควัน
  FaSmog,       // หมอก/ควัน
  FaCloudShowersHeavy // ฝนตกหนัก
} from "react-icons/fa";

const ICONS = {
  default: FaWater,
  flood: FaWater,        // AI: Water Level / Puddle
  fire: FaFireAlt,       // AI: Fire / Flame
  smoke: FaSmog,         // AI: Smoke / Fog
  rain: FaCloudShowersHeavy // AI: Heavy Rain (Visual Noise)
};

const HazardousIncidentIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];

  return (
    <div className={className} style={{
      backgroundColor: '#3B82F6', // Blue-500
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid white',
      boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
      color: 'white',
      fontSize: `${iconSize}px`
    }}>
      <SelectedIcon />
    </div>
  );
};

export default HazardousIncidentIcon;