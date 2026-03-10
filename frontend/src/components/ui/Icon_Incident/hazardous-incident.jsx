import React from 'react';
import { FaWater, FaFireAlt, FaSmog, FaCloudShowersHeavy, FaBiohazard } from "react-icons/fa";

const ICONS = {
  default: FaWater,
  flood: FaWater,
  fire: FaFireAlt,
  smoke: FaSmog,
  rain: FaCloudShowersHeavy,
  chemical: FaBiohazard // เพิ่มสารเคมีรั่วไหล
};

const HazardousIncidentIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];
  return (
    <div className={className} style={{
      backgroundColor: '#3B82F6', width: `${size}px`, height: `${size}px`,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2px solid white', boxShadow: '0 3px 6px rgba(0,0,0,0.4)', color: 'white'
    }}>
      <SelectedIcon style={{ fontSize: `${iconSize}px` }} />
    </div>
  );
};
export default HazardousIncidentIcon;