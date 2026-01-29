// src/components/Icon_Incident/irregularitie.jsx
import React from 'react';
import { 
  FaTools,          // รถเสียทั่วไป
  FaExchangeAlt,    // สวนเลน/ย้อนศร
  FaHistory,        // ถอยหลัง
  FaBan             // จอดในที่ห้ามจอด
} from "react-icons/fa";

const ICONS = {
  default: FaTools,
  stopped_vehicle: FaTools,    // AI: Stopped Vehicle (Time threshold)
  wrong_way: FaExchangeAlt,    // AI: Wrong Way Driving
  reversing: FaHistory,        // AI: Reversing
  illegal_parking: FaBan       // AI: Illegal Parking
};

const IrregularitieIcon = ({ size = 36, variant = 'default', className = "" }) => {
  const iconSize = size * 0.5;
  const SelectedIcon = ICONS[variant] || ICONS['default'];

  return (
    <div className={className} style={{
      backgroundColor: '#F97316', // Orange-500
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

export default IrregularitieIcon;