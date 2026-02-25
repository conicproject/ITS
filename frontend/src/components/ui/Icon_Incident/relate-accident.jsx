import React from 'react';
import { FaCarCrash, FaCarSide, FaMotorcycle, FaAmbulance, FaTools } from "react-icons/fa";

const ICONS = {
  default: FaCarCrash,
  crash: FaCarCrash,
  rollover: FaCarSide,
  motorcycle_fall: FaMotorcycle,
  injury: FaAmbulance,
  breakdown: FaTools // เพิ่มรถเสียในกลุ่มอุบัติเหตุ
};

const RelateAccidentIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.55;
  const SelectedIcon = ICONS[variant] || ICONS['default'];
  return (
    <div className={className} style={{
      backgroundColor: '#EF4444', width: `${size}px`, height: `${size}px`,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2px solid white', boxShadow: '0 3px 6px rgba(0,0,0,0.4)', color: 'white'
    }}>
      <SelectedIcon style={{ fontSize: `${iconSize}px` }} />
    </div>
  );
};
export default RelateAccidentIcon;